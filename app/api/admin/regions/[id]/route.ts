import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Region from "@/lib/models/Region";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const region = await Region.findById(id);

        if (!region) {
            return NextResponse.json({ error: "Region not found" }, { status: 404 });
        }

        return NextResponse.json(region);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        await connectToDatabase();
        const { id } = await params;

        const region = await Region.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!region) {
            return NextResponse.json({ error: "Region not found" }, { status: 404 });
        }

        return NextResponse.json(region);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
