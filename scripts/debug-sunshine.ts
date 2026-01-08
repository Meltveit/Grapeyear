
import { fetchWeatherData } from '../lib/ingest';

async function test() {
    console.log("Fetching Bordeaux 2022...");
    // Bordeaux Coords: 44.8378, -0.5792
    // Year 2022
    // Northern Hemisphere: true
    try {
        const data = await fetchWeatherData(44.8378, -0.5792, 2022, true);

        const daily = data.daily;
        if (!daily) {
            console.error("No daily data found");
            return;
        }

        console.log("Keys in daily:", Object.keys(daily));

        if (daily.sunshine_duration) {
            console.log("Sunshine Duration found! First 5 values:", daily.sunshine_duration.slice(0, 5));
            const totalSeconds = daily.sunshine_duration.reduce((a: any, b: any) => (a || 0) + (b || 0), 0);
            console.log("Total Sunshine (Adjusted, Seconds):", totalSeconds);
            console.log("Total Sunshine (Hours):", totalSeconds / 3600);
        } else {
            console.error("sunshine_duration KEY MISSING in API response!");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
