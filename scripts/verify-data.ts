
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Region from '../lib/models/Region';
import Vintage from '../lib/models/Vintage';

async function verify() {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to:", uri ? "URI found" : "URI MISSING");
    if (!uri) return;

    await mongoose.connect(uri);

    const region = await Region.findOne({ slug: 'tuscany' });
    if (!region) {
        console.log("Region 'tuscany' NOT FOUND in DB.");
        return;
    }
    console.log(`Found region: ${region.name} (${region._id})`);

    const vintage = await Vintage.findOne({ regionId: region._id, year: 2023 });
    if (!vintage) {
        console.log("Vintage 2023 for Tuscany NOT FOUND in DB.");
    } else {
        console.log("Vintage found!");
        console.log("Score:", vintage.grapeyearScore);
        console.log("Metrics:", JSON.stringify(vintage.metrics, null, 2));
    }

    process.exit(0);
}

verify().catch(console.error);
