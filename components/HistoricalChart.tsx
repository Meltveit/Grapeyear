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

interface HistoricalDataPoint {
    year: number;
    gdd: number;
    score: number;
}

interface HistoricalChartProps {
    currentYear: number;
    data: HistoricalDataPoint[];
}

export default function HistoricalChart({ currentYear, data }: HistoricalChartProps) {
    // Calculate a simple average GDD for the reference line
    const avgGdd = data.length > 0
        ? Math.round(data.reduce((acc, curr) => acc + curr.gdd, 0) / data.length)
        : 1350;

    const chartData = data.map(d => ({
        ...d,
        avg: avgGdd
    })).sort((a, b) => a.year - b.year);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-playfair font-bold text-white mb-6">Historical Context ({data.length} Years)</h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                Comparison of growing season heat accumulation vs regional average.
            </p>
        </div>
    );
}
