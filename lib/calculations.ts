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
}): { score: number; quality: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging' | 'legendary' } {
    const { gdd, rainfall, diurnal, sunshineHours = 1500, frostDays = 0 } = metrics;

    // Start with a decent baseline (70 = Good/Average)
    let score = 70;

    // 1. Growing Degree Days (Heat) - The Engine
    if (gdd > 1600) score += 15;      // Hot/Powerful
    else if (gdd > 1400) score += 10; // Warm/Ripe
    else if (gdd < 1000) score -= 15; // Too Cool/Unripe
    else if (gdd < 1200) score -= 5;  // Cool

    // 2. Rainfall - Key Risk Factor
    // 600-800mm is often ideal for dry farming. > 800 can be disease pressure.
    if (rainfall > 1200) score -= 20;      // Very Wet (Dilution/Rot)
    else if (rainfall > 900) score -= 10;  // Wet
    else if (rainfall < 300) score -= 10;  // Drought Stress
    else if (rainfall < 500) score -= 5;   // Dry

    // 3. Diurnal Shift - The Acid/Aroma Preserver
    if (diurnal > 15) score += 5; // Excellent
    else if (diurnal < 6) score -= 5; // Flat/Flabby risk

    // 4. Frost - The Killer (Capped penalty)
    // Frost kills yield, but survivors often concentrate. Don't destroy score solely on frost.
    const frostPenalty = Math.min(20, frostDays * 2);
    score -= frostPenalty;

    // 5. Sunshine Bonus
    if (sunshineHours > 2200) score += 5;

    // Normalize
    score = Math.min(100, Math.max(0, Math.round(score)));

    // Quality label logic remains...
    let quality: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging' | 'legendary' = 'average';
    if (score >= 95) quality = 'legendary';
    else if (score >= 90) quality = 'exceptional';
    else if (score >= 80) quality = 'excellent';
    else if (score >= 70) quality = 'good';
    else if (score >= 60) quality = 'average';
    else quality = 'challenging';

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
