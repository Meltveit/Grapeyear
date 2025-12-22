'use client';

interface GrapeyearScoreProps {
    score: number;
    quality?: string;
}

export default function GrapeyearScore({ score, quality }: GrapeyearScoreProps) {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s >= 90) return 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/20'; // Exceptional
        if (s >= 80) return 'text-green-400 border-green-500/50 shadow-green-500/20'; // Excellent
        if (s >= 70) return 'text-yellow-400 border-yellow-500/50 shadow-yellow-500/20'; // Good
        if (s >= 50) return 'text-orange-400 border-orange-500/50 shadow-orange-500/20'; // Average
        return 'text-red-400 border-red-500/50 shadow-red-500/20'; // Challenging
    };

    const colorClass = getColor(score);

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-[0_0_50px_-5px_rgba(0,0,0,0.3)] ${colorClass}`}
            >
                <div className="text-center">
                    <span className="block text-6xl font-bold font-playfair">{score}</span>
                    <span className="block text-sm uppercase tracking-widest mt-1 opacity-80 font-light">Grapeyear</span>
                </div>
            </div>
            {quality && (
                <div className="mt-6 px-4 py-1 rounded-full border border-white/10 bg-white/5 uppercase tracking-[0.2em] text-sm text-gray-300">
                    {quality} Configuration
                </div>
            )}
        </div>
    );
}
