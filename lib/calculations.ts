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
export function calculateGrapeyearScore(metrics: AdvancedVintageMetrics): { score: number; quality: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging' | 'legendary' } {
    const {
        gdd, rainfall, // Annual / Season totals
        sunshineHours, frostDays,
        storyMetrics // Granular Phase Data
    } = metrics;

    // Use Fallback if storyMetrics missing (Legacy safety)
    const flowering = storyMetrics?.flowering || { status: 'Average', rainMm: 50, avgTemp: 15 };
    const harvest = storyMetrics?.harvest || { conditions: 'Mixed', rainMm: 40, heatwaveDays: 0 };
    const season = storyMetrics?.growingSeason || { heatSpikes: 0, frostEvents: frostDays, diurnalRange: 10, droughtStress: false };

    // --- PHASE 1: THE FOUNDATION (Spring & Flowering) ---
    // Start with Base 50
    let score = 50;

    // Flowering Quality (Set the potential yield/uniformity)
    // Rain < 20mm and Temp > 18C is ideal.
    // Rain > 70mm or Temp < 15C causes Coulure (Penalty).
    if (flowering.rainMm < 25 && flowering.avgTemp > 18) {
        score += 10; // Perfect Set
    } else if (flowering.rainMm > 80 || flowering.avgTemp < 14) {
        score -= 10; // Poor Set (Coulure)
    } else if (flowering.rainMm > 50) {
        score -= 5;
    }

    // Spring Frost Penalty (User Requested: -2 pts per day)
    // Cap at -15 to prevent total destruction from one bad week if the rest of year is good.
    const effectiveFrost = Math.min(15, season.frostEvents * 2);
    score -= effectiveFrost;


    // --- PHASE 2: RIPENING (The Engine) ---
    // GDD (Heat Sum)
    if (gdd > 1600) score += 20; // Powerful
    else if (gdd > 1400) score += 15; // Ripe
    else if (gdd > 1250) score += 5; // Balanced
    else if (gdd < 1000) score -= 15; // Unripe
    else if (gdd < 1150) score -= 5;

    // Heat Spikes (>35C)
    // A few days are manageable, but > 10 is stress (blocked ripening).
    if (season.heatSpikes > 10) score -= 5;

    // Diurnal Shift (Acidity / Complexity)
    if (season.diurnalRange > 13) score += 10;
    else if (season.diurnalRange > 10) score += 5;
    else if (season.diurnalRange < 7) score -= 5; // Flabby

    // Sunshine Bonus (If data exists)
    // Pre-2005 fallback is usually handled by ingestion/defaults, but check range.
    if (sunshineHours > 2200) score += 5;


    // --- PHASE 3: HARVEST (The Verdict) ---
    // Rain at harvest is the biggest vintage killer (Rot/Dilution).
    // < 15mm: Dry/Perfect (+15)
    // 15-40mm: Manageable (+5)
    // 40-80mm: Risky (-10)
    // > 80mm: Bad (-20)
    if (harvest.rainMm < 15) score += 15;
    else if (harvest.rainMm < 40) score += 5;
    else if (harvest.rainMm > 100) score -= 20;
    else if (harvest.rainMm > 60) score -= 10;

    // Harvest Heatwaves (Stewed fruit risk)
    if (harvest.heatwaveDays > 3) score -= 5;


    // --- NORMALIZE & GRADE ---
    score = Math.min(100, Math.max(0, Math.round(score)));

    let quality: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging' | 'legendary' = 'average';
    if (score >= 96) quality = 'legendary';       // 96+ (Rare perfection)
    else if (score >= 90) quality = 'exceptional'; // 90-95 (Outstanding)
    else if (score >= 80) quality = 'excellent';   // 80-89 (Great)
    else if (score >= 70) quality = 'good';        // 70-79 (Solid)
    else if (score >= 50) quality = 'average';     // 50-69 (Drinkable)
    else quality = 'challenging';                  // < 50 (Difficult)

    return { score, quality };
}

/**
 * Generate AI Summary based on metrics
 */
// New Interface matching the DB schema
export interface AdvancedVintageMetrics {
    gdd: number;
    rainfall: number;
    sunshineHours: number;
    frostDays: number;
    regionName: string;
    year: number;
    storyMetrics?: {
        flowering: { status: string; rainMm: number; avgTemp: number };
        harvest: { conditions: string; rainMm: number; heatwaveDays: number };
        growingSeason: { heatSpikes: number; frostEvents: number; diurnalRange: number; droughtStress: boolean };
    };
    // Legacy support (optional)
    heatSpikes?: number;
    harvestRainMm?: number;
    earlyFrostDays?: number;
    lateFrostDays?: number;
    droughtStressMaxDays?: number;
}

