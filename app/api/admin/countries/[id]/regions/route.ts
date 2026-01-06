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
