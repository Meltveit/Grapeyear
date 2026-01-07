import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/lib/models/Message";

export async function GET() {
    try {
        await connectToDatabase();
        // Fetch most recent first
        const messages = await Message.find({}).sort({ createdAt: -1 });
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Messages API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
