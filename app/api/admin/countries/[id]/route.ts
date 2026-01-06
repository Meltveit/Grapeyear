import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Country from "@/lib/models/Country";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const country = await Country.findById(params.id);

        if (!country) {
            return NextResponse.json({ error: "Country not found" }, { status: 404 });
        }

        return NextResponse.json(country);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        await connectToDatabase();

        const country = await Country.findByIdAndUpdate(
            params.id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!country) {
            return NextResponse.json({ error: "Country not found" }, { status: 404 });
        }

        return NextResponse.json(country);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
