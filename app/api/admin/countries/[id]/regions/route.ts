import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Region from "@/lib/models/Region";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Find regions belonging to this country
        const regions = await Region.find({ countryId: id }).sort({ name: 1 });

        return NextResponse.json(regions);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import Country from "@/lib/models/Country";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        // Validate Country exists to get Name/Code
        const country = await Country.findById(id);
        if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });

        // Create Region
        // Default coordinates if missing (required by schema)
        const location = body.location || {
            type: 'Point',
            coordinates: [0, 0] // Default (Atlantic Ocean)
        };

        const region = await Region.create({
            ...body,
            countryId: id,
            country: country.name,
            countryCode: country.code,
            location: location
        });

        return NextResponse.json(region);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "A region with this slug already exists." }, { status: 409 });
        }
        console.error("Region Create Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
