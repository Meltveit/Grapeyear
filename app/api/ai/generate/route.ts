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
        // Use gemini-1.5-flash for speed if available, or fall back to 1.5-pro or pro.
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Context setting based on type
        let systemInstruction = "You are an expert wine writer for Grapeyear, a premium wine platform. Write STRICTLY in English. ";
        if (type === 'winery') {
            systemInstruction += "Write a compelling, sophisticated description for a winery. Focus on terroir, history, and style. Keep it under 150 words.";
        } else if (type === 'wine') {
            systemInstruction += "Write a tasting note and description for a specific wine. Focus on flavor profile, structure, and pairing. Keep it under 100 words.";
        } else if (type === 'vintage') {
            systemInstruction += "Summarize the vintage conditions based on the provided weather metrics. Be objective but evocative.";
        } else if (type === 'region') {
            systemInstruction += "Write a compelling description for a wine region. Focus on climate and styles.";
        } else if (type === 'intro_template') {
            systemInstruction += "Write a flexible intro template for a country's wine scene. Use placeholders like {Year} to make it dynamic.";
        }

        console.log(`[AI] Generating for type: ${type}`);
        console.log(`[AI] System Instruction: ${systemInstruction.substring(0, 50)}...`);

        const fullPrompt = `${systemInstruction}\n\nTask: ${prompt}`;

        try {
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();
            console.log(`[AI] Success. Length: ${text.length}`);

            return NextResponse.json({ text });
        } catch (apiError) {
            console.error("[AI] Gemini API Error:", apiError);
            // Fallback to gemini-pro if flash fails (handling older keys/regions)
            try {
                console.log("[AI] Retrying with gemini-pro...");
                const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
                const result = await fallbackModel.generateContent(fullPrompt);
                const response = await result.response;
                const text = response.text();
                return NextResponse.json({ text });
            } catch (fallbackError) {
                console.error("[AI] Fallback failed:", fallbackError);
                return NextResponse.json({ error: 'AI Service Unavailable' }, { status: 500 });
            }
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
