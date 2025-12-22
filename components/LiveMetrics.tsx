'use client';

import { useEffect, useState } from 'react';
import { TOP_REGIONS } from '@/lib/constants';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

interface WeatherData {
    region: string;
    temp: number;
    condition: string;
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
                        `https://api.open-meteo.com/v1/forecast?latitude=${region.coordinates[1]}&longitude=${region.coordinates[0]}&current=temperature_2m,weather_code`
                    );
                    const data = await res.json();
                    return {
                        region: region.name,
                        temp: data.current.temperature_2m,
                        condition: 'Sunny', // keeping simple, would map WMO codes
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

    if (metrics.length === 0) return null; // Loading state handled by skeleton or hidden

    return (
        <div className="absolute top-4 right-4 z-50 hidden lg:block">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5 space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 border-b border-white/5 pb-2">Live Examples</h3>
                {metrics.map((m) => (
                    <div key={m.region} className="flex items-center justify-between gap-6 text-sm">
                        <span className="text-gray-300 font-medium">{m.region}</span>
                        <div className="flex items-center gap-2 text-white font-mono">
                            <Thermometer className="w-3 h-3 text-purple-400" />
                            {Math.round(m.temp)}°C
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
