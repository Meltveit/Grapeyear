import { ArrowRight, Trophy } from 'lucide-react';

interface MetricComparisonProps {
    label: string;
    unit: string;
    v1Value: number;
    v2Value: number;
    description: string;
    lowerIsBetter?: boolean; // For rain? context dependent.
    highlightWinner?: boolean;
}

function ComparisonRow({ label, unit, v1Value, v2Value, description, highlightWinner = true }: MetricComparisonProps) {
    const diff = v1Value - v2Value;
    const v1Higher = v1Value > v2Value;

    // Simple visual highlight logic (opinionated)
    // Darker bg for "winner" if desired? Or just bold.
    const v1Class = v1Higher && highlightWinner ? "text-green-400 font-bold" : "text-white";
    const v2Class = !v1Higher && diff !== 0 && highlightWinner ? "text-green-400 font-bold" : "text-white";

    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 py-4 border-b border-white/10 items-center">
            {/* V1 Value */}
            <div className={`text-right font-mono text-lg md:text-xl ${v1Class}`}>
                {v1Value} <span className="text-xs text-gray-500">{unit}</span>
            </div>

            {/* Label (Center) */}
            <div className="col-span-1 md:col-span-3 text-center px-2">
                <span className="block font-bold text-white text-sm md:text-base">{label}</span>
                <span className="hidden md:block text-xs text-gray-500">{description}</span>
            </div>

            {/* V2 Value */}
            <div className={`text-left font-mono text-lg md:text-xl ${v2Class}`}>
                {v2Value} <span className="text-xs text-gray-500">{unit}</span>
            </div>
        </div>
    );
}

interface ComparisonTableProps {
    v1: any;
    v2: any;
    r1Name: string; // Region 1 Name
    r2Name: string; // Region 2 Name
}

export default function ComparisonTable({ v1, v2, r1Name, r2Name }: ComparisonTableProps) {
    // Helper to get flat metric
    const getM = (v: any, key: string, legacyKey: string) => {
        return v[key] ?? v.metrics?.[legacyKey] ?? 0;
    };

    const metrics = [
        { label: "Grapeyear Score", key: "score", leg: "grapeyearScore", unit: "pts", desc: "Overall quality assessment" },
        { label: "GDD", key: "gdd", leg: "growingDegreeDays", unit: "", desc: "Growing Degree Days (Heat Accumulation)" },
        { label: "Total Rainfall", key: "rainfall", leg: "totalRainfallMm", unit: "mm", desc: "Total precipitation during growing season" },
        { label: "Avg Temp", key: "avgTemperature", leg: "avgTemperature", unit: "°C", desc: "Mean temperature across the season" },
        { label: "Diurnal Range", key: "diurnalShiftAvg", leg: "diurnalShiftAvg", unit: "°C", desc: "Difference between day/night temps" },
        { label: "Frost Days", key: "frostDays", leg: "frostDays", unit: "days", desc: "Days below 0°C during cycle" },
        { label: "Sunshine", key: "sunshineHours", leg: "sunshineHours", unit: "hrs", desc: "Total sunshine duration" },
    ];

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 md:grid-cols-5 bg-black/40 border-b border-white/10 p-4 font-bold text-gray-400 uppercase tracking-widest text-xs">
                <div className="text-right">{v1.year}</div>
                <div className="col-span-1 md:col-span-3 text-center text-white">Metrics</div>
                <div className="text-left">{v2.year}</div>
            </div>

            {/* Rows */}
            <div className="flex flex-col">
                {metrics.map(m => (
                    <ComparisonRow
                        key={m.label}
                        label={m.label}
                        unit={m.unit}
                        description={m.desc}
                        v1Value={getM(v1, m.key, m.leg)}
                        v2Value={getM(v2, m.key, m.leg)}
                        // Logic for highlighting higher score? 
                        // Usually Score, GDD, Sunshine -> Higher is "More" (not necessarily better, but highlighted)
                        highlightWinner={m.key !== 'frostDays' && m.key !== 'rainfall'}
                    />
                ))}
            </div>

            {/* Narrative Summary Delta */}
            <div className="p-6 bg-black/20 border-t border-white/10">
                <h4 className="text-center font-bold text-white mb-4">The Verdict</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
                    <div>
                        <strong className="text-purple-400 block mb-2">{r1Name} {v1.year}</strong>
                        {v1.vintageSummary || v1.aiSummary || "No summary available."}
                    </div>
                    <div>
                        <strong className="text-purple-400 block mb-2">{r2Name} {v2.year}</strong>
                        {v2.vintageSummary || v2.aiSummary || "No summary available."}
                    </div>
                </div>
            </div>
        </div>
    );
}
