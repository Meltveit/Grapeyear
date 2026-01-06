import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured in .env.local' },
                { status: 500 }
            );
        }

        const { prompt, type } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Context setting based on type
        let systemInstruction = "You are an expert wine writer for Grapeyear, a premium wine platform. ";
        if (type === 'winery') {
            systemInstruction += "Write a compelling, sophisticated description for a winery. Focus on terroir, history, and style. Keep it under 150 words.";
        } else if (type === 'wine') {
            systemInstruction += "Write a tasting note and description for a specific wine. Focus on flavor profile, structure, and pairing. Keep it under 100 words.";
        } else if (type === 'vintage') {
            systemInstruction += "Summarize the vintage conditions based on the provided weather metrics. Be objective but evocative.";
        }

        const fullPrompt = `${systemInstruction}\n\nTask: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
