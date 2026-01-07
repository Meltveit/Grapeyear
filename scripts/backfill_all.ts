import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import Region from '../lib/models/Region';
import Vintage from '../lib/models/Vintage';
import { ingestRegionHistory } from '../lib/ingestOpenMeteo';

const START_YEAR = 1960;
const END_YEAR = 2025;

async function connectDirectly() {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log("Starting Optimized Batch Backfill (1980-2024)...");
    await connectDirectly();

    // 1. Get All Regions
    const regions = await Region.find({}).lean();
    console.log(`Found ${regions.length} regions.`);

    for (const region of regions) {
        console.log(`\n--- Processing Region: ${region.name} ---`);

        // Smart Skip: Check if we have all data
        const expectedCount = END_YEAR - START_YEAR + 1;
        const currentCount = await Vintage.countDocuments({
            regionId: (region as any)._id,
            year: { $gte: START_YEAR, $lte: END_YEAR },
            uniqueComposite: { $exists: true }
        });

        // FORCE OVERWRITE: We need to repair the schema mismatch (score vs grapeyearScore, missing summary)
        /*
        if (currentCount >= expectedCount) {
            console.log(`Skipping ${region.name} (Complete: ${currentCount}/${expectedCount})`);
            continue;
        }
        */

        try {
            // One call to rule them all
            await ingestRegionHistory((region as any)._id.toString(), START_YEAR, END_YEAR);
            process.stdout.write('✓');
        } catch (e: any) {
            console.error(`\nFailed Region ${region.name}: ${e.message}`);
        }
        // Delay between regions to be safe (60 seconds)
        await delay(120000);
    }

    console.log("\n\nBackfill Complete!");
    process.exit(0);
}

run();
