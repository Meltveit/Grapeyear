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
    // Start with Base 75 (Solid Start)
    let score = 75;

    // Linear Flowering Penalty
    // Rain > 30mm: -0.5 pts per mm approx.
    // Example: 195mm -> (195-30) * 0.1 = -16pts? Too harsh for "Coulure".
    // Let's enable a max penalty of 5 for rain, relying on linear logic.
    if (flowering.rainMm > 50) {
        // Soft penalty: 0.1 point per mm over 50. Max 5 pts.
        const pen = Math.min(5, (flowering.rainMm - 50) * 0.1);
        score -= pen;
    }
    // Flowering Temp Bonus (Ideal > 20C)
    if (flowering.avgTemp > 18) {
        score += Math.min(5, (flowering.avgTemp - 18) * 1);
    }

    // Spring Frost
    // -1 point per event. Max -5.
    const effectiveFrost = Math.min(5, season.frostEvents * 1);
    score -= effectiveFrost;


    // --- PHASE 1.5: STRUCTURE & CONCENTRATION (Annual Context) ---
    // Bonus for drier years (300-600mm)
    if (rainfall > 300 && rainfall < 650) {
        // Peak bonus at 450mm (+10). Tapers off.
        const dist = Math.abs(rainfall - 450); // 0 to 200
        const bonus = Math.max(0, 10 - (dist * 0.05)); // 10 minus penalty
        score += bonus;
    } else if (rainfall < 250) {
        // Severe Drought Penalty (< 250mm)
        // Example: 200mm -> (250-200) * 0.1 = -5 pts.
        score -= (250 - rainfall) * 0.1;
    }


    // --- PHASE 2: RIPENING POWER (GDD) ---
    // Linear Bonus starting at 1200 GDD.
    if (gdd > 1200) {
        let heatBonus = (gdd - 1200) / 30; // 30 GDD = 1 pt.

        // "Burnt Fruit" Check: Extreme heat (>2000) WITHOUT water (<300mm) is bad.
        // If >2000 GDD and <300mm rain, we reduce the bonus.
        if (gdd > 2000 && rainfall < 300) {
            heatBonus *= 0.5; // Halve the bonus (Stress)
            score -= 5;       // Extra penalty for shutdown
        }

        score += heatBonus;
    } else {
        // Penalty for cold
        score -= (1200 - gdd) / 20;
    }

    // Heat Spikes: -0.5 per day over 10.
    if (season.heatSpikes > 10) {
        score -= (season.heatSpikes - 10) * 0.5;
    }

    // Diurnal Shift: +1 pt per degree > 10.
    if (season.diurnalRange > 10) {
        score += (season.diurnalRange - 10) * 1.5;
    }

    // Sunshine: +1 pt per 50 hours > 1400.
    // Example 2022 (1369??) -> No bonus? Wait 1369 is low?
    // Let's set baseline at 1400 for Growing Season.
    if (sunshineHours > 1400) {
        score += (sunshineHours - 1400) / 100; // 1 pt per 100h.
    }


    // --- PHASE 3: HARVEST PENALTY (Critical) ---
    // Linear penalty starting at 30mm.
    // -0.4 pts per mm.
    // Example: 60mm -> 30 * 0.4 = 12 pts penalty.
    // Example: 182mm (2024) -> 152 * 0.4 = 60 pts!!! Too harsh.
    // Needs a cap or log scale.
    // Capped at -30 max.
    if (harvest.rainMm > 30) {
        let rainPen = (harvest.rainMm - 30) * 0.3;
        rainPen = Math.min(30, rainPen); // Max penalty 30
        score -= rainPen;
    }

    // Heatwave at harvest
    if (harvest.heatwaveDays > 0) {
        score -= harvest.heatwaveDays * 1;
    }


    // --- NORMALIZE & GRADE ---
    // Theoretical Max: 75 + 10(Conc) + 30(GDD) + 5(Sun) + 5(Diur) = 125.
    // Theoretical Min: 75 - 5 - 5 - 30(Rain) - 10(Cold) = 25.
    score = Math.min(100, Math.max(0, Math.round(score)));

    // Adjust Thresholds for "Commercial" feel (Parkerization)
    let quality: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging' | 'legendary' = 'average';
    if (score >= 95) quality = 'legendary';
    else if (score >= 90) quality = 'exceptional';
    else if (score >= 82) quality = 'excellent';   // Broaden Excellent range
    else if (score >= 75) quality = 'good';
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

    const flowering = storyMetrics?.flowering || { status: 'Average', rainMm: 0, avgTemp: 15 };
    const harvest = storyMetrics?.harvest || { conditions: 'Mixed', rainMm: metrics.harvestRainMm || 0, heatwaveDays: 0 };
    const season = storyMetrics?.growingSeason || { heatSpikes: metrics.heatSpikes || 0, frostEvents: frostDays, diurnalRange: 10, droughtStress: false };

    // --- NARRATIVE ENGINE ---
    // 1. Determine the "Arc" of the season
    // "Redemption": Bad Start -> Good End
    // "Heartbreak": Good Start -> Bad End
    // "Cruiser": Good Start -> Good End
    // "Playfight": Mixed -> Mixed
    // "Survival": Bad Start -> Bad End

    const startScore = (flowering.status === 'Excellent' ? 1 : 0) - (flowering.status === 'Poor' ? 1 : 0) - (season.frostEvents > 2 ? 1 : 0);
    const midScore = (gdd > 1400 ? 1 : 0) - (season.heatSpikes > 10 ? 1 : 0); // Simplified
    const endScore = (harvest.conditions === 'Dry' || harvest.rainMm < 30 ? 1 : 0) - (harvest.rainMm > 80 ? 1 : 0);

    let intro = "";
    if (startScore < 0 && midScore > 0 && endScore > 0) {
        intro = `The ${year} vintage in ${regionName} is the ultimate redemption story. After a chaotic start that threatened the crop, the season turned a corner to deliver a stunning finale.`;
    } else if (startScore >= 0 && endScore < 0) {
        intro = `For much of the season, ${year} looked destined for greatness in ${regionName}, until the elements conspired against it in the final weeks.`;
    } else if (startScore > 0 && midScore > 0 && endScore > 0) {
        intro = `Ideally sequenced and largely stress-free, ${year} goes down as a textbook vintage for ${regionName}.`;
    } else if (startScore < 0 && endScore < 0) {
        intro = `${year} was a test of resilience for the vignerons of ${regionName}, who fought against the elements from budbreak to harvest.`;
    } else {
        intro = `Defining the ${year} vintage in ${regionName} requires looking beyond the averages, as it was a year of contrasting fortunes and precise timing.`;
    }

    // --- CHAPTER 1: THE FOUNDATION ---
    let springText = "";
    if (flowering.status === 'Excellent') {
        springText = `The cycle began with a harmonious flowering period. Warm days (avg ${flowering.avgTemp}°C) allowed for an even fruit set, establishing the potential for a generous crop.`;
    } else if (flowering.status === 'Poor') {
        springText = `Early challenges emerged with a disrupted flowering phase. ${flowering.rainMm}mm of rain during the bloom caused significant *coulure* (shatter), naturally lowering yields and concentrating the energy into fewer bunches.`;
    } else {
        springText = `Spring was steady if unremarkable, with the vines navigating the vulnerable flowering stage without major incident.`;
    }

    if (season.frostEvents > 0) {
        springText += ` However, the threat of frost loom large, with ${season.frostEvents} distinct cold snaps keeping vineyard managers on high alert during budbreak.`;
    }

    // --- CHAPTER 2: THE RIPENING (Numbers Driven) ---
    let summerText = "";
    const isHot = gdd > 1700;
    const isCold = gdd < 1200;
    const isDry = rainfall < 400;

    if (season.heatSpikes > 10) {
        summerText = `Summer turned up the intensity. With ${season.heatSpikes} days soaring above 35°C, the vines faced a stress test.`;
        if (season.droughtStress) {
            summerText += ` Combined with a lack of rainfall (only ${rainfall}mm total), this led to hydric stress that halted ripening in younger vines, though old vines with deep roots persevered.`;
        } else {
            summerText += ` Yet, thanks to sufficient water reserves, the canopy remained green, protecting the clusters from sunburn.`;
        }
    } else if (isHot) {
        summerText = `The growing season was solar and generous. Accumulating ${gdd} Growing Degree Days (GDD), the summer provided consistent warmth that drove steady sugar accumulation.`;
    } else if (isCold) {
        summerText = `It was a cool, classical season. Reaching only ${gdd} GDD, the summer never really spiked in temperature, favoring the development of fresh aromatics over sheer power.`;
    } else {
        summerText = `Summer conditions were balanced, oscillating between warm spells and refreshing intervals that kept the ripening on a steady track.`;
    }

    // Diurnal Nuance
    if (season.diurnalRange > 12) {
        summerText += ` A key factor was the dramatic diurnal shift (${season.diurnalRange}°C), ensuring that despite the daytime warmth, acidities remained razor-sharp.`;
    }

    // --- CHAPTER 3: THE VERDICT (Harvest) ---
    let harvestText = "";
    if (harvest.rainMm < 20) {
        harvestText = `The season concluded with a pristine harvest window. With negligible rain (${harvest.rainMm}mm), pickers could wait for perfect phenolic maturity, harvesting each block at its absolute zenith.`;
    } else if (harvest.rainMm > 80) {
        harvestText = `The finale was fraught with tension. A deluge of ${harvest.rainMm}mm during the harvest period forced an expedited picking schedule to mitigate botrytis risks, rewarding those who sorted ruthlessly.`;
    } else {
        harvestText = `Harvest proceeded under mixed skies, requiring agility to dodge the ${harvest.rainMm}mm of rain that fell sporadically during the picking weeks.`;
    }

    // --- STYLE SUMMARY ---
    let style = "";
    if (gdd > 1800 && harvest.rainMm < 40) style = "Rich, opulent, and structured wines built for the long haul.";
    else if (gdd > 1800 && harvest.rainMm > 80) style = "Powerful but variable, with the best wines balancing the heat with careful selection.";
    else if (gdd < 1300 && harvest.rainMm < 40) style = "Elegant, transparent wines defined by finesse and vibrant acidity.";
    else if (harvest.rainMm > 100) style = "Lighter-bodied, early-drinking wines that prioritize charm over depth.";
    else style = "Classically proportioned wines with good balance and terroir expression.";

    return `${intro}\n\n${springText}\n\n${summerText}\n\n${harvestText}\n\n**Style:** ${style}`;
}
