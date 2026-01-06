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

        const [regions, wineries, wines] = await Promise.all([
            Region.find({ name: regex }).select('name slug countryCode imageUrl').limit(3).lean(),
            Winery.find({ name: regex }).select('name slug imageUrl region').limit(3).lean(),
            Wine.find({ name: regex }).select('name slug imageUrl wineryId').populate('wineryId', 'slug').limit(3).lean(),
        ]);

        const results = [
            ...regions.map(r => ({ ...r, type: 'region', url: `/vintages/${(r as any).countryCode?.toLowerCase() || 'fr'}/${r.slug}/${new Date().getFullYear() - 1}` })),
            ...wineries.map(w => ({ ...w, type: 'winery', url: `/wineries/${w.slug}` })), // Assuming /wineries/[slug] structure
            ...wines.map(w => ({ ...w, type: 'wine', url: `/wines/${w.slug}` })), // Assuming /wines/[slug] structure
        ];

        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
