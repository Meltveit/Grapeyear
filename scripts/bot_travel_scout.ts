
import 'dotenv/config'; // Ensure .env is loaded
import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import Region from '../lib/models/Region';
import TravelGuide from '../lib/models/TravelGuide';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function run() {
    await dbConnect();
    console.log('🤖 Travel Scout Bot Initialized...');

    const regions = await Region.find({}).sort({ name: 1 });
    console.log(`Found ${regions.length} regions to scout.`);

    for (const region of regions) {
        // Check if guides already exist just to avoid duplicates (unless forced)
        const count = await TravelGuide.countDocuments({ regionId: region._id });
        if (count >= 3) {
            console.log(`Skipping ${region.name} (Already has ${count} guides)`);
            continue;
        }

        console.log(`\n🔍 Scouting for: ${region.name}, ${region.country}...`);

        const prompt = `
            Act as a travel editor for a wine magazine.
            Find 3 high-quality, real, existing travel guides or blog posts about visiting the "${region.name}" wine region in ${region.country}.
            Focus on reputable sources like Wine Folly, Decanter, Conde Nast, or high-quality travel blogs.
            
            Return a JSON array with these fields:
            - title: The headline of the article.
            - url: A specific, plausible URL (Try to use real ones if you know them, otherwise format properly).
            - source: The name of the website (e.g. "Wine Folly").
            - summary: A confusing 2-sentence summary of why this guide is great.
            - keywords: Array of 3-5 tags (e.g. "Luxury", "Budget", "Itinerary", "Hotels").
            
            IMPORTANT: Return ONLY valid JSON. No markdown formatting.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            const guides = JSON.parse(text);

            for (const g of guides) {
                // Check duplicate URL
                const exists = await TravelGuide.findOne({ url: g.url });
                if (exists) continue;

                await TravelGuide.create({
                    ...g,
                    regionId: region._id,
                    country: region.country,
                    status: 'published'
                });
                console.log(`   + Added: ${g.title} (${g.source})`);
            }

            // Wait to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));

        } catch (error: any) {
            console.error(`   ❌ Failed for ${region.name}:`, error.message);
        }
    }

    console.log('\n✅ Mission Complete. Travel Guides Populated.');
    process.exit(0);
}

run();
