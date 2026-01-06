import Region from './models/Region';
import Vintage from './models/Vintage';
import { TOP_REGIONS } from './constants';
import { calculateGDD, calculateDiurnalShift, calculateGrapeyearScore, generateVintageSummary } from './calculations';

function getGrowingSeasonDates(year: number, isSouthernHelpers: boolean) {
    if (isSouthernHelpers) {
        // Southern Hemisphere: Oct (Prev Year) to April (Current Year)
        return {
            start: `${year - 1}-10-01`,
            end: `${year}-04-30`
        };
    } else {
        // Northern Hemisphere: Apr to Oct (Current Year)
        return {
            start: `${year}-04-01`,
            end: `${year}-10-31`
        };
    }
}

export async function fetchWeatherData(lat: number, lon: number, year: number, isSouthernHemisphere: boolean) {
    const { start, end } = getGrowingSeasonDates(year, isSouthernHemisphere);

    // Using Open-Meteo Archive API
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Weather API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

/**
 * Updates vintage data for the specified years.
 * If years is not provided, defaults to Current Year and Previous Year.
 */
export async function updateVintagesForRegions(years?: number[]) {
    // If no specific years requested, update "Active" vintages (Current + Previous)
    if (!years) {
        const currentYear = new Date().getFullYear();
        years = [currentYear, currentYear - 1];
    }

    console.log(`[Ingest] Starting update for years: ${years.join(', ')}`);
    let stats = { updated: 0, errors: 0 };

    for (const regionData of TOP_REGIONS) {
        // Ensure Region Exists
        let region = await Region.findOne({ slug: regionData.slug });
        if (!region) {
            console.log(`[Ingest] Creating missing region: ${regionData.name}`);
            region = await Region.create({
                ...regionData,
                location: { type: 'Point', coordinates: regionData.coordinates }
            });
        }

        const isSouthern = regionData.coordinates[1] < 0;

        for (const year of years) {
            // Retry logic for API rate limits
            let attempts = 0;
            let success = false;

            while (attempts < 3 && !success) {
                try {
                    // Constant delay to be polite to the API
                    await new Promise(r => setTimeout(r, 1000)); // Increased to 1s

                    const weatherData = await fetchWeatherData(regionData.coordinates[1], regionData.coordinates[0], year, isSouthern);

                    if (!weatherData.daily) {
                        console.warn(`[Ingest] No daily data for ${region.name} ${year}`);
                        break; // Don't retry if data is missing, only if fetch fails
                    }

                    const daily = weatherData.daily;
                    const processedDaily = daily.time.map((date: string, i: number) => ({
                        date,
                        maxTemp: daily.temperature_2m_max[i],
                        minTemp: daily.temperature_2m_min[i],
                        precipitation: daily.precipitation_sum[i],
                        sunshine: daily.sunshine_duration[i]
                    }));

                    // Calculate Metrics
                    const gdd = calculateGDD(processedDaily);
                    const diurnal = calculateDiurnalShift(processedDaily);
                    const totalRain = processedDaily.reduce((acc: number, d: any) => acc + (d.precipitation || 0), 0);
                    const avgTemp = processedDaily.reduce((acc: number, d: any) => acc + ((d.maxTemp + d.minTemp) / 2), 0) / processedDaily.length;
                    const sunshineHours = processedDaily.reduce((acc: number, d: any) => acc + (d.sunshine || 0), 0) / 3600;
                    const frostDays = processedDaily.filter((d: any) => d.minTemp < 0).length;

                    // Advanced Metrics
                    const heatSpikes = processedDaily.filter((d: any) => d.maxTemp >= 35).length;

                    // Growing season length approx 215 days. Early = first 60, Late = last 30.
                    const earlyFrostDays = processedDaily.slice(0, 60).filter((d: any) => d.minTemp < 0).length;
                    const lateFrostDays = processedDaily.slice(-30).filter((d: any) => d.minTemp < 0).length;
                    const harvestRainMm = processedDaily.slice(-30).reduce((acc: number, d: any) => acc + (d.precipitation || 0), 0);

                    // Drought Stress: Max consecutive days with < 1mm rain
                    let maxDrought = 0;
                    let currentDrought = 0;
                    processedDaily.forEach((d: any) => {
                        if ((d.precipitation || 0) < 1) {
                            currentDrought++;
                        } else {
                            maxDrought = Math.max(maxDrought, currentDrought);
                            currentDrought = 0;
                        }
                    });
                    maxDrought = Math.max(maxDrought, currentDrought);

                    // Score & AI Summary
                    const { score, quality } = calculateGrapeyearScore({ gdd, rainfall: totalRain, diurnal, sunshineHours, frostDays });
                    const aiSummary = generateVintageSummary({
                        gdd,
                        rainfall: totalRain,
                        sunshineHours,
                        frostDays,
                        regionName: region.name,
                        year,
                        heatSpikes,
                        earlyFrostDays,
                        lateFrostDays,
                        harvestRainMm,
                        droughtStressMaxDays: maxDrought
                    });

                    // Update DB
                    await Vintage.findOneAndUpdate(
                        { regionId: region._id, year },
                        {
                            regionId: region._id,
                            year,
                            grapeyearScore: score, // Todo: Update score calc later to include these
                            metrics: {
                                growingDegreeDays: Math.round(gdd),
                                totalRainfallMm: Math.round(totalRain * 10) / 10,
                                diurnalShiftAvg: Math.round(diurnal * 10) / 10,
                                avgTemperature: Math.round(avgTemp * 10) / 10,
                                sunshineHours: Math.round(sunshineHours),
                                frostDays: frostDays,
                                heatSpikes,
                                earlyFrostDays,
                                lateFrostDays,
                                harvestRainMm: Math.round(harvestRainMm * 10) / 10,
                                droughtStressMaxDays: maxDrought
                            },
                            quality,
                            aiSummary,
                            uniqueComposite: `${region._id}_${year}`
                        },
                        { upsert: true, new: true }
                    );

                    stats.updated++;
                    success = true;
                    // console.log(`[Ingest] Updated ${region.name} ${year}`);

                } catch (err: any) {
                    attempts++;
                    console.error(`[Ingest] Attempt ${attempts} failed for ${region.name} ${year}:`, err.message);
                    if (attempts >= 3) {
                        stats.errors++;
                    } else {
                        // Exponential backoff
                        await new Promise(r => setTimeout(r, 2000 * attempts));
                    }
                }
            }
        }
    }

    return stats;
}
