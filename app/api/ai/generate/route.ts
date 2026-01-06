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

        const { prompt, type, websiteUrl } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let websiteContext = "";
        if (websiteUrl && type === 'winery') {
            console.log(`[AI] Attempting to scrape: ${websiteUrl}`);
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);
                const scrapeRes = await fetch(websiteUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
                    signal: controller.signal
                });
                clearTimeout(timeout);

                if (scrapeRes.ok) {
                    const html = await scrapeRes.text();
                    websiteContext = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gmi, "")
                        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gmi, "")
                        .replace(/<[^>]+>/g, " ")
                        .replace(/\s+/g, " ")
                        .substring(0, 12000); // Context window 
                    console.log(`[AI] Scraped ${websiteContext.length} chars from website.`);
                }
            } catch (err) {
                console.warn("[AI] Generic scraping failed (expected for some sites)", err);
            }
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Prioritize Pro models
        // const model = ... -> MOVED TO LOOP

        // Context setting based on type
        // Context setting based on type
        let systemInstruction = "You are an expert wine writer for Grapeyear, a premium wine platform. Write STRICTLY in English. ";
        let isJson = false;

        if (type === 'winery') {
            isJson = true;
            if (websiteContext) {
                systemInstruction += `\n\n[OFFICIAL WEBSITE CONTENT START]\n${websiteContext}\n[OFFICIAL WEBSITE CONTENT END]\nUse the above website content to ensure factual accuracy (history, terroir, specific wines), but Ignore navigation/footer text. Maintain the High-End Critic tone.\n`;
            }

            systemInstruction += `
            You are a world-class wine critic and copywriter (like Robert Parker or Jancis Robinson). 
            Create a COMPREHENSIVE winery profile based on the name${websiteContext ? ' and provided website context' : ''}. 
            The tone should be sophisticated, evocative, and authoritative.
            
            Structure the 'description' field using clean spacing (paragraphs) and HEADER LABELS in uppercase (e.g. 'HISTORY:', 'TERROIR:'). Do NOT use Markdown symbols like ** or ##, just uppercase labels.

            Return a RAW JSON object (no markdown formatting around the json) with these exact keys:
            - description: A long, detailed profile (300-500 words) covering History, Terroir, Philosophy, Top Wines, and Global Status. Break into readable sections.
            - metaTitle: A perfect SEO title (approx 50-60 chars). Format: "[Winery Name] | [Short Tagline] - GrapeYear".
            - metaDescription: A compelling SEO description (approx 150-160 chars).
            - location: The full address or main location (City, Region, Country). Extract from website contact/footer if available.
            - phone: Official phone number in international format (e.g. +33 ...). Extract from website if available.

            Example Description Style (MIMIC THIS EXACTLY):
            Weingut Robert Weil: The Blue Label Standard of Riesling Excellence
            Weingut Robert Weil is a name synonymous with prestige, precision, and the highest expression of German Riesling. Instantly recognizable by its iconic "Tiffany blue" labels, this Rheingau estate is globally regarded as one of the finest white wine producers in the world and remains a favorite in the most exclusive cellars across the United States.

            A Vision of Quality Since 1875
            Founded in 1875 by Dr. Robert Weil, the estate was built with a singular focus: to produce Rieslings that could compete on the world stage with the finest wines of Bordeaux and Burgundy. Today, under the leadership of Wilhelm Weil, the fourth generation of the family, the winery has reached an unprecedented level of consistency. Weingut Robert Weil is a proud member of the VDP (Verband Deutscher Prädikatsweingüter) and is celebrated for its unwavering commitment to 100% Riesling production.

            The Crown Jewel: Kiedrich Gräfenberg
            The soul of Robert Weil’s wines lies in the village of Kiedrich. The estate’s most famous vineyard, the Kiedrich Gräfenberg, is classified as a Grosse Lage (Grand Cru) and is widely considered one of the best vineyard sites in the world.

            The Terroir: Stony soils of phyllite and quartz, which impart a piercing minerality and a unique saline character to the wine.

            Microclimate: The high elevation and steep slopes of the Kiedrich hills allow for a long growing season, resulting in grapes with incredible aromatic depth and vibrant, racy acidity.

            The "Blue Label" Style: Purity and Precision
            Whether dry or sweet, a Robert Weil Riesling is defined by its crystalline purity. The estate is one of the few producers capable of producing the entire spectrum of Riesling quality levels in every single vintage—from the crisp, dry Tradition to the lusciously sweet and rare Trockenbeerenauslese (TBA).

            Aromas: Notes of white peach, green apple, and citrus blossoms, often evolving into complex flinty and spicy undertones.

            Aging Potential: Robert Weil wines are legendary for their longevity, with top-tier bottlings capable of evolving gracefully for 50 years or more.

            A Global Ambassador for German Wine
            Weingut Robert Weil has achieved a level of brand recognition that few other German wineries can match. Particularly in the American market, the "Blue Label" has become a symbol of luxury and reliable excellence. It is a staple in high-end gastronomy and a must-have for serious collectors who value the intersection of historical tradition and modern perfection.
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

        const modelsToTry = [
            'gemini-2.5-pro',        // Best for High Quality Writing / SEO
            'gemini-3-pro-preview',  // Cutting Edge
            'gemini-2.5-flash',      // Fallback
            'gemini-2.0-flash',
            'gemini-flash-latest',
            'gemini-pro-latest'
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AI] Attempting with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                const text = response.text();

                console.log(`[AI] Success with ${modelName}. Length: ${text.length}`);
                return NextResponse.json({ text });

            } catch (err: any) {
                console.error(`[AI] Failed with ${modelName}:`, err.message);
                lastError = err;
                // Continue to next model
            }
        }

        console.error("[AI] All models failed.");

        // Debug: List available models
        try {
            console.log("[AI] Fetching available models for diagnosis...");
            const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const listData = await listRes.json();
            console.log("[AI] Available Models Response:", JSON.stringify(listData, null, 2));
        } catch (debugErr) {
            console.error("[AI] Failed to list models:", debugErr);
        }

        return NextResponse.json({ error: 'AI Service Unavailable: ' + (lastError?.message || 'Unknown') }, { status: 500 });
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
