
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Region from '../lib/models/Region';
import Winery from '../lib/models/Winery';
import Vintage from '../lib/models/Vintage';

async function checkLinks() {
    console.log("🔗 Starting Broken Link Analysis (Static DB Check)...");

    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);

    const regions = await Region.find({}).lean();
    const wineries = await Winery.find({}).lean();

    console.log(`Found ${regions.length} regions, ${wineries.length} wineries.`);

    let errors = 0;

    // 1. Check Region Link Integrity
    for (const r of regions) {
        if (!r.country) {
            console.error(`❌ Region ${r.name} has missing country!`);
            errors++;
        }

        // Check Country Slug Safety
        const countrySlug = r.country?.toLowerCase().replace(/ /g, '-') || 'MISSING';
        if (/[^a-z0-9-]/.test(countrySlug)) {
            console.warn(`⚠️ Warning: Region ${r.name} country slug "${countrySlug}" contains special chars.`);
        }

        // Check Region Slug Safety
        if (/[^a-z0-9-]/.test(r.slug)) {
            console.warn(`⚠️ Warning: Region ${r.name} slug "${r.slug}" contains special chars.`);
        }
    }

    // 2. Check Winery Link Integrity
    for (const w of wineries) {
        if (!w.slug) {
            console.error(`❌ Winery ${w.name} has missing slug!`);
            errors++;
        } else {
            // Validate Slug
            if (/[^a-z0-9-]/.test(w.slug)) {
                console.warn(`⚠️ Warning: Winery ${w.name} slug "${w.slug}" unsafe.`);
            }
        }

        // Verify associated Region exists
        if (w.region) {
            const linkedRegion = regions.find(r => r._id.toString() === w.region.toString());
            if (!linkedRegion) {
                console.error(`❌ Winery ${w.name} linked to non-existent region ID: ${w.region}`);
                errors++;
            }
        } else {
            console.warn(`⚠️ Winery ${w.name} has no Region linked.`);
        }
    }

    console.log(`\nAnalysis Complete. Found ${errors} critical errors.`);
    process.exit(0);
}

checkLinks();
