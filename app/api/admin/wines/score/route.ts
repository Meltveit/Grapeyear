import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Winery from '@/lib/models/Winery';
import Vintage from '@/lib/models/Vintage';
import Region from '@/lib/models/Region';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const wineryId = searchParams.get('wineryId');
    const year = searchParams.get('year');

    if (!wineryId || !year) {
        return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // 1. Get Winery to find Region
        const winery = await Winery.findById(wineryId);
        if (!winery) return NextResponse.json({ error: 'Winery not found' }, { status: 404 });

        // 2. Resolve Region
        // Winery.region stores the Region Id (as string or ObjectId) OR slug? 
        // Based on previous code inspection, it seems to be ID. But let's handle if it's slug/name just in case.
        // Ideally it's ID. Let's assume it's ID first.
        let regionId = winery.region;

        // Check if regionId is a valid ObjectId string. If not, it might be a name.
        // Actually, let's verify if 'region' matches an existing Region Doc by ID.
        let region = await Region.findById(regionId);
        if (!region) {
            // Try finding by slug or name if ID lookup failed (legacy data?)
            region = await Region.findOne({ $or: [{ slug: regionId }, { name: regionId }] });
        }

        if (!region) return NextResponse.json({ error: 'Region not found' }, { status: 404 });

        // 3. Find Vintage
        const vintage = await Vintage.findOne({
            regionId: region._id,
            year: parseInt(year)
        });

        if (!vintage) {
            return NextResponse.json({ found: false });
        }

        return NextResponse.json({
            found: true,
            score: vintage.grapeyearScore,
            quality: vintage.quality,
            summary: vintage.aiSummary
        });

    } catch (error) {
        console.error('Vintage lookup error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
