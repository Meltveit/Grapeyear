import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Region from '../lib/models/Region';
import Vintage from '../lib/models/Vintage';
import { TOP_REGIONS, YEARS_TO_FETCH } from '../lib/constants';
import { calculateGDD, calculateDiurnalShift, calculateGrapeyearScore } from '../lib/calculations';

// Mocking the DB connect for script usage if different from lib
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDb() {
    if (mongoose.connection.readyState >= 1) return;
    if (!MONGODB_URI) throw new Error('MONGODB_URI is required');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
}

async function fetchWeatherData(lat: number, lon: number, year: number, isSouthernHemisphere: boolean) {
    // Define growing season
    // North: Apr 1 - Oct 31 of current year
    // South: Oct 1 (Prev Year) - Apr 30 (Current Year)

    let startDate = `${year}-04-01`;
    let endDate = `${year}-10-31`;

    if (isSouthernHemisphere) {
        const prevYear = year - 1;
        startDate = `${prevYear}-10-01`;
        endDate = `${year}-04-30`;
    }

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch weather data: ${res.statusText}`);
    return res.json();
}

async function seed() {
    await connectToDb();

    for (const regionData of TOP_REGIONS) {
        console.log(`Processing region: ${regionData.name}`);

        // Upsert Region
        let region = await Region.findOne({ slug: regionData.slug });
        if (!region) {
            region = await Region.create({
                ...regionData,
                location: { type: 'Point', coordinates: regionData.coordinates }
            });
            console.log(`Created region: ${region.name}`);
        }

        const isSouthern = regionData.coordinates[1] < 0;

        for (const year of YEARS_TO_FETCH) {
            // Always fetch and update to ensure latest algorithm/metrics
            console.log(`Updating data for ${region.name} ${year}...`);

            // Artificial delay to be nice to the API
            await new Promise(r => setTimeout(r, 500));

            try {
                const weatherData = await fetchWeatherData(regionData.coordinates[1], regionData.coordinates[0], year, isSouthern);

                const daily = weatherData.daily;
                const processedDaily = daily.time.map((date: string, i: number) => ({
                    date,
                    maxTemp: daily.temperature_2m_max[i],
                    minTemp: daily.temperature_2m_min[i],
                    precipitation: daily.precipitation_sum[i],
                    sunshine: daily.sunshine_duration[i] // Fetch sunshine (s)
                }));

                // Calculate metrics
                const gdd = calculateGDD(processedDaily);
                const diurnal = calculateDiurnalShift(processedDaily);
                const totalRain = processedDaily.reduce((acc: number, d: any) => acc + (d.precipitation || 0), 0);
                const avgTemp = processedDaily.reduce((acc: number, d: any) => acc + ((d.maxTemp + d.minTemp) / 2), 0) / processedDaily.length;

                // Sunshine in hours (API returns seconds)
                const sunshineHours = processedDaily.reduce((acc: number, d: any) => acc + (d.sunshine || 0), 0) / 3600;

                // Count frost days (min temp < 0)
                const frostDays = processedDaily.filter((d: any) => d.minTemp < 0).length;

                const { score, quality } = calculateGrapeyearScore({ gdd, rainfall: totalRain, diurnal, sunshineHours, frostDays });

                await Vintage.findOneAndUpdate(
                    { regionId: region._id, year },
                    {
                        regionId: region._id,
                        year,
                        grapeyearScore: score,
                        metrics: {
                            growingDegreeDays: Math.round(gdd),
                            totalRainfallMm: Math.round(totalRain * 10) / 10,
                            diurnalShiftAvg: Math.round(diurnal * 10) / 10,
                            avgTemperature: Math.round(avgTemp * 10) / 10,
                            sunshineHours: Math.round(sunshineHours),
                            frostDays: frostDays
                        },
                        quality,
                        aiSummary: `Vintage ${year} in ${region.name}: ${quality}. GDD: ${Math.round(gdd)}, Rain: ${Math.round(totalRain)}mm, Sun: ${Math.round(sunshineHours)}h, Frost Days: ${frostDays}.`,
                        uniqueComposite: `${region._id}_${year}`
                    },
                    { upsert: true, new: true }
                );

                console.log(`Updated vintage ${year} for ${region.name} (Score: ${score})`);

            } catch (err) {
                console.error(`Error processing ${region.name} ${year}:`, err);
            }
        }
    }

    console.log('Seeding complete');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
