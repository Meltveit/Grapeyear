
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import Region from '../lib/models/Region';
import { TOP_REGIONS } from '../lib/constants';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function updateRegions() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is required');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    let updatedCount = 0;

    for (const regionData of TOP_REGIONS) {
        const result = await Region.updateOne(
            { slug: regionData.slug },
            { $set: { description: regionData.description } }
        );
        if (result.modifiedCount > 0) {
            console.log(`Updated ${regionData.name}`);
            updatedCount++;
        }
    }

    console.log(`Update complete! Modified: ${updatedCount} regions.`);
    process.exit(0);
}

updateRegions().catch(console.error);
