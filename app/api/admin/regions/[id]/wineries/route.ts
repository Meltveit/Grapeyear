import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Winery from "@/lib/models/Winery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Find wineries in this region
        // Note: The param here is 'id' which refers to REGION ID based on the folder path [id]/wineries
        const wineries = await Winery.find({ region: id }).sort({ name: 1 });

        return NextResponse.json(wineries);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
