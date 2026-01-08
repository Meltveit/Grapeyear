
// Visual Crossing Adapter for Grapeyear
import Region from './models/Region';
import Vintage from './models/Vintage';
import { calculateGDD, calculateGrapeyearScore, generateVintageSummary } from './calculations';

export async function ingestVisualCrossing(regionId: string, startYear: number, endYear: number) {
    const key = process.env.VISUAL_CROSSING_KEY;
    if (!key) throw new Error("Missing VISUAL_CROSSING_KEY");

    const region = await Region.findById(regionId);
    if (!region) throw new Error("Region not found");

    console.log(`[VC] Fetching ${region.name} (${startYear}-${endYear})...`);

    // Loop years because VC "timeline" request for 65 years might be huge/timeout
    // VC Free tier 1000 records? No, 1000 query cost.
    // Querying 1 year of daily data = 1 query cost usually? No, depends on 'rows'.
    // Actually, VC counts "rows" (days) for cost. 1000 rows/day free is TINY (3 years).
    // WAIT. VC Free is 1000 *result records*. 
    // 365 days = 365 records. so 3 years max per day.
    // THIS IS WORSE than Open-Meteo.

    // RE-EVALUATE:
    // Open-Meteo is best.
    // Maybe "World Weather Online" (Paid)?
    // User asked "find an API".
    // Options:
    // 1. Meteostat (Free, uses NOAA/DWD). Python lib, but has JSON API (RapidAPI?).
    // 2. NASA POWER (Free, no limits, 1981+).

    // IF user wants 1960, and Open-Meteo blocked:
    // Maybe we retry with NASA for 1981-2024?
    // And accept missing 1960-1980?

    // BUT User said "ensure data structured equally and ALL THE WAY BACK TO 1960".

    // ONLY Provider for 1960 global daily data is Reanalysis (ERA5).
    // Open-Meteo = ERA5.

    // CONCLUSION:
    // We MUST use Open-Meteo.
    // The blocking is the issue.
    // I should slow down script DRAMATICALLY.
    // 1 call per minute.

    // Proposal to user: 
    // "Open-Meteo is the ONLY free source for 1960. Your IP is temporarily blocked."
    // "I can modify the script to wait 60 seconds between chunks."
    // "This will take 2 hours to run, but it will finish."

}
