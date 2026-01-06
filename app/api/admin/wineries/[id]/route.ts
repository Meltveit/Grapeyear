import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Winery from "@/lib/models/Winery";
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
        const winery = await Winery.findById(id);

        if (!winery) {
            return NextResponse.json({ error: "Winery not found" }, { status: 404 });
        }

        return NextResponse.json(winery);
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

        const winery = await Winery.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!winery) {
            return NextResponse.json({ error: "Winery not found" }, { status: 404 });
        }

        // Trigger IndexNow (Proactive Indexing)
        try {
            (async () => {
                // Fetch region to get country slug
                // Hierarchy: Winery -> Region -> Country
                // Winery URL: /vineyards/[country]/[region]/[winerySlug] ? Or just /wineries/[slug]?
                // The implementation plan says /wineries/[region], but user wants specific winery pages.
                // Let's assume /wineries/[slug] for now or nested. 
                // Actually, let's stick to simple submission for now.
                if (winery.slug) {
                    const { submitToIndexNow } = await import('@/lib/indexnow');
                    // We need to know the full URL structure.
                    // Let's defer this specific URL construction until we decide the public route.
                }
            })();
        } catch (e) {
            console.error(e);
        }

        return NextResponse.json(winery);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
