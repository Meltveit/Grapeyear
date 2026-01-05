/**
 * BACKFILL IMAGES SCRIPT
 * 
 * Usage: npx tsx scripts/fix-images.ts
 * 
 * Purpose: 
 * Iterates through all Regions in the DB.
 * If a region matches a slug in TOP_REGIONS (lib/constants), it updates the DB with that imageUrl.
 * Ensures no "black empty boxes" appear on the frontend.
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env before imports that might check process.env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Region from '../lib/models/Region';
import { TOP_REGIONS } from '../lib/constants';

async function fixImages() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI is missing in .env.local");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        console.log(`🔍 Checking against ${TOP_REGIONS.length} static constants...`);

        let updatedCount = 0;
        let skippedCount = 0;

        // 1. Iterate over static regions and upsert/update DB
        for (const staticReg of TOP_REGIONS) {
            const result = await Region.updateOne(
                { slug: staticReg.slug }, // Filter by slug
                {
                    $set: {
                        imageUrl: staticReg.imageUrl,
                        // Ensure other vital fields are synced too if missing
                        name: staticReg.name,
                        country: staticReg.country,
                        countryCode: staticReg.countryCode
                    }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`📸 Updated image for: ${staticReg.name}`);
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        // 2. Optional: Log regions in DB that are NOT in constants (might still have missing images)
        const allDbRegions = await Region.find({});
        for (const dbReg of allDbRegions) {
            if (!dbReg.imageUrl) {
                console.warn(`⚠️ Region in DB has NO image: ${dbReg.name} (${dbReg.slug})`);
                // Fallback to a default wine image
                dbReg.imageUrl = 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200';
                await dbReg.save();
                console.log(`   -> Applied default fallback image.`);
                updatedCount++;
            }
        }

        console.log(`\n🎉 DONE! Updated: ${updatedCount}, Skipped (already correct): ${skippedCount}`);

    } catch (error) {
        console.error("❌ Script failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

fixImages();
