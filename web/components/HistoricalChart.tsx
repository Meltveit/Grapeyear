'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface HistoricalChartProps {
    currentYear: number;
    currentMetrics: {
        gdd: number;
    };
    // In a real app, we'd pass historical data series here
    // For MVP, passing a mock trend or single comparison point could work, 
    // but let's simulate a trend around the current value
}

// Mock data generator for visual effect in MVP if no real historical series passed yet
function generateMockData(year: number, currentGdd: number) {
    const data = [];
    for (let i = year - 9; i <= year; i++) {
        // Generate some random fluctuation around currentGdd
        const noise = (Math.random() - 0.5) * 200;
        let gdd = currentGdd + noise;

        // Trend warmer?
        gdd = gdd - ((year - i) * 10);

        data.push({
            year: i,
            gdd: Math.round(gdd),
            avg: 1350 // Mock 10-year average line
        });
    }
    return data;
}

export default function HistoricalChart({ currentYear, currentMetrics }: HistoricalChartProps) {
    const data = generateMockData(currentYear, currentMetrics.gdd);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-playfair font-bold text-white mb-6">Historical Context (10 Years)</h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            axisLine={false}
                            tickLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="gdd"
                            name="Growing Degree Days"
                            stroke="#a855f7"
                            strokeWidth={3}
                            dot={{ fill: '#a855f7', strokeWidth: 0 }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="avg"
                            name="Historical Average"
                            stroke="#4b5563"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
                Comparison of {currentYear} growing season heat accumulation vs regional average.
            </p>
        </div>
    );
}
