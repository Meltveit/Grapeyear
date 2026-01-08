
import 'dotenv/config';
import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import Region from '../lib/models/Region';
import TravelGuide from '../lib/models/TravelGuide';
import { search, SafeSearchType } from 'duck-duck-scrape';

async function run() {
    await dbConnect();
    console.log('🕷️ Travel Crawler (Real Links) Initialized...');

    const regions = await Region.find({}).sort({ name: 1 });
    console.log(`Found ${regions.length} regions to scout.`);

    for (const region of regions) {
        const count = await TravelGuide.countDocuments({ regionId: region._id });
        if (count >= 3) {
            console.log(`Skipping ${region.name} (Already has ${count} guides)`);
            continue;
        }

        console.log(`\n🔍 Crawling for: ${region.name}...`);

        // Search Query
        const query = `best travel guide blog ${region.name} wine region visiting`;

        try {
            const searchResults = await search(query, {
                safeSearch: SafeSearchType.MODERATE,
                offset: 0
            });

            // Filter results (ignore common irrelevant domains if needed)
            const validResults = searchResults.results.slice(0, 5).filter(r =>
                !r.url.includes('wikipedia') &&
                !r.url.includes('amazon') &&
                !r.url.includes('pinterest')
            );

            let added = 0;

            for (const result of validResults) {
                if (added >= 3) break;

                // Check duplicate
                const uniqueUrl = await TravelGuide.findOne({ url: result.url });
                if (uniqueUrl) continue;

                // Create Guide
                await TravelGuide.create({
                    title: result.title.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
                    url: result.url,
                    source: new URL(result.url).hostname.replace('www.', ''),
                    summary: result.description ? result.description.replace(/<[^>]*>?/gm, '') : 'Discovered by Travel Crawler',
                    regionId: region._id,
                    country: region.country,
                    keywords: ['Travel', 'Wine Guide', 'Blog'], // Generic tags for now
                    status: 'published'
                });

                console.log(`   + Indexing: ${result.title.substring(0, 50)}...`);
                added++;
            }

            // Polite delay
            await new Promise(r => setTimeout(r, 3000));

        } catch (err: any) {
            console.error(`   ❌ Scraping error for ${region.name}:`, err.message);
        }
    }

    console.log('\n✅ Crawling Complete.');
    process.exit(0);
}

run();
