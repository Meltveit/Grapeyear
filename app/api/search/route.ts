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

        // 2. Detect Year in Query (for Vintage Reports)
        // e.g. "Burgundy 2013" -> Year: 2013, Text: "Burgundy"
        const yearMatch = query.match(/\b(19|20)\d{2}\b/);
        let vintageResults: any[] = [];

        if (yearMatch) {
            const year = parseInt(yearMatch[0]);
            const textQuery = query.replace(yearMatch[0], '').trim(); // "Burgundy " -> "Burgundy"

            if (textQuery.length >= 2) {
                const regionMatches = await Region.find({
                    $or: [
                        { name: new RegExp(textQuery, 'i') },
                        { slug: new RegExp(textQuery, 'i') }
                    ]
                }).select('name slug countryCode imageUrl country').limit(1).lean();

                if (regionMatches.length > 0) {
                    const r = regionMatches[0];
                    vintageResults.push({
                        name: `${r.name} ${year} Vintage`,
                        type: 'vintage',
                        url: `/vintages/${(r as any).country.toLowerCase().replace(/ /g, '-')}/${r.slug}/${year}`,
                        imageUrl: r.imageUrl,
                        year: year,
                        country: (r as any).country
                    });
                }
            }
        }

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
            ...vintageResults, // Show specific vintage report first
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
