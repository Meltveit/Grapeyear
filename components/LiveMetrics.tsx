'use client';

import { useEffect, useState } from 'react';
import { TOP_REGIONS } from '@/lib/constants';
import { Cloud, Sun, CloudRain, Thermometer, Moon } from 'lucide-react';

interface WeatherData {
    region: string;
    temp: number;
    isDay: number; // 1 = day, 0 = night
    code: number;
}

export default function LiveMetrics() {
    const [metrics, setMetrics] = useState<WeatherData[]>([]);

    useEffect(() => {
        // Select top 5 regions to show
        const regions = TOP_REGIONS.slice(0, 5);

        const fetchWeather = async () => {
            const promises = regions.map(async (region) => {
                try {
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${region.coordinates[1]}&longitude=${region.coordinates[0]}&current=temperature_2m,is_day,weather_code&timezone=auto`
                    );
                    const data = await res.json();
                    return {
                        region: region.name,
                        temp: data.current.temperature_2m,
                        isDay: data.current.is_day,
                        code: data.current.weather_code
                    };
                } catch (e) {
                    return null;
                }
            });

            const results = await Promise.all(promises);
            setMetrics(results.filter(r => r !== null) as WeatherData[]);
        };

        fetchWeather();
        // Refresh every 5 mins
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, []);

    if (metrics.length === 0) return null;

    return (
        <div className="absolute top-4 right-4 z-50 hidden lg:block">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5 space-y-3 shadow-lg">
                <h3 className="text-xs uppercase tracking-widest text-green-400 mb-2 border-b border-white/5 pb-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live
                </h3>
                {metrics.map((m) => (
                    <div key={m.region} className="flex items-center justify-between gap-6 text-sm">
                        <span className="text-gray-300 font-medium">{m.region}</span>
                        <div className="flex items-center gap-3 text-white font-mono">
                            {/* Weather Icon based on code & time */}
                            {m.code >= 51 ? (
                                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                            ) : m.isDay ? (
                                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                            ) : (
                                <Moon className="w-3.5 h-3.5 text-gray-400" />
                            )}

                            <span>{Math.round(m.temp)}°C</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
