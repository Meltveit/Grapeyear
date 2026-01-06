import 'dotenv/config';
import mongoose from 'mongoose';
import Country from '../lib/models/Country';
import Region from '../lib/models/Region';
import { TOP_REGIONS } from '../lib/constants';

// Handle local .env.local loading if needed or assume user runs with --env-file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
}

const migrate = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Extract Unique Countries
        const distinctCountries = Array.from(new Set(TOP_REGIONS.map(r => r.countryCode))).map(code => {
            const region = TOP_REGIONS.find(r => r.countryCode === code)!;
            return {
                name: region.country,
                code: region.countryCode,
                // Simple slug generation
                slug: region.country.toLowerCase().replace(/ /g, '-'),
                // Placeholder image from first region or generic
                imageUrl: region.imageUrl ? region.imageUrl.replace('/regions/', '/countries/') : undefined
            };
        });

        console.log(`Found ${distinctCountries.length} countries to migrate.`);

        // 2. Upsert Countries
        const countryMap = new Map<string, mongoose.Types.ObjectId>();

        for (const c of distinctCountries) {
            // Using "code" as unique identifier logic for upsert
            const doc = await Country.findOneAndUpdate(
                { code: c.code },
                {
                    $set: {
                        name: c.name,
                        slug: c.slug,
                        // Default templates will be set by Schema defaults if new
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Region processed: ${c.name}`);
            countryMap.set(c.code, doc._id as mongoose.Types.ObjectId);
        }

        // 3. Upsert Regions
        console.log(`Migrating ${TOP_REGIONS.length} regions...`);
        for (const r of TOP_REGIONS) {
            const countryId = countryMap.get(r.countryCode);
            if (!countryId) {
                console.warn(`Skipping region ${r.name} (No country ID)`);
                continue;
            }

            await Region.findOneAndUpdate(
                { slug: r.slug },
                {
                    $set: {
                        name: r.name,
                        countryId: countryId,
                        country: r.country, // Legacy
                        countryCode: r.countryCode,
                        description: r.description,
                        location: {
                            type: 'Point',
                            coordinates: r.coordinates
                        },
                        imageUrl: r.imageUrl,
                        isTopRegion: true
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`Saved Region: ${r.name}`);
        }

        console.log('Migration Complete');
        process.exit(0);

    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
