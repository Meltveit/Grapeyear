export interface DailyWeather {
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
}

/**
 * Calculate Growing Degree Days (GDD)
 * Base temperature usually 10°C for grapes (Winkler Scale)
 */
export function calculateGDD(dailyData: DailyWeather[], baseTemp = 10): number {
    return dailyData.reduce((acc, day) => {
        const avgTemp = (day.maxTemp + day.minTemp) / 2;
        const gdd = Math.max(0, avgTemp - baseTemp);
        return acc + gdd;
    }, 0);
}

/**
 * Calculate Average Diurnal Shift
 * Difference between daily high and low
 */
export function calculateDiurnalShift(dailyData: DailyWeather[]): number {
    if (dailyData.length === 0) return 0;

    const totalShift = dailyData.reduce((acc, day) => {
        return acc + (day.maxTemp - day.minTemp);
    }, 0);

    return totalShift / dailyData.length;
}

/**
 * Calculate Grapeyear Score (0-100)
 * Continuous scoring model
 */
export function calculateGrapeyearScore(metrics: {
    gdd: number;
    rainfall: number;
    diurnal: number;
    sunshineHours?: number;
    frostDays?: number;
}): { score: number; quality: string } {
    const { gdd, rainfall, diurnal, sunshineHours = 1500, frostDays = 0 } = metrics;

    let score = 50;

    // 1. GDD Scoring (Continuous Bell Curve approach simplifed)
    // Optimal: 1300-1600. 
    // Below 1000 is very difficult. Above 2000 is very hot.
    if (gdd >= 1300 && gdd <= 1600) {
        score += 25;
    } else if (gdd < 1300) {
        // Penalty for being cold. e.g. 1000 GDD -> -10 pts from max bonus
        const deficit = 1300 - gdd;
        score += Math.max(0, 25 - (deficit * 0.1));
    } else {
        // Penalty for being too hot 
        const excess = gdd - 1600;
        score += Math.max(0, 25 - (excess * 0.08));
    }

    // 2. Rainfall (Growing Season, approx 6-7 months)
    // Optimal: 300-500mm.
    // > 800mm is rot risk. < 200mm is drought.
    if (rainfall >= 300 && rainfall <= 500) {
        score += 20;
    } else if (rainfall < 300) {
        const drought = 300 - rainfall;
        score += Math.max(0, 20 - (drought * 0.1));
    } else { // > 500
        const wet = rainfall - 500;
        score += Math.max(0, 20 - (wet * 0.05));
    }

    // 3. Sunshine (More is generally better up to a point)
    // 1600+ is great. 2200+ is intense.
    if (sunshineHours > 1600) {
        score += 10;
        // Bonue for specific high sun
        score += Math.min(5, (sunshineHours - 1600) * 0.01);
    } else {
        // Less sun
        score += Math.max(0, (sunshineHours - 1000) * 0.01);
    }

    // 4. Diurnal (Crucial for acidity)
    // > 12 is good. > 15 is excellent.
    if (diurnal > 12) {
        score += Math.min(15, (diurnal - 10) * 2);
    }

    // 5. Frost Penalty (Severe)
    if (frostDays > 1) {
        score -= (frostDays * 5); // -5 points per frost day
    }

    // Cap score 0-100
    score = Math.min(100, Math.max(0, Math.round(score)));

    // Quality label
    let quality = 'average';
    if (score >= 93) quality = 'legendary';
    else if (score >= 88) quality = 'exceptional';
    else if (score >= 80) quality = 'excellent';
    else if (score >= 70) quality = 'good';
    else if (score >= 50) quality = 'average';
    else quality = 'challenging';

    return { score, quality };
}

/**
 * Generate AI Summary based on metrics
 */
