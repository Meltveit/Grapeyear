import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import Region from '../lib/models/Region';
import { TOP_REGIONS } from '../lib/constants';

async function run() {
    console.log("Starting Migration: Country Codes -> Full Names...");

    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);

    let updated = 0;

    for (const regionData of TOP_REGIONS) {
        // Find by Slug
        const region = await Region.findOne({ slug: regionData.slug });

        if (region) {
            // Check if Country matches
            // console.log(`Checking ${region.name}: DB='${region.country}' vs Const='${regionData.country}'`);

            if (region.country !== regionData.country) {
                console.log(`Updating ${region.name}: '${region.country}' -> '${regionData.country}'`);

                region.country = regionData.country;
                await region.save();
                updated++;
            } else {
                console.log(`OK ${region.name}: '${region.country}'`);
            }
        } else {
            console.warn(`Warning: Region ${regionData.name} (${regionData.slug}) not found in DB!`);
        }
    }

    console.log(`\nMigration Complete! Updated ${updated} regions.`);
    process.exit(0);
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
