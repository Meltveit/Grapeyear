
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Winery from '../lib/models/Winery';

async function check() {
    if (!process.env.MONGODB_URI) throw new Error("No Mongo URI");
    await mongoose.connect(process.env.MONGODB_URI);

    const count = await Winery.countDocuments();
    console.log(`Total Wineries: ${count}`);

    const wineries = await Winery.find({}, 'name description isFeatured').limit(20);
    console.log("Sample Wineries:");
    wineries.forEach(w => {
        console.log(`- ${w.name} (Featured: ${w.isFeatured})`);
        if (w.description && w.description.includes('Lorem')) console.log('  -> HAS LOREM IPSUM!');
        if (w.name.includes('Test') || w.name.includes('Mock')) console.log('  -> SUSPICIOUS NAME!');
    });

    process.exit(0);
}

check().catch(console.error);
