export const TOP_REGIONS = [
    {
        slug: 'bordeaux',
        name: 'Bordeaux',
        country: 'France',
        countryCode: 'FR',
        coordinates: [-0.5792, 44.8378], // lon, lat
        description: 'World-renowned for Cabernet Sauvignon and Merlot blends.',
        imageUrl: 'https://images.unsplash.com/photo-1532529867795-e81a95e3015f?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'burgundy',
        name: 'Burgundy',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.8322, 47.0260],
        description: 'The benchmark for Pinot Noir and Chardonnay.',
        imageUrl: 'https://images.unsplash.com/photo-1596703554605-247963283256?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'tuscany',
        name: 'Tuscany',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [11.2558, 43.7696],
        description: 'Home of Chianti, Brunello, and Super Tuscans.',
        imageUrl: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'piedmont',
        name: 'Piedmont',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [7.6869, 45.0703],
        description: 'Famous for Barolo and Barbaresco (Nebbiolo).',
        imageUrl: 'https://images.unsplash.com/photo-1563820658760-4def71be582d?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'napa-valley',
        name: 'Napa Valley',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.2869, 38.2975],
        description: 'Premier region for Cabernet Sauvignon in the New World.',
        imageUrl: 'https://images.unsplash.com/photo-1572569878862-246d87e0747e?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'rioja',
        name: 'Rioja',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [-2.4456, 42.4658],
        description: 'Spain’s most famous region, known for Tempranillo.',
        imageUrl: 'https://images.unsplash.com/photo-1566838381836-e414c330f545?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'mosel',
        name: 'Mosel',
        country: 'Germany',
        countryCode: 'DE',
        coordinates: [7.0, 49.9],
        description: 'Steep slopes producing world-class Riesling.',
        imageUrl: 'https://images.unsplash.com/photo-1549646702-8a9d1d5750d4?q=80&w=800&auto=format&fit=crop'
    },
    {
        slug: 'barossa-valley',
        name: 'Barossa Valley',
        country: 'Australia',
        countryCode: 'AU',
        coordinates: [138.95, -34.53],
        description: 'Famous for powerful Shiraz.',
        imageUrl: 'https://images.unsplash.com/photo-1473660857774-4c4f3261642c?q=80&w=800&auto=format&fit=crop'
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
        slug: 'mendoza',
        name: 'Mendoza',
        country: 'Argentina',
        countryCode: 'AR',
        coordinates: [-68.8272, -32.8895],
        description: 'High-altitude Malbec specialist.',
        imageUrl: 'https://images.unsplash.com/photo-1534032890-da74360e515d?q=80&w=800&auto=format&fit=crop'
    },
];

export const YEARS_TO_FETCH = Array.from({ length: 20 }, (_, i) => 2024 - i); // [2024, 2023, ..., 2005]
