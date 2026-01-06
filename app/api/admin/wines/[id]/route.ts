import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Wine from "@/lib/models/Wine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const wine = await Wine.findById(id);

        if (!wine) {
            return NextResponse.json({ error: "Wine not found" }, { status: 404 });
        }

        return NextResponse.json(wine);
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

        const wine = await Wine.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!wine) {
            return NextResponse.json({ error: "Wine not found" }, { status: 404 });
        }

        // IndexNow Trigger?
        // Maybe later for individual wine pages.

        return NextResponse.json(wine);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
