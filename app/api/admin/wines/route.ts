import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Wine from "@/lib/models/Wine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        await connectToDatabase();

        const wine = await Wine.create({
            ...body,
            createdAt: new Date(),
        });

        return NextResponse.json(wine);
    } catch (error) {
        console.error("Wine Creation Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
