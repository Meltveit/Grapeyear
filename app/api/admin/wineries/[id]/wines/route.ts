import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Wine from "@/lib/models/Wine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // id is wineryId
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Find wines in this winery
        const wines = await Wine.find({ wineryId: id }).sort({ name: 1 });

        return NextResponse.json(wines);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
