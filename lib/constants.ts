export const TOP_REGIONS = [
    // --- FRANCE ---
    {
        slug: 'bordeaux',
        name: 'Bordeaux',
        country: 'France',
        countryCode: 'FR',
        coordinates: [-0.5792, 44.8378],
        description: 'Bordeaux is the world\'s most famous wine region, celebrated for its legendary "Right Bank" Merlot and "Left Bank" Cabernet Sauvignon blends. The region\'s maritime climate, tempered by the Gironde estuary, creates wines of power, structure, and immense aging potential.',
        imageUrl: '/images/countries/france.jpg'
    },
    {
        slug: 'burgundy',
        name: 'Burgundy',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.8322, 47.0260],
        description: 'The spiritual home of terroir, where Pinot Noir and Chardonnay reach their zenith. Burgundy\'s fragmented landscape of Premier and Grand Cru vineyards produces wines of unparalleled elegance, expressing the subtle nuances of each plot\'s limestone soils.',
        imageUrl: '/images/regions/burgundy.jpg'
    },
    {
        slug: 'champagne',
        name: 'Champagne',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.0333, 49.2583],
        description: 'The cold, chalky plains of Champagne yield the world\'s most prestigious sparkling wines. Using the "Méthode Champenoise," the region blends Pinot Noir, Chardonnay, and Meunier to create wines of brightness, acidity, and complex autolytic character.',
        imageUrl: '/images/regions/champagne.jpg'
    },
    {
        slug: 'rhone-valley',
        name: 'Rhone Valley',
        country: 'France',
        countryCode: 'FR',
        coordinates: [4.8055, 44.1381], // Southern Rhone (Chateauneuf area)
        description: 'Divided into North and South, the Rhône Valley is a powerhouse of Syrah and Grenache. From the peppery, focused reds of Côte-Rôtie to the warm, spicy blends of Châteauneuf-du-Pape, it offers bold wines shaped by the Mistral wind.',
        imageUrl: '/images/regions/rhone-valley.jpg'
    },
    {
        slug: 'alsace',
        name: 'Alsace',
        country: 'France',
        countryCode: 'FR',
        coordinates: [7.3615, 48.0794], // Colmar
        description: 'Nestled between the Vosges mountains and the Rhine, Alsace is a sun-drenched region famous for aromatic white wines. Its dry Rieslings, spicy Gewürztraminers, and lush Pinot Gris showcase a unique French-German cultural fusion.',
        imageUrl: '/images/regions/alsace.jpg'
    },

    // --- ITALY ---
    {
        slug: 'tuscany',
        name: 'Tuscany',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [11.2558, 43.7696],
        description: 'The heart of Italian wine, Tuscany is the land of Sangiovese. From the classic, savory Chianti Classico to the powerful, long-lived Brunello di Montalcino and the modern Super Tuscans, it combines history with innovation.',
        imageUrl: '/images/countries/italy.jpg'
    },
    {
        slug: 'piedmont',
        name: 'Piedmont',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [7.6869, 45.0703],
        description: 'Often called the "Burgundy of Italy," Piedmont is the realm of the Nebbiolo grape. Its foggy hills produce Barolo and Barbaresco—wines of immense tannic structure, floral aromas, and exceptional longevity.',
        imageUrl: '/images/regions/piedmont.jpg'
    },

    // --- USA ---
    {
        slug: 'napa-valley',
        name: 'Napa Valley',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.2869, 38.2975],
        description: 'California\'s most iconic region, Napa Valley sets the global standard for opulent, fruit-forward Cabernet Sauvignon. Its warm climate and diverse volcanic soils produce powerful, velvety reds that rival the best of Bordeaux.',
        imageUrl: '/images/countries/usa.jpg'
    },
    {
        slug: 'sonoma-county',
        name: 'Sonoma County',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.7116, 38.4413], // Santa Rosa
        description: 'Napa\'s laid-back neighbor, Sonoma is a vast region of microclimates. It excels in cool-climate Pinot Noir and Chardonnay from the coast, as well as robust Zinfandels and Cabernets from its warmer valleys.',
        imageUrl: '/images/regions/sonoma-county.jpg'
    },
    {
        slug: 'willamette-valley',
        name: 'Willamette Valley',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-122.9840, 45.1667],
        description: 'Oregon\'s Willamette Valley is the New World\'s answer to Burgundy. Its cool, wet climate is ideal for Pinot Noir, producing wines with earthy complexity, bright red fruit, and delicate structure.',
        imageUrl: '/images/regions/willamette-valley.jpg'
    },
    {
        slug: 'santa-barbara',
        name: 'Santa Barbara',
        country: 'USA',
        countryCode: 'US',
        coordinates: [-120.2544, 34.6394],
        description: 'Unique for its transverse mountain ranges, Santa Barbara funnels cool ocean air deep inland. This creates a paradise for Pinot Noir and Chardonnay in the west, and Syrah and Bordeaux varieties in the warmer east.',
        imageUrl: '/images/regions/santa-barbara.jpg'
    },

    // --- SPAIN ---
    {
        slug: 'rioja',
        name: 'Rioja',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [-2.4456, 42.4658],
        description: 'Spain\'s premier wine region, famous for its oak-aged Tempranillo blends. Rioja balances fruit with savory notes of leather and spice, categorized by a strict aging system from Crianza to Gran Reserva.',
        imageUrl: '/images/countries/spain.jpg'
    },
    {
        slug: 'ribera-del-duero',
        name: 'Ribera del Duero',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [-3.7042, 41.6702],
        description: 'Located on a high plateau, Ribera del Duero experiences extreme temperature swings. This results in "Tinto Fino" (Tempranillo) wines of immense concentration, dark fruit, and robust tannins.',
        imageUrl: '/images/regions/ribera-del-duero.jpg'
    },
    {
        slug: 'priorat',
        name: 'Priorat',
        country: 'Spain',
        countryCode: 'ES',
        coordinates: [0.8166, 41.1309],
        description: 'A rugged region of steep, terraced vineyards on distinctive "Llicorella" slate soils. Priorat produces powerful, mineral-driven reds based on Garnacha and Carineña that are among Spain\'s most prestigious.',
        imageUrl: '/images/regions/priorat.jpg'
    },

    // --- GERMANY / AUSTRIA / HUNGARY ---
    {
        slug: 'mosel',
        name: 'Mosel',
        country: 'Germany',
        countryCode: 'DE',
        coordinates: [7.0, 49.9],
        description: 'The Mosel Valley is defined by its breathtakingly steep slate vineyards along the river. It produces the world\'s lightest, most delicate Rieslings, balancing razor-sharp acidity with floral sweetness.',
        imageUrl: '/images/countries/germany.jpg'
    },
    {
        slug: 'wachau',
        name: 'Wachau',
        country: 'Austria',
        countryCode: 'AT',
        coordinates: [15.4055, 48.3639],
        description: 'A UNESCO World Heritage site, the Wachau valley produces Austria\'s finest white wines. Its steep stone terraces yield Grüner Veltliner and Riesling of great power, purity, and mineral depth.',
        imageUrl: '/images/countries/austria.jpg'
    },
    {
        slug: 'tokaj',
        name: 'Tokaj',
        country: 'Hungary',
        countryCode: 'HU',
        coordinates: [21.4087, 48.1270],
        description: 'The world\'s first demarcated wine region, famously known for Tokaji Aszú. These legendary sweet wines are produced from Furmint grapes affected by noble rot, offering incredible complexity and longevity.',
        imageUrl: '/images/countries/hungary.jpg'
    },

    // --- REST OF WORLD ---
    {
        slug: 'mendoza',
        name: 'Mendoza',
        country: 'Argentina',
        countryCode: 'AR',
        coordinates: [-68.8272, -32.8895],
        description: 'High in the Andean foothills, Mendoza has made Malbec a global superstar. The altitude creates intense sunlight and cool nights, resulting in deep, violet-hued wines with plush tannins and floral aromas.',
        imageUrl: '/images/countries/argentina.jpg'
    },
    {
        slug: 'maipo-valley',
        name: 'Maipo Valley',
        country: 'Chile',
        countryCode: 'CL',
        coordinates: [-70.7, -33.6],
        description: 'Known as the "Bordeaux of South America," the Maipo Valley surrounds Santiago. It is celebrated for its structured, minty Cabernet Sauvignon that thrives in the Mediterranean climate.',
        imageUrl: '/images/countries/chile.jpg'
    },
    {
        slug: 'colchagua-valley',
        name: 'Colchagua Valley',
        country: 'Chile',
        countryCode: 'CL',
        coordinates: [-71.3, -34.6],
        description: 'A warm, sunny region producing ripe and full-bodied reds. Colchagua is a stronghold for Carmenère, Chile\'s signature grape, as well as rich Syrah and Cabernet Sauvignon.',
        imageUrl: '/images/regions/colchagua-valley.jpg'
    },
    {
        slug: 'barossa-valley',
        name: 'Barossa Valley',
        country: 'Australia',
        countryCode: 'AU',
        coordinates: [138.95, -34.53],
        description: 'Home to some of the world\'s oldest vines, Barossa is synonymous with big, bold Shiraz. These wines are known for their rich blackberry fruit, chocolate notes, and velvety texture.',
        imageUrl: '/images/countries/australia.jpg'
    },
    {
        slug: 'marlborough',
        name: 'Marlborough',
        country: 'New Zealand',
        countryCode: 'NZ',
        coordinates: [173.8, -41.5],
        description: 'Marlborough put New Zealand on the wine map with its explosive Sauvignon Blanc. Defined by pungent aromas of passionfruit, lime, and fresh cut grass, it is a globally recognized style.',
        imageUrl: '/images/countries/new-zealand.jpg'
    },
    {
        slug: 'stellenbosch',
        name: 'Stellenbosch',
        country: 'South Africa',
        countryCode: 'ZA',
        coordinates: [18.8602, -33.9321],
        description: 'The historic heart of South African wine, Stellenbosch is a mountainous region with diverse soils. It excels in Bordeaux blends and Pinotage, offering a style that bridges the Old and New Worlds.',
        imageUrl: '/images/countries/south-africa.jpg'
    },
    {
        slug: 'douro-valley',
        name: 'Douro Valley',
        country: 'Portugal',
        countryCode: 'PT',
        coordinates: [-7.5, 41.15],
        description: 'A UNESCO site of dramatic, terraced slopes along the Douro River. Originally famous for Port, it now produces some of Portugal\'s most concentrated and elegant dry red wines from indigenous grapes.',
        imageUrl: '/images/countries/portugal.jpg'
    },

    // --- NEW ADDITIONS (ROUND 3) ---
    {
        slug: 'veneto',
        name: 'Veneto',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [10.99, 45.43], // Verona area
        description: 'One of Italy\'s most productive regions, famous for the rich, dried-grape Amarone della Valpolicella and the globally popular sparkling Prosecco.',
        imageUrl: '/images/regions/veneto.jpg'
    },
    {
        slug: 'sicily',
        name: 'Sicily',
        country: 'Italy',
        countryCode: 'IT',
        coordinates: [14.96, 37.75], // Etna
        description: 'A Mediterranean island experiencing a wine renaissance. The volcanic soils of Mount Etna produce mineral-driven Nerello Mascalese, while Nero d\'Avola thrives in the warm south.',
        imageUrl: '/images/regions/sicily.jpg'
    },
    {
        slug: 'loire-valley',
        name: 'Loire Valley',
        country: 'France',
        countryCode: 'FR',
        coordinates: [0.75, 47.4], // Tours area
        description: 'The "Garden of France" offers a diverse array of styles. From the flinty Sauvignon Blanc of Sancerre to the Cabernet Franc of Chinon and sweet Chenin Blanc, it is a region of elegance.',
        imageUrl: '/images/regions/loire-valley.jpg'
    },
    {
        slug: 'provence',
        name: 'Provence',
        country: 'France',
        countryCode: 'FR',
        coordinates: [6.0, 43.5],
        description: 'The undisputed global leader in Rosé. This sun-soaked Mediterranean region produces pale, dry, and aromatic pink wines that define the lifestyle of the French Riviera.',
        imageUrl: '/images/regions/provence.jpg'
    },
    {
        slug: 'margaret-river',
        name: 'Margaret River',
        country: 'Australia',
        countryCode: 'AU',
        coordinates: [115.1, -33.9],
        description: 'A premium region in Western Australia with a maritime climate similar to Bordeaux. It is celebrated for its sophisticated Cabernet Sauvignon and elegant Chardonnay.',
        imageUrl: '/images/regions/margaret-river.jpg'
    },
    {
        slug: 'rheingau',
        name: 'Rheingau',
        country: 'Germany',
        countryCode: 'DE',
        coordinates: [7.9, 50.0],
        description: 'A historic stretch of the Rhine where vineyards face south to maximize sun exposure. The Rheingau produces powerful, aristocratic Rieslings with great aging potential.',
        imageUrl: '/images/regions/rheingau.jpg'
    },
    {
        slug: 'salta',
        name: 'Salta',
        country: 'Argentina',
        countryCode: 'AR',
        coordinates: [-66.3, -25.5], // Cafayate
        description: 'Home to some of the world\'s highest vineyards. Salta matches its extreme altitude with the floral, aromatic Torrontés white wine and intense, concentrated Malbec.',
        imageUrl: '/images/regions/salta.jpg'
    },
    {
        slug: 'casablanca-valley',
        name: 'Casablanca Valley',
        country: 'Chile',
        countryCode: 'CL',
        coordinates: [-71.4, -33.3],
        description: 'Chile\'s premier cool-climate region, cooled by morning fogs from the Pacific Ocean. It produces crisp, fresh Sauvignon Blanc and elegant Pinot Noir.',
        imageUrl: '/images/regions/casablanca-valley.jpg'
    },
];

export const YEARS_TO_FETCH = Array.from({ length: 21 }, (_, i) => 2025 - i); // [2025, 2024, ..., 2005]
