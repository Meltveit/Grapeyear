import 'dotenv/config';
import mongoose from 'mongoose';
import Country from '../lib/models/Country';
import Region from '../lib/models/Region';
import User from '../lib/models/User';
import Winery from '../lib/models/Winery';
import Wine from '../lib/models/Wine';
import Vintage from '../lib/models/Vintage';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
}

const inspect = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('--- Database Inspection (Read-Only) ---');
        console.log(`db: ${mongoose.connection.name}`);

        const userCount = await User.countDocuments();
        console.log(`Users: ${userCount}`);
        if (userCount > 0) {
            const u = await User.findOne({}, 'email role');
            console.log(` - Example: ${u?.email} (${u?.role})`);
        }

        const countryCount = await Country.countDocuments();
        console.log(`Countries: ${countryCount}`);
        if (countryCount > 0) {
            const c = await Country.findOne({}, 'name code');
            console.log(` - Example: ${c?.name} [${c?.code}]`);
        }

        const regionCount = await Region.countDocuments();
        console.log(`Regions: ${regionCount}`);

        const wineryCount = await Winery.countDocuments();
        console.log(`Wineries: ${wineryCount}`);

        const wineCount = await Wine.countDocuments();
        console.log(`Wines: ${wineCount}`);

        const vintageCount = await Vintage.countDocuments();
        console.log(`Vintages: ${vintageCount}`);

        console.log('--- End of Inspection ---');
        process.exit(0);

    } catch (error) {
        console.error('Inspection Failed:', error);
        process.exit(1);
    }
};

inspect();
