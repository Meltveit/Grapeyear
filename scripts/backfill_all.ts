import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import Region from '../lib/models/Region';
import Vintage from '../lib/models/Vintage';
import { ingestRegionHistory } from '../lib/ingestOpenMeteo';

const START_YEAR = 1960;
const END_YEAR = 2024;

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
        try {
            // One call to rule them all
            await ingestRegionHistory((region as any)._id.toString(), START_YEAR, END_YEAR);
            process.stdout.write('✓');
        } catch (e: any) {
            console.error(`\nFailed Region ${region.name}: ${e.message}`);
        }
        // Delay between regions to be safe (60 seconds)
        await delay(60000);
    }

    console.log("\n\nBackfill Complete!");
    process.exit(0);
}

run();
