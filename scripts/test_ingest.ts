import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { ingestVintageData } from "../lib/ingestOpenMeteo";
import mongoose from 'mongoose';
import Region from "../lib/models/Region";

async function connectDirectly() {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
}

async function run() {
    await connectDirectly();
    console.log("Connected to DB (Direct)");

    const region = await Region.findOne();
    if (!region) {
        console.error("No regions found in DB");
        process.exit(1);
    }

    console.log(`Testing Ingest for region: ${region.name} (${region._id}) for year 2023`);
    try {
        const metrics = await ingestVintageData(region._id.toString(), 2023);
        console.log("Success! Metrics:", JSON.stringify(metrics, null, 2));

        // Also check if summary was saved
        const Vintage = (await import("../lib/models/Vintage")).default;
        const v = await Vintage.findOne({ regionId: region._id, year: 2023 });
        console.log("\n--- Full Document ---");
        console.log(JSON.stringify(v, null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

run();
