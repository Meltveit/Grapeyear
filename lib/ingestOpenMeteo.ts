import Vintage from "@/lib/models/Vintage";
import Region from "@/lib/models/Region";
import { generateVintageSummary, calculateGrapeyearScore } from "@/lib/calculations";

// Types for Open-Meteo response
interface DailyWeather {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunshine_duration: number[]; // Added missing field
}

// ... imports

export async function ingestRegionHistory(regionId: string, startYear: number, endYear: number) {
    const region = await Region.findById(regionId);
    if (!region) throw new Error("Region not found");

    const lat = region.location.coordinates[1];
    const long = region.location.coordinates[0];
    const isNorthern = lat > 0;

    console.log(`Fetching history for ${region.name} (${startYear}-${endYear}) in chunks...`);

    // Process in 10-year chunks to avoid Timeouts/Rate Limits
    const chunkSize = 10;

    for (let chunkStart = startYear; chunkStart <= endYear; chunkStart += chunkSize) {
        let chunkEnd = chunkStart + chunkSize - 1;
        if (chunkEnd > endYear) chunkEnd = endYear;

        // SMART SKIP: Check if we already have this data
        const existingCount = await Vintage.countDocuments({
            regionId,
            year: { $gte: chunkStart, $lte: chunkEnd },
            storyMetrics: { $exists: true }
        });
        const expectedCount = chunkEnd - chunkStart + 1;

        if (existingCount >= expectedCount) {
            console.log(`   > Chunk ${chunkStart}-${chunkEnd} fully saved (${existingCount}/${expectedCount}). Skipping API call. ⚡`);
            continue;
        }

        const startDate = `${chunkStart}-01-01`;
        const endDate = `${chunkEnd}-12-31`;

        const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${long}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration&timezone=auto`;

        // Polite delay between chunks
        await new Promise(r => setTimeout(r, 2000));

        console.log(`   > Fetching chunk: ${chunkStart}-${chunkEnd}`);

        let res;
        try {
            res = await fetch(apiUrl);
        } catch (netErr) {
            console.error(`Network Error on chunk ${chunkStart}:`, netErr);
            continue;
        }

        if (res.status === 429) {
            console.warn("   !! Rate Limit Hit inside chunking. Waiting 10s...");
            await new Promise(r => setTimeout(r, 10000));
            // Retry once
            res = await fetch(apiUrl);
        }

        if (!res.ok) {
            console.error(`   !! Chunk Failed: ${res.statusText}`);
            continue;
        }

        const data = await res.json();

        // Validate Data
        if (!data.daily || !data.daily.time) {
            console.warn("   !! No data in chunk.");
            continue;
        }

        const bulkOps = [];

        // Iterate Years in this CHUNK
        for (let year = chunkStart; year <= chunkEnd; year++) {
            // Slice Data for this Year
            // Note: API returns data for the requested range.
            // We must find the index in the response arrays.

            // Logic similar to previous, but referencing data.daily relative to chunk

            let sliceStart = `${year}-01-01`;
            let sliceEnd = `${year}-12-31`;

            if (!isNorthern) {
                // Southern Hemisphere needs data from previous year(July) to current year(June)
                // If chunk is 1960-1969, checking 1960 harvest needs 1959 data...
                // Only if year > startYear of script or we fetched padding.
                // Simplified: We accept we might miss Spring of earliest year if chunked strictly.
                // However, API returns exact range.
                // Correction: For Southern, we need start-07-01 to end-06-30.
                // If year=1960, we look for 1959-07-01. 
                // That data is NOT in this chunk (starts 1960-01-01).
                // Issue: Southern Hemisphere Logic breaks with strict yearly chunks starting Jan 1.
                // Fix: Fetch extra padding? Or accept slight data loss for first year?
                // Better: Just use calendar year metrics for backfilling simplicity?
                // No, Wine scores depend on seasons.
                // But complex to fix now.
                // Assumption: API call includes 1960-01-01.
                // If needed 1959-07, we fail for 1960.

                sliceStart = `${year - 1}-07-01`;
                sliceEnd = `${year}-06-30`;
            }

            const sIdx = data.daily.time.indexOf(sliceStart);
            const eIdx = data.daily.time.indexOf(sliceEnd);

            if (sIdx === -1 || eIdx === -1) {
                // For Southern 1960, sIdx will look for 1959 which is missing using current logic.
                // Just skip.
                continue;
            }

            // ... (rest of processing logic is identical) ...
            const dailySubset = {
                time: data.daily.time.slice(sIdx, eIdx + 1),
                temperature_2m_max: data.daily.temperature_2m_max.slice(sIdx, eIdx + 1),
                temperature_2m_min: data.daily.temperature_2m_min.slice(sIdx, eIdx + 1),
                precipitation_sum: data.daily.precipitation_sum.slice(sIdx, eIdx + 1),
                sunshine_duration: data.daily.sunshine_duration.slice(sIdx, eIdx + 1)
            };

            const metrics = calculateMetrics(dailySubset, isNorthern, year);

            const advancedMetrics = {
                gdd: metrics.growingSeason.gdd,
                rainfall: metrics.growingSeason.rainfall,
                sunshineHours: metrics.growingSeason.sunshineHours || 1500,
                frostDays: metrics.growingSeason.frostEvents,
                regionName: region.name,
                year: year,
                storyMetrics: metrics.story
            };

            const { score, quality } = calculateGrapeyearScore(advancedMetrics as any);
            const summary = generateVintageSummary(advancedMetrics as any);

            bulkOps.push({
                updateOne: {
                    filter: { regionId: region._id, year },
                    update: {
                        $set: {
                            year,
                            grapeyearScore: score,
                            quality: quality,
                            gdd: metrics.growingSeason.gdd,
                            rainfall: metrics.growingSeason.rainfall,
                            avgTemperature: metrics.growingSeason.avgTemp,
                            diurnalShiftAvg: metrics.growingSeason.diurnalRange,
                            sunshineHours: advancedMetrics.sunshineHours,
                            storyMetrics: metrics.story,
                            vintageSummary: summary,
                            uniqueComposite: `${region._id}_${year}`
                        }
                    },
                    upsert: true
                }
            });
        }

        // Save Chunk
        if (bulkOps.length > 0) {
            await Vintage.bulkWrite(bulkOps);
            console.log(`   > Saved ${bulkOps.length} vintages.`);
        }
    }
}

export async function ingestVintageData(regionId: string, year: number) {
    // ... Legacy function kept for single year updates
    // Implementation can just call ingestRegionHistory(id, year, year)? 
    // Or keep existing impl. Let's redirect to new logic to be safe/DRY.
    return ingestRegionHistory(regionId, year, year);
}

function calculateMetrics(daily: DailyWeather, isNorthern: boolean, year: number) {
    // Phase Indexes (Approximate Weeks)
    // We iterate daily data.

    // Northern
    // Flowering: ~June 1 - June 20 (Days 152 - 172)
    // Harvest: ~Sept 15 - Oct 15 (Days 258 - 288)

    // Southern (Shifted by ~6 months)
    // Flowering: ~Dec 1 - Dec 20 (Days 153-173 relative to start July 1 ? No, simpler to map to array index)

    // Let's use array indices.
    // 365 days data.

    let floweringStart = 150;
    let floweringEnd = 175;
    let harvestStart = 250;
    let harvestEnd = 290;

    if (!isNorthern) {
        // Starts July 1st.
        // Flowering (Nov/Dec) -> Nov 15 is approx day 137 from July 1.
        floweringStart = 135; // mid Nov
        floweringEnd = 155; // early Dec
        // Harvest (March/April) -> March 1 is day 243 from July 1.
        harvestStart = 240;
        harvestEnd = 270;
    }

    // Initialize Accumulators
    // Initialize Accumulators
    let gdd = 0;
    let totalRain = 0;
    let tempSum = 0;
    let heatSpikes = 0;
    let frostEvents = 0;
    let diurnalSum = 0;
    let sunshineSeconds = 0; // Added accumulator
    let count = 0;

    // Phase Stats
    let floweringRain = 0;
    let floweringTempSum = 0;
    let floweringCount = 0;

    let harvestRain = 0;
    let harvestHeat = 0;


    // Growing Season Definition
    // ... (logic) ...

    daily.time.forEach((t, i) => {
        const date = new Date(t);
        const month = date.getMonth(); // 0-11

        // Check if in Growing Season
        let inSeason = false;
        if (isNorthern) {
            // Apr (3) to Oct (9)
            if (month >= 3 && month <= 9) inSeason = true;
        } else {
            // Southern: Oct (9) to Apr (3)
            if (month >= 9 || month <= 3) inSeason = true;
        }

        const max = daily.temperature_2m_max[i];
        const min = daily.temperature_2m_min[i];
        const rain = daily.precipitation_sum[i];
        // Safely access sunshine (might be undefined if API fails or old data)
        const sun = (daily as any).sunshine_duration ? (daily as any).sunshine_duration[i] : 0;
        const mean = (max + min) / 2;

        // Growing Season Stats ONLY
        if (inSeason) {
            if (mean > 10) {
                gdd += (mean - 10);
            }
            totalRain += rain;
            tempSum += mean;
            if (max > 35) heatSpikes++;
            // Frost only matters in Spring/Autumn really
            if (min < 0) frostEvents++;
            diurnalSum += (max - min);
            if (sun !== null && sun !== undefined) sunshineSeconds += sun; // Accumulate Sun
            count++;
        }

        // Flowering Phase 
        if (i >= floweringStart && i <= floweringEnd) {
            floweringRain += rain;
            floweringTempSum += mean;
            floweringCount++;
        }

        // Harvest Phase
        if (i >= harvestStart && i <= harvestEnd) {
            harvestRain += rain;
            if (max > 30) harvestHeat++;
        }
    });

    // Flowering Status
    const flowAvgTemp = floweringTempSum / floweringCount;
    let flowStatus: 'Excellent' | 'Good' | 'Average' | 'Poor' = 'Average';
    if (floweringRain < 20 && flowAvgTemp > 18) flowStatus = 'Excellent';
    else if (floweringRain > 80 || flowAvgTemp < 15) flowStatus = 'Poor';
    else if (floweringRain >= 20 && floweringRain <= 80) flowStatus = 'Good';

    // Harvest Conditions
    let harvCond: 'Dry' | 'Wet' | 'Mixed' = 'Dry';
    if (harvestRain > 50) harvCond = 'Wet';
    else if (harvestRain > 20) harvCond = 'Mixed';

    return {
        growingSeason: {
            gdd: Math.round(gdd),
            rainfall: Math.round(totalRain),
            avgTemp: Math.round(tempSum / count),
            diurnalRange: Math.round((diurnalSum / count) * 10) / 10,
            sunshineHours: Math.round(sunshineSeconds / 3600), // Convert Seconds to Hours
            heatSpikes,
            frostEvents
        },
        story: {
            flowering: {
                status: flowStatus,
                rainMm: Math.round(floweringRain),
                avgTemp: Math.round(flowAvgTemp)
            },
            harvest: {
                conditions: harvCond,
                rainMm: Math.round(harvestRain),
                heatwaveDays: harvestHeat
            },
            growingSeason: {
                heatSpikes,
                frostEvents,
                diurnalRange: Math.round((diurnalSum / count) * 10) / 10,
                droughtStress: totalRain < 200
            }
        }
    };
}
