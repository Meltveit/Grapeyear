import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import Region from '../lib/models/Region';
import Vintage from '../lib/models/Vintage';

async function run() {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const totalRegions = await Region.countDocuments();
    const totalVintages = await Vintage.countDocuments({ uniqueComposite: { $exists: true } }); // Check for new schema

    console.log(`\n--- Backfill Status ---`);
    console.log(`Total Regions: ${totalRegions}`);
    console.log(`Total Vintages Ingested: ${totalVintages}`);

    // Aggregation
    const counts = await Vintage.aggregate([
        { $match: { uniqueComposite: { $exists: true } } },
        { $group: { _id: "$regionId", count: { $sum: 1 } } },
        { $lookup: { from: 'regions', localField: '_id', foreignField: '_id', as: 'region' } },
        { $unwind: "$region" },
        { $project: { name: "$region.name", count: 1 } },
        { $sort: { count: -1 } }
    ]);

    console.log(`\n--- By Region ---`);
    const completedRegions = new Set();
    counts.forEach(c => {
        console.log(`${c.name}: ${c.count} vintages`);
        completedRegions.add(c.name);
    });

    // Find Missing
    const allRegions = await Region.find({}, 'name');
    const missing = allRegions.filter(r => !completedRegions.has(r.name));

    if (missing.length > 0) {
        console.log(`\n--- Waiting for Data (${missing.length}) ---`);
        console.log(missing.map(r => r.name).join(', '));
    } else {
        console.log(`\nAll regions have at least some data!`);
    }

    process.exit(0);
}

run();
