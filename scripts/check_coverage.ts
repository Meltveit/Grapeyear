
import 'dotenv/config';
import dbConnect from '../lib/mongodb';
import Vintage from '../lib/models/Vintage';
import Region from '../lib/models/Region';

async function check() {
    await dbConnect();
    console.log('📊 Auditing 1960 Data Coverage...');

    // 1. Get total regions
    const totalRegions = await Region.countDocuments();

    // 2. Count distinct regions with 1960 data
    const vintages1960 = await Vintage.find({ year: 1960 }).select('regionId');
    const distinctRegionIds = new Set(vintages1960.map(v => v.regionId.toString()));

    console.log(`\n📅 Year: 1960`);
    console.log(`✅ Covered: ${distinctRegionIds.size} / ${totalRegions} regions.`);
    console.log(`-----------------------------------`);

    // Optional: List missing?
    if (distinctRegionIds.size < totalRegions) {
        console.log('Checking missing...');
        const allRegions = await Region.find({}).select('_id name country');
        const missing = allRegions.filter(r => !distinctRegionIds.has(r._id.toString()));

        console.log(`⚠️ Missing 1960 data for (${missing.length}):`);
        missing.slice(0, 10).forEach(r => console.log(`   - ${r.name} (${r.country})`));
        if (missing.length > 10) console.log(`   ...and ${missing.length - 10} more.`);
    }

    process.exit(0);
}

check();
