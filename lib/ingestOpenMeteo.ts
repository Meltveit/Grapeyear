import Vintage from "@/lib/models/Vintage";
import Region from "@/lib/models/Region";
import { generateVintageSummary, calculateGrapeyearScore } from "@/lib/calculations";

// Types for Open-Meteo response
interface DailyWeather {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
}

interface StoryMetrics {
    flowering: { status: 'Excellent' | 'Good' | 'Average' | 'Poor'; rainMm: number; avgTemp: number };
    harvest: { conditions: 'Dry' | 'Wet' | 'Mixed'; rainMm: number; heatwaveDays: number };
    growingSeason: { heatSpikes: number; frostEvents: number; diurnalRange: number; droughtStress: boolean };
}

// Helper: Determine Hemisphere based on Latitude
// (Northern: Lat > 0, Southern: Lat < 0)
// Northern Flowering: Late May/June (Weeks 22-26). Harvest: Sept/Oct (Weeks 36-42)
// Southern Flowering: Nov/Dec (Weeks 46-50). Harvest: March/April (Weeks 10-16)

// ... imports

export async function ingestRegionHistory(regionId: string, startYear: number, endYear: number) {
    const region = await Region.findById(regionId);
    if (!region) throw new Error("Region not found");

    const lat = region.location.coordinates[1];
    const long = region.location.coordinates[0];
    const isNorthern = lat > 0;

    // Fetch Full Range
    const startDate = `${startYear}-01-01`;
    const endDate = `${endYear}-12-31`;

    const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${long}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    console.log(`Fetching history for ${region.name} (${startYear}-${endYear})...`);
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Open-Meteo Failed: ${res.statusText}`);
    const data = await res.json();

    // Validate Data Length
    if (!data.daily || !data.daily.time) throw new Error("No daily data received");

    const bulkOps = [];

    // Iterate Years
    for (let year = startYear; year <= endYear; year++) {
        // Slice Data for this Year
        // Find start/end index in data.daily.time
        // This is efficient enough for 45 years.
        const yStartStr = `${year}-01-01`;
        const yEndStr = `${year}-12-31`; // Simplified for Northern. Southern needs overlap logic, but for bulk ingest let's keep it simple first or replicate the logic.

        // Reuse existing logic? 
        // calculateMetrics expects a Saved "DailyWeather" object.
        // Let's create a subset object.

        let subsetStartIndex = -1;
        let subsetEndIndex = -1;

        // Optimized search? Time is ISO sorted.
        // subsetStartIndex = data.daily.time.indexOf(yStartStr);
        // subsetEndIndex = data.daily.time.indexOf(yEndStr);
        // Actually, for Southern hemisphere logic (July-June), we need to slice across boundaries.

        let sliceStart = `${year}-01-01`;
        let sliceEnd = `${year}-12-31`;

        if (!isNorthern) {
            sliceStart = `${year - 1}-07-01`;
            sliceEnd = `${year}-06-30`;
        }

        const sIdx = data.daily.time.indexOf(sliceStart);
        const eIdx = data.daily.time.indexOf(sliceEnd);

        if (sIdx === -1 || eIdx === -1) {
            // console.warn(`Missing data for ${year} (Range: ${sliceStart} to ${sliceEnd})`);
            continue;
        }

        const dailySubset = {
            time: data.daily.time.slice(sIdx, eIdx + 1),
            temperature_2m_max: data.daily.temperature_2m_max.slice(sIdx, eIdx + 1),
            temperature_2m_min: data.daily.temperature_2m_min.slice(sIdx, eIdx + 1),
            precipitation_sum: data.daily.precipitation_sum.slice(sIdx, eIdx + 1)
        };

        const metrics = calculateMetrics(dailySubset, isNorthern, year);

        // Calculate Score & Quality (using shared logic)
        const { score, quality } = calculateGrapeyearScore({
            gdd: metrics.growingSeason.gdd,
            rainfall: metrics.growingSeason.rainfall,
            diurnal: metrics.growingSeason.diurnalRange,
            sunshineHours: 1500, // Placeholder
            frostDays: metrics.growingSeason.frostEvents
        });

        const summary = generateVintageSummary({
            gdd: metrics.growingSeason.gdd,
            rainfall: metrics.growingSeason.rainfall,
            sunshineHours: 1500,
            frostDays: metrics.growingSeason.frostEvents,
            regionName: region.name,
            year: year,
            storyMetrics: metrics.story,
            heatSpikes: metrics.growingSeason.heatSpikes,
            harvestRainMm: metrics.story.harvest.rainMm
        });

        // Add to Bulk Op
        bulkOps.push({
            updateOne: {
                filter: { regionId: region._id, year },
                update: {
                    $set: {
                        year,
                        grapeyearScore: score, // Correct Field
                        quality: quality,      // Correct Field
                        gdd: metrics.growingSeason.gdd,
                        rainfall: metrics.growingSeason.rainfall,
                        avgTemperature: metrics.growingSeason.avgTemp,
                        diurnalShiftAvg: metrics.growingSeason.diurnalRange,
                        storyMetrics: metrics.story,
                        vintageSummary: summary, // Correct Field
                        uniqueComposite: `${region._id}_${year}`
                    }
                },
                upsert: true
            }
        });
    }

    // Execute Bulk Write
    if (bulkOps.length > 0) {
        await Vintage.bulkWrite(bulkOps);
        console.log(`Saved ${bulkOps.length} vintages for ${region.name} (Repair Mode)`);
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
    let gdd = 0;
    let totalRain = 0;
    let tempSum = 0;
    let heatSpikes = 0;
    let frostEvents = 0;
    let diurnalSum = 0;
    let count = 0;

    // Phase Stats
    let floweringRain = 0;
    let floweringTempSum = 0;
    let floweringCount = 0;

    let harvestRain = 0;
    let harvestHeat = 0;


    // Growing Season Definition
    // Northern: Apr 1 (Day 90) - Oct 31 (Day 304)
    // Southern: Oct 1 (Day 273) - Apr 30 (Day 120 next year - wrapped)
    // Actually, simply define start/end months (0-indexed)

    // We already sliced the data to define "The Year".
    // Northern: Jan-Dec. Season: Apr-Oct.
    // Southern: Jul-Jun. Season: Oct-Apr.

    // Let's use month check.

    daily.time.forEach((t, i) => {
        const date = new Date(t);
        const month = date.getMonth(); // 0-11

        // Check if in Growing Season
        let inSeason = false;
        if (isNorthern) {
            // Apr (3) to Oct (9)
            if (month >= 3 && month <= 9) inSeason = true;
        } else {
            // Oct (9) to Apr (3)
            // Since data runs Jul-Jun, this handles the wrapping naturally?
            // Yes, Jul-Jun data. 
            // Oct, Nov, Dec (9,10,11) -> Yes
            // Jan, Feb, Mar, Apr (0,1,2,3) -> Yes
            // May, Jun, Jul, Aug, Sep (4,5,6,7,8) -> No
            if (month >= 9 || month <= 3) inSeason = true;
        }

        const max = daily.temperature_2m_max[i];
        const min = daily.temperature_2m_min[i];
        const rain = daily.precipitation_sum[i];
        const mean = (max + min) / 2;

        // Growing Season Stats ONLY
        if (inSeason) {
            if (mean > 10) {
                gdd += (mean - 10);
            }
            totalRain += rain;
            tempSum += mean;
            if (max > 35) heatSpikes++;
            // Frost only matters in Spring/Autumn really, but counting all season is better than winter
            if (min < 0) frostEvents++;
            diurnalSum += (max - min);
            count++;
        }

        // Flowering Phase (Keep logic, but ensure it aligns)
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
                droughtStress: totalRain < 200 // simple threshold
            }
        }
    };
}
