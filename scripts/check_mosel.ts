
import dbConnect from '../lib/mongodb';
import Vintage from '../lib/models/Vintage';
import Region from '../lib/models/Region';

async function checkMosel() {
    await dbConnect();

    // Find Mosel
    const mosel = await Region.findOne({ name: 'Mosel' });
    if (!mosel) {
        console.log('Mosel not found!');
        process.exit(1);
    }

    const vintages = await Vintage.find({ regionId: mosel._id }).sort({ year: 1 });
    console.log(`Mosel Vintages Found: ${vintages.length}`);
    if (vintages.length > 0) {
        console.log(`Range: ${vintages[0].year} - ${vintages[vintages.length - 1].year}`);

        // Check 2020-2025 specifically
        const recent = vintages.filter(v => v.year >= 2020);
        console.log('Recent years saved:', recent.map(v => v.year).join(', '));
    }

    process.exit(0);
}

checkMosel();
