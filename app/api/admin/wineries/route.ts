import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Winery from "@/lib/models/Winery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        await connectToDatabase();

        const winery = await Winery.create({
            ...body,
            createdAt: new Date(),
        });

        // Trigger IndexNow (Proactive Indexing)
        // ... (Similar logic as PUT)

        return NextResponse.json(winery);
    } catch (error: any) {
        console.error("Winery Creation Error", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "A winery with this slug already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
