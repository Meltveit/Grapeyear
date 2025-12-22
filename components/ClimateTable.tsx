import { CloudRain, Sun, Thermometer, Info } from 'lucide-react';

interface MetricProps {
    label: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    description: string;
}

function MetricRow({ label, value, unit, icon, description }: MetricProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-purple-400 transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="font-medium text-gray-200">{label}</h4>
                    <p className="text-xs text-gray-500 hidden sm:block">{description}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-bold font-mono text-white">
                    {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
                </div>
            </div>
        </div>
    );
}

interface ClimateTableProps {
    metrics: {
        gdd: number;
        rainfall: number;
        diurnal: number;
        avgTemp: number;
    };
}

export default function ClimateTable({ metrics }: ClimateTableProps) {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-black/20">
                <h3 className="text-lg font-playfair font-bold text-white">Climatic Blueprint</h3>
            </div>

            <div className="flex flex-col">
                <MetricRow
                    label="Growing Degree Days (GDD)"
                    value={metrics.gdd}
                    unit=""
                    icon={<Sun className="w-5 h-5" />}
                    description="Heat accumulation for ripening (Base 10°C)."
                />
                <MetricRow
                    label="Total Rainfall"
                    value={metrics.rainfall}
                    unit="mm"
                    icon={<CloudRain className="w-5 h-5" />}
                    description="Precipitation during the growing season."
                />
                <MetricRow
                    label="Diurnal Shift"
                    value={metrics.diurnal}
                    unit="°C"
                    icon={<Thermometer className="w-5 h-5" />}
                    description="Avg difference between day & night temps."
                />
                <MetricRow
                    label="Average Temperature"
                    value={metrics.avgTemp}
                    unit="°C"
                    icon={<Thermometer className="w-5 h-5" />}
                    description="Mean temperature across the season."
                />
            </div>
        </div>
    );
}
