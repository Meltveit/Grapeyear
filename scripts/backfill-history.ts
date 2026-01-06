
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { updateVintagesForRegions } from '../lib/ingest';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function backfill() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is required');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Backfill last 12 years to be safe for the 10-year chart
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 12 }, (_, i) => currentYear - i); // [2026, 2025, ... 2014]

    console.log(`Backfilling years: ${years.join(', ')}`);

    // Ingest
    const stats = await updateVintagesForRegions(years);

    console.log(`Backfill complete! Updated/Created: ${stats.updated}, Errors: ${stats.errors}`);
    process.exit(0);
}

backfill().catch(console.error);