export function generateVintageSummary(metrics: AdvancedVintageMetrics): string {
    const {
        gdd, rainfall, sunshineHours, frostDays, regionName, year,
        storyMetrics
    } = metrics;

    // Use storyMetrics if available (New Path), otherwise fallback to legacy approximation
    const flowering = storyMetrics?.flowering || { status: 'Average', rainMm: 0, avgTemp: 15 };
    const harvest = storyMetrics?.harvest || { conditions: 'Mixed', rainMm: metrics.harvestRainMm || 0, heatwaveDays: 0 };
    const season = storyMetrics?.growingSeason || { heatSpikes: metrics.heatSpikes || 0, frostEvents: frostDays, diurnalRange: 10, droughtStress: false };

    // --- CHAPTER 1: THE OPENING (Flowering & Spring) ---
    let chap1 = "";
    if (flowering.status === 'Excellent') {
        chap1 = `The ${year} season in ${regionName} began with a textbook flowering period. Conditions were ideal, with steady temperatures averaging ${flowering.avgTemp}°C and minimal interruption from rain, setting the stage for a homogenous crop.`;
    } else if (flowering.status === 'Poor') {
        chap1 = `The vintage faced immediate hurdles. A difficult, uneven flowering period—marred by ${flowering.rainMm}mm of rail during the critical window—significantly reduced potential yields from the outset ("Coulure").`;
    } else {
        chap1 = `Spring in ${regionName} was generally uneventful, with a reliable flowering phase despite some cooler variances.`;
    }

    // Add Frost context if relevant (Spring Frost)
    if (season.frostEvents > 2) {
        chap1 += ` However, early optimism was dampened by severe spring frosts (${season.frostEvents} events), which naturally curbed production volumes but often leads to greater concentration in the surviving fruit.`;
    }

    // --- CHAPTER 2: THE GROWING SEASON (Summer) ---
    let chap2 = "";
    const isHot = gdd > 1600;

    if (season.heatSpikes > 5) {
        chap2 = `Summer brought intensity. The region endured ${season.heatSpikes} days of extreme heat (over 35°C), testing the vines' resilience.`;
        if (season.droughtStress) {
            chap2 += ` Combined with significant drought stress, this shut down the vines intermittently, preserving acidity but delaying sugar accumulation.`;
        } else {
            chap2 += ` Fortunately, water reserves were sufficient to carry the crop through these heatwaves without severe blockages.`;
        }
    } else if (isHot) {
        chap2 = `The summer months were marked by generous, consistent warmth, allowing for a steady and even veraison.`;
    } else {
        chap2 = `The growing season remained cool and protracted. Without the pressure of heat spikes, the grapes ripened slowly, building aromatic complexity rather than sheer sugar weight.`;
    }

    // Diurnal Shift (The Night-Time Factor)
    if (season.diurnalRange > 13) {
        chap2 += ` Crucially, a remarkable diurnal shift of ${season.diurnalRange}°C provided cool nights that locked in freshness, balancing the daytime maturity.`;
    } else if (season.diurnalRange < 9) {
        chap2 += ` Warm nights (low diurnal range of ${season.diurnalRange}°C) meant that acidity degradation was a concern, leading to a softer, more approachable profile early on.`;
    }

    // --- CHAPTER 3: THE FINALE (Harvest) ---
    let chap3 = "";
    if (harvest.conditions === 'Perfect' || (harvest.rainMm < 30 && harvest.heatwaveDays === 0)) {
        chap3 = `The endgame was serene. A dry, temperate harvest window (${harvest.rainMm}mm rain) allowed vignerons to pick at their absolute leisure, waiting for optimal phenolic maturity.`;
    } else if (harvest.conditions === 'Wet' || harvest.rainMm > 80) {
        chap3 = `The finale was a race against time. Heavy rains totaling ${harvest.rainMm}mm during the harvest weeks forced difficult decisions: pick early to avoid rot, or gamble on a return to sunshine. Strict sorting tables were the heroes of this vintage.`;
    } else if (harvest.heatwaveDays > 2) {
        chap3 = `An unusual late-season heatwave accelerated the picking window, compressing the harvest into a few frantic days to avoid over-ripe, jammy flavors.`;
    } else {
        chap3 = `Harvest proceeded under mixed conditions, requiring agility from the vineyard teams to capture the fruit between passing showers.`;
    }

    // --- VERDICT (Style Summary) ---
    let verdict = "";
    if (gdd > 1700) verdict = "A solar, hedonistic vintage driven by power and fruit weight.";
    else if (gdd < 1300) verdict = "A 'Classic' cool-climate year defined by elegance, acidity, and structure.";
    else verdict = "A balanced, dependable vintage that offers the best of both worlds.";

    // Formatting: Return as paragraphs joined by double newline
    return `${chap1}\n\n${chap2}\n\n${chap3}\n\n**Verdict:** ${verdict}`;
}
