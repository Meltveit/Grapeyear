import { NextResponse } from "next/server";
import { ingestVintageData } from "@/lib/ingestOpenMeteo";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { regionId, year, startYear, endYear } = body;

        if (!regionId) {
            return NextResponse.json({ error: "Region ID required" }, { status: 400 });
        }

        const results = [];

        // Single Year mode
        if (year) {
            console.log(`Ingesting Region ${regionId} for ${year}...`);
            const metrics = await ingestVintageData(regionId, year);
            results.push({ year, metrics });
        }
        // Range mode (Backfill)
        else if (startYear && endYear) {
            console.log(`Backfilling Region ${regionId} from ${startYear} to ${endYear}...`);
            for (let y = startYear; y <= endYear; y++) {
                // Add tiny delay to be nice to Open-Meteo API?
                // They allow high rate limits for Archive, but safe side.
                const metrics = await ingestVintageData(regionId, y);
                results.push({ year: y, status: 'ok' });
            }
        }

        return NextResponse.json({ success: true, count: results.length, results });

    } catch (error: any) {
        console.error("Ingest Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
