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
 * This is a simplified proprietary algorithm
 */
export function calculateGrapeyearScore(metrics: {
    gdd: number;
    rainfall: number;
    diurnal: number;
}): { score: number; quality: string } {
    const { gdd, rainfall, diurnal } = metrics;

    let score = 50; // Base score

    // GDD Scoring (Ideal range depends on region, but let's assume general optimal 1200-1600 for high quality reds)
    if (gdd > 1200 && gdd < 1800) score += 20;
    else if (gdd >= 1000 && gdd <= 1200) score += 10;
    else if (gdd >= 1800) score += 10; // Hot vintage

    // Rainfall Scoring (Too much is bad, too little is drought)
    // Assume generic 'growing season' rainfall ~200-500mm is decent
    if (rainfall > 200 && rainfall < 500) score += 15;
    else if (rainfall <= 200) score += 5; // Stress
    else if (rainfall >= 500) score -= 10; // Rot risk?

    // Diurnal Shift Scoring (High shift is good for acid retention)
    if (diurnal > 15) score += 15;
    else if (diurnal > 10) score += 10;
    else score += 0;

    // Cap score
    score = Math.min(100, Math.max(0, score));

    // Quality label
    let quality = 'average';
    if (score >= 90) quality = 'exceptional';
    else if (score >= 80) quality = 'excellent';
    else if (score >= 70) quality = 'good';
    else if (score < 50) quality = 'challenging';

    return { score: Math.round(score), quality };
}
