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
        // Context setting based on type
        let systemInstruction = "You are an expert wine writer for Grapeyear, a premium wine platform. Write STRICTLY in English. ";
        let isJson = false;

        if (type === 'winery') {
            isJson = true;
            systemInstruction += `
            You are a world-class wine critic and copywriter (like Robert Parker or Jancis Robinson). 
            Create a COMPREHENSIVE winery profile based on the name provided. 
            The tone should be sophisticated, evocative, and authoritative.
            
            Structure the 'description' field using clean spacing (paragraphs) and HEADER LABELS in uppercase (e.g. 'HISTORY:', 'TERROIR:'). Do NOT use Markdown symbols like ** or ##, just uppercase labels.

            Return a RAW JSON object (no markdown formatting around the json) with these exact keys:
            - description: A long, detailed profile (300-500 words) covering History, Terroir, Philosophy, Top Wines, and Global Status. Break into readable sections.
            - metaTitle: A perfect SEO title (approx 50-60 chars). Format: "[Winery Name] | [Short Tagline] - Grapeyear".
            - metaDescription: A compelling SEO description (approx 150-160 chars).

            Example Description Style:
            THE ESTATE
            Founded in 1875, this estate represents the pinnacle of quality...

            TERROIR
            Located on steep slate slopes...
            `;
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

        const fullPrompt = `${systemInstruction}\n\nTask: ${prompt}\n\n${isJson ? 'OUTPUT STRICT JSON.' : ''}`;

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
