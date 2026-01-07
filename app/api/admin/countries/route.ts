import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Country from "@/lib/models/Country";
import Region from "@/lib/models/Region";

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch all countries
        const countries = await Country.find({}).sort({ name: 1 });

        // 1. Fetch Regions to map RegionID -> CountryName
        const regions = await Region.find({}).select('_id country').lean();

        // Map: RegionID (string) -> CountryName (string)
        const regionToCountryMap: Record<string, string> = {};
        regions.forEach((r: any) => {
            regionToCountryMap[r._id.toString()] = r.country;
        });

        // 2. Aggregate winery counts by REGION
        const wineryCountsByRegion = await import("@/lib/models/Winery").then(m => m.default.aggregate([
            { $group: { _id: "$region", count: { $sum: 1 } } }
        ]));

        // 3. Sum up counts per Country
        const countryCountMap: Record<string, number> = {};

        wineryCountsByRegion.forEach((group: any) => {
            const regionId = group._id?.toString();
            if (regionId && regionToCountryMap[regionId]) {
                const countryName = regionToCountryMap[regionId];
                countryCountMap[countryName] = (countryCountMap[countryName] || 0) + group.count;
            }
            // Fallback: If winery document HAS a direct country string, use it (if we want hybrid approach)
            // But strict region relationship is safer for now.
        });

        // 4. Map back to Country list
        const countriesWithCounts = countries.map((country) => ({
            ...country.toObject(),
            wineryCount: countryCountMap[country.name] || 0
        }));

        return NextResponse.json(countriesWithCounts);

    } catch (error) {
        console.error("Countries API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
