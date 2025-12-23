export interface GrapeVariety {
    name: string;
    slug: string;
    description: string;
    idealClimate: string;
    soilPreference: string;
    characteristics: string;
    dislikes: string;
    imageUrl: string;
}

export const GRAPE_VARIETIES: GrapeVariety[] = [
    {
        name: 'Cabernet Sauvignon',
        slug: 'cabernet-sauvignon',
        description: 'The King of Grapes. Thick-skinned, late-ripening, and capable of producing wines with massive structure and ageability.',
        idealClimate: 'Warm regions. Needs heat to ripen fully thanks to late ripening cycle.',
        soilPreference: 'Gravel (like Bordeaux Left Bank). Excellent drainage is key.',
        characteristics: 'Blackcurrant, Cassis, Cedar, Graphite, Green Bell Pepper (if unripe).',
        dislikes: 'Cool climates (stays herbaceous), Spring Frost.',
        imageUrl: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Pinot Noir',
        slug: 'pinot-noir',
        description: 'The Heartbreak Grape. Notoriously difficult to grow but produces the most elegant and perfumed wines in the world.',
        idealClimate: 'Cool to Moderate. Loses elegance in hot climates.',
        soilPreference: 'Limestone and Clay (like Burgundy).',
        characteristics: 'Cherry, Raspberry, Mushroom, Forest Floor, Violets.',
        dislikes: 'Extreme heat (jammyness), Rot, Mildew.',
        imageUrl: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Chardonnay',
        slug: 'chardonnay',
        description: 'The Winemaker’s Canvas. A neutral grape that perfectly reflects its terroir and winemaking techniques (oak vs steel).',
        idealClimate: 'Adaptable. Best in Cool (Chablis) to Moderate climates.',
        soilPreference: 'Limestone, Chalk.',
        characteristics: 'Green Apple, Citrus, Butter (if oaked), Vanilla, Toast.',
        dislikes: 'Spring Frost (early budding).',
        imageUrl: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Riesling',
        slug: 'riesling',
        description: 'The Liquid Gold. High acidity and intense aromatics allow it to age for decades. Ranges from bone dry to intensely sweet.',
        idealClimate: 'Cool climates (Germany, Alsace).',
        soilPreference: 'Slate (Mosel), Granite.',
        characteristics: 'Lime, Green Apple, Beeswax, Petrol (aged), Honey.',
        dislikes: 'New oak (masks the fruit).',
        imageUrl: 'https://images.unsplash.com/photo-1563820658760-4def71be582d?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Syrah / Shiraz',
        slug: 'syrah',
        description: 'Bold and Spicy. Known as Syrah in France (elegant, peppery) and Shiraz in Australia (bold, fruity).',
        idealClimate: 'Moderate to Warm.',
        soilPreference: 'Granite (Rhone), Iron-rich Clay.',
        characteristics: 'Blackberry, Black Pepper, Olive, Smoke, Meat.',
        dislikes: 'Too much shade (needs sun).',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Merlot',
        slug: 'merlot',
        description: 'Velvet in a Glass. Luscious, approachable, and often blended with Cabernet to add flesh to the bones.',
        idealClimate: 'Moderate to Warm. Ripens earlier than Cabernet.',
        soilPreference: 'Clay (holds water well, cool soils).',
        characteristics: 'Plum, Black Cherry, Chocolate, Dried Herbs.',
        dislikes: 'Drought (needs some moisture).',
        imageUrl: 'https://images.unsplash.com/photo-1532529867795-e81a95e3015f?q=80&w=800&auto=format&fit=crop'
    }
];