export function generateVintageSummary(metrics: {
    gdd: number;
    rainfall: number;
    sunshineHours: number;
    frostDays: number;
    regionName: string;
    year: number;
    heatSpikes?: number;
    harvestRainMm?: number;
    earlyFrostDays?: number;
    lateFrostDays?: number;
    droughtStressMaxDays?: number;
}): string {
    const {
        gdd, rainfall, sunshineHours, frostDays, regionName, year,
        heatSpikes = 0, harvestRainMm = 0, earlyFrostDays = 0, lateFrostDays = 0, droughtStressMaxDays = 0
    } = metrics;

    // 1. Determine Vintage Style Profile
    let style = "Classic";
    if (gdd > 1750 && sunshineHours > 2200) style = "Powerhouse";
    else if (gdd > 1650) style = "Opulent";
    else if (gdd < 1250) style = "Lean";
    else if (gdd < 1400) style = "Elegant";

    // 2. Select Introduction based on Style (SEO: Starts with Region + Year)
    const intros = {
        "Powerhouse": [
            `${regionName} ${year} stands as a monumental vintage defined by immense power and density`,
            `For ${regionName} in ${year}, an intense, solar growing season yielded wines of profound concentration`,
            `${regionName} ${year} will be remembered as a warm, expressive season delivering fruit of exceptional seamlessness`
        ],
        "Opulent": [
            `${regionName} ${year} was a generous season resulting in rich, textured wines with broad appeal`,
            `Marked by abundance, ${regionName} ${year} produced wines with ripe, velvety tannins and significant depth`,
            `Warm conditions in ${regionName} during ${year} favored a broad, expansive stylistic profile`
        ],
        "Classic": [
            `${regionName} ${year} is a classically balanced season offering steady, even ripening throughout the harvest`,
            `${year} in ${regionName} serves as a benchmark vintage, favors finesse and structural integrity over sheer power`,
            `Transparency and terroir definition are the hallmarks of ${regionName} ${year}`
        ],
        "Elegant": [
            `${regionName} ${year} was a cool, protracted growing season prioritizing aromatics, lift, and definition`,
            `A focused vintage, ${year} in ${regionName} is defined by tension, energy, and vibrant acidity`,
            `Patience was rewarded in ${regionName} ${year} with wines of crystalline purity and nerve`
        ],
        "Lean": [
            `${regionName} ${year} proved to be a challenging, cool year requiring rigorous selection in the vineyard`,
            `A vintage for purists, ${regionName} ${year} offers sharp lines, savory complexity, and moderate alcohol`,
            `Cool temperatures in ${regionName} during ${year} preserved acidity but demanded low yields to achieve physiological ripeness`
        ]
    };

    // Pick a random intro from the matching style
    const selectedIntro = intros[style as keyof typeof intros][Math.floor(Math.random() * 3)];

    // 3. Elaborate on conditions (Add complexity and unique variables)
    const details: string[] = [];

    // Sunshine & Ripeness context
    if (heatSpikes > 5) {
        details.push(`The season saw extreme heat, with ${heatSpikes} days over 35°C, demanding careful canopy management to prevent sunburn`);
    } else if (sunshineHours > 2300) {
        details.push(`The season was driven by relentless sunshine (${Math.round(sunshineHours)} hours), ensuring deep phenolic maturity without greenness`);
    } else if (sunshineHours < 1800) {
        details.push(`The profile was shaped by significant cloud cover (${Math.round(sunshineHours)} hours of sun), which preserved delicate floral aromatics but slowed sugar accumulation`);
    } else {
        details.push(`Conditions were supported by optimal luminosity (${Math.round(sunshineHours)} hours of sun), allowing for gradual, seamless sugar accumulation`);
    }

    // Rainfall / Disease pressure / Drought
    if (droughtStressMaxDays > 40) {
        details.push(`A severe mid-season drought (${droughtStressMaxDays} dry days) stressed the vines, concentrating juice but reducing yields`);
    } else if (harvestRainMm > 80) {
        details.push(`However, heavy late-season rains (${Math.round(harvestRainMm)}mm) complicated the harvest, requiring rapid picking and strict sorting`);
    } else if (rainfall < 300) {
        details.push(`Significant overall dryness (${Math.round(rainfall)}mm rain) restricted berry size, increasing skin-to-juice ratio and tannic structure`);
    } else {
        details.push(`The vine cycle was balanced by timely rains totaling ${Math.round(rainfall)}mm, which refreshed the vines without causing dilution`);
    }

    // Frost Impact (The "Plot Twist")
    let frostText = "";
    if (lateFrostDays > 2) {
        frostText = ` Tragically, rare autumn frosts accelerated the harvest window and curtailed potential hang-time.`;
    } else if (earlyFrostDays > 3) {
        frostText = ` Early budding was met with severe spring frost (${earlyFrostDays} days), dramatically reducing crop levels but concentrating the remaining fruit.`;
    } else if (frostDays > 0) {
        frostText = ` Cooler nights (${frostDays} frost days) throughout the season helped retain fresh acidity despite the daytime warmth.`;
    }

    // 4. Assemble with varied conjunctions
    return `${selectedIntro}. ${details[0]}, and ${details[1].charAt(0).toLowerCase() + details[1].slice(1)}.${frostText}`;
}
