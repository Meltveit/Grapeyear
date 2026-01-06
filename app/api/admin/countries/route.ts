import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Country from "@/lib/models/Country";
import Region from "@/lib/models/Region";

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch all countries
        const countries = await Country.find({}).sort({ name: 1 });

        // Optionally, fetch region counts for each country for dashboard display
        // Keeping it simple for now to just get the list rendering

        return NextResponse.json(countries);

    } catch (error) {
        console.error("Countries API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
