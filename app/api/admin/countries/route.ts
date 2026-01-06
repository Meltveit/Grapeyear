import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Country from "@/lib/models/Country";
import Region from "@/lib/models/Region";

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch all countries
        const countries = await Country.find({}).sort({ name: 1 });

        // Aggregate winery counts by country name
        // (Assuming Winery model uses the exact country name string as in Country model)
        const wineryCounts = await import("@/lib/models/Winery").then(m => m.default.aggregate([
            { $group: { _id: "$country", count: { $sum: 1 } } }
        ]));

        const countMap: Record<string, number> = {};
        wineryCounts.forEach((c: any) => {
            if (c._id) countMap[c._id] = c.count;
        });

        const countriesWithCounts = countries.map((country) => ({
            ...country.toObject(),
            wineryCount: countMap[country.name] || 0
        }));

        return NextResponse.json(countriesWithCounts);

    } catch (error) {
        console.error("Countries API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
