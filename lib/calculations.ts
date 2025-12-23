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
}): string {
    const { gdd, rainfall, sunshineHours, frostDays, regionName } = metrics;
    const parts: string[] = [];

    // Temperature / GDD context
    if (gdd > 1800) parts.push("A warm vintage defined by generous heat accumulation");
    else if (gdd < 1200) parts.push("A cool growing season requiring patience");
    else parts.push("A classically balanced season with steady ripening");

    // Sun / Water context
    if (sunshineHours > 1800 && rainfall < 300) {
        parts.push("abundant sunshine combined with dry conditions, leading to small, concentrated berries with rich flavor profiles");
    } else if (rainfall > 600) {
        parts.push("intermittent rainfall which restored water tables but required vigilant canopy management to prevent disease");
    } else {
        parts.push(`balanced by ${Math.round(rainfall)}mm of rainfall, allowing for gradual phenolic development`);
    }

    // Frost context
    if (frostDays > 2) {
        parts.push(`however, difficult spring frost events (${frostDays} days) reduced yields significantly`);
    }

    // Join with simple grammar logic
    let summary = parts.join(', ');
    // capitalize first letter
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);

    return `${summary} in ${regionName}.`;
}
