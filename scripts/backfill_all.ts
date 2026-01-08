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
    console.log("Starting Optimized Batch Backfill (1960-2024)...");
    await connectDirectly();

    // 1. Get All Regions
    const regions = await Region.find({}).lean();
    console.log(`Found ${regions.length} regions.`);

    for (const region of regions) {

        // --- IDEMPOTENCY CHECK ---
        // Check if we already processed this today (Check 2024 vintage)
        const lastVintage = await Vintage.findOne({ regionId: (region as any)._id, year: 2024 });
        if (lastVintage) {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);

            // If updated recently AND has the new Story Metrics/Score
            if (new Date((lastVintage as any).updatedAt) > oneDayAgo && (lastVintage as any).storyMetrics) {
                console.log(`Skipping ${region.name} (Already updated recently)`);
                continue;
            }
        }

        console.log(`\n--- Processing Region: ${region.name} ---`);
        try {
            // One call to rule them all
            await ingestRegionHistory((region as any)._id.toString(), START_YEAR, END_YEAR);
            process.stdout.write('✓');
        } catch (e: any) {
            console.error(`\nFailed Region ${region.name}: ${e.message}`);
            if (e.message.includes("Too Many Requests") || e.message.includes("429")) {
                console.log("Rate Limit Hit. Stopping Script.");
                break;
            }
        }
        // Delay between regions to be safe (60 seconds)
        await delay(600000);
    }

    console.log("\n\nBackfill Complete!");
    process.exit(0);
}

run();
