import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Region from '@/lib/models/Region';
import Winery from '@/lib/models/Winery';
import Wine from '@/lib/models/Wine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        await connectToDatabase();

        const regex = new RegExp(query, 'i');

        // 1. Match Countries (from Constants)
        // We import TOP_REGIONS from '@/lib/constants' (Make sure to import it at top)
        // Since we can't import inside function easily if not already top-level, I'll assume I need to add the import.

        // Let's rely on DB distinct or just searching Region by country for now, 
        // OR better: Check if the query matches a country and create a result for it.
        // Actually, searching Regions by country is the most organic way. 
        // IF we search "Argentina", we get Mendoza.
        // IF we want "Argentina" as a result, we can deduce it.

        // Let's implement the dual query for Regions first.

        const [regions, wineries, wines] = await Promise.all([
            // Search by Name OR Country
            Region.find({
                $or: [
                    { name: regex },
                    { country: regex }
                ]
            }).select('name slug country countryCode imageUrl').limit(5).lean(),
            Winery.find({ name: regex }).select('name slug imageUrl region').limit(3).lean(),
            Wine.find({ name: regex }).select('name slug imageUrl wineryId').populate('wineryId', 'slug').limit(3).lean(),
        ]);

        // Synthesize a "Country Result" if multiple regions from same country appear
        // OR if the query strictly matches a country name found in the regions.
        const countryMatches = new Map();
        (regions as any[]).forEach(r => {
            if (regex.test(r.country)) {
                countryMatches.set(r.country, r.countryCode);
            }
        });

        const countryResults = Array.from(countryMatches.entries()).map(([name, code]) => ({
            name: name,
            type: 'country',
            url: `/vineyards/${name.toLowerCase()}`, // Use semantic slug
            imageUrl: `/images/countries/${name.toLowerCase()}.jpg`, // Best guess or placeholder
            slug: name.toLowerCase()
        }));

        const results = [
            ...countryResults,
            ...regions.map(r => ({
                ...r,
                type: 'region',
                url: `/vintages/${(r as any).countryCode?.toLowerCase() || 'fr'}/${r.slug}/${new Date().getFullYear() - 1}`
            })),
            ...wineries.map(w => ({ ...w, type: 'winery', url: `/wineries/${w.slug}` })),
            ...wines.map(w => ({ ...w, type: 'wine', url: `/wines/${w.slug}` })),
        ];

        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
