import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/lib/models/Message";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const { email, message, subject } = body;

        if (!email || !message) {
            return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
        }

        const newMessage = await Message.create({
            email,
            message,
            subject: subject || 'General Inquiry'
        });

        return NextResponse.json({ success: true, id: newMessage._id });

    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
