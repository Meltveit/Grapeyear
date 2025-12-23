export const TOP_REGIONS = [
    // --- FRANCE ---
    {
        slug: 'bordeaux',
        name: 'Bordeaux',
        country: 'France',
        countryCode: 'FR',
        coordinates: [-0.5792, 44.8378],
        description: 'World-renowned for Cabernet Sauvignon and Merlot blends.',
        imageUrl: 'https://images.unsplash.com/photo-1547517173-03b749dc5a5e?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'burgundy',
        name: 'Burgundy',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.8322, 47.0260],
        description: 'The benchmark for Pinot Noir and Chardonnay.',
        imageUrl: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'champagne',
        name: 'Champagne',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.0333, 49.2583],
        description: 'The global standard for sparkling wine.',
        imageUrl: 'https://images.unsplash.com/photo-1597335607386-35ba7967926b?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'rhone-valley',
        name: 'Rhone Valley',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.8055, 44.1381], // Southern Rhone (Chateauneuf area)
        description: 'Home of powerful Syrah and spicy Grenache blends.',
        imageUrl: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'alsace',
        name: 'Alsace',
        country: 'France',
        countryCode: 'FR',
        coordinates: [7.3615, 48.0794], // Colmar
        description: 'Aromatic white wines like Riesling and Gewürztraminer.',
        imageUrl: 'https://images.unsplash.com/photo-1596703554605-247963283256?q=80&w=800&auto=format&fit=crop'
    },

    // --- ITALY ---
    {
        slug: 'tuscany',
        name: 'Tuscany',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [11.2558, 43.7696],
        description: 'Home of Chianti, Brunello, and Super Tuscans.',
        imageUrl: 'https://images.unsplash.com/photo-1572569878862-246d87e0747e?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'piedmont',
        name: 'Piedmont',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [7.6869, 45.0703],
        description: 'Famous for Barolo and Barbaresco (Nebbiolo).',
        imageUrl: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=800&auto=format&fit=crop'
    },

    // --- USA ---
    {
        slug: 'napa-valley',
        name: 'Napa Valley',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.2869, 38.2975],
        description: 'Premier region for Cabernet Sauvignon in the New World.',
        imageUrl: 'https://images.unsplash.com/photo-1548685913-fe6678babe8d?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'sonoma-county',
        name: 'Sonoma County',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.7116, 38.4413], // Santa Rosa
        description: 'Diverse region famous for Pinot Noir and Chardonnay.',
        imageUrl: 'https://images.unsplash.com/photo-1627581134080-692789139263?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'willamette-valley',
        name: 'Willamette Valley',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.9840, 45.1667],
        description: 'World-class cool-climate Pinot Noir.',
        imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'santa-barbara',
        name: 'Santa Barbara',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-120.2544, 34.6394],
        description: 'Burgundian varieties in a coastal Californian setting.',
        imageUrl: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?q=80&w=800&auto=format&fit=crop'
    },

    // --- SPAIN ---
    {
        slug: 'rioja',
        name: 'Rioja',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [-2.4456, 42.4658],
        description: 'Spain’s most famous region, known for Tempranillo.',
        imageUrl: 'https://images.unsplash.com/photo-1512403983286-9dc730d32f2f?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'ribera-del-duero',
        name: 'Ribera del Duero',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [-3.7042, 41.6702],
        description: 'Bold, high-altitude Tempranillo wines.',
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'priorat',
        name: 'Priorat',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [0.8166, 41.1309],
        description: 'Intense wines from steep slate slopes.',
        imageUrl: 'https://images.unsplash.com/photo-1566838381836-e414c330f545?q=80&w=800&auto=format&fit=crop'
    },

    // --- GERMANY / AUSTRIA / HUNGARY ---
    {
        slug: 'mosel',
        name: 'Mosel',
        country: 'Germany',
        countryCode: 'DE',
        coordinates: [7.0, 49.9],
        description: 'Steep slopes producing world-class Riesling.',
        imageUrl: 'https://images.unsplash.com/photo-1563820658760-4def71be582d?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'wachau',
        name: 'Wachau',
        country: 'Austria',
        countryCode: 'AT',
        coordinates: [15.4055, 48.3639],
        description: 'Known for mineral-driven Grüner Veltliner and Riesling.',
        imageUrl: 'https://images.unsplash.com/photo-1594300742183-11381333792f?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'tokaj',
        name: 'Tokaj',
        country: 'Hungary',
        countryCode: 'HU',
        coordinates: [21.4087, 48.1270],
        description: 'Historic sweet wines affected by noble rot (Aszú).',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
    },

    // --- REST OF WORLD ---
    {
        slug: 'mendoza',
        name: 'Mendoza',
        country: 'Argentina',
        countryCode: 'AR',
        coordinates: [-68.8272, -32.8895],
        description: 'High-altitude Malbec specialist.',
        imageUrl: 'https://images.unsplash.com/photo-1534234828569-1f27c7e81e31?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'maipo-valley',
        name: 'Maipo Valley',
        country: 'Chile',
        countryCode: 'CL',
        coordinates: [-70.7, -33.6],
        description: 'The Bordeaux of South America.',
        imageUrl: 'https://images.unsplash.com/photo-1629231464522-875f56b2c86b?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'colchagua-valley',
        name: 'Colchagua Valley',
        country: 'Chile',
        countryCode: 'CL',
        coordinates: [-71.3, -34.6],
        description: 'Famous for lush Carmenere and Cabernet.',
        imageUrl: 'https://images.unsplash.com/photo-1582848386829-d5c2250284ae?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'barossa-valley',
        name: 'Barossa Valley',
        country: 'Australia',
        countryCode: 'AU',
        coordinates: [138.95, -34.53],
        description: 'Famous for powerful Shiraz.',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'marlborough',
        name: 'Marlborough',
        country: 'New Zealand',
        countryCode: 'NZ',
        coordinates: [173.8, -41.5],
        description: 'The world capital of Sauvignon Blanc.',
        imageUrl: 'https://images.unsplash.com/photo-1501601004392-5444ca9f4a5c?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'stellenbosch',
        name: 'Stellenbosch',
        country: 'South Africa',
        countryCode: 'ZA',
        coordinates: [18.8602, -33.9321],
        description: 'Historic estates producing Cabernet and Pinotage.',
        imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'douro-valley',
        name: 'Douro Valley',
        country: 'Portugal',
        countryCode: 'PT',
        coordinates: [-7.5, 41.15],
        description: 'Terraced vineyards created for Port and dry reds.',
        imageUrl: 'https://images.unsplash.com/photo-1585501815599-2475510667db?q=80&w=800&auto=format&fit=crop'
    },
];

export const YEARS_TO_FETCH = Array.from({ length: 21 }, (_, i) => 2025 - i); // [2025, 2024, ..., 2005]
