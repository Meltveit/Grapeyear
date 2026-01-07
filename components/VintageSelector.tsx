'use client';
import { useState, useEffect } from 'react'; // React 19 hooks? standard hooks. 
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';

// We assume we fetch regions client side or pass them in?
// Let's pass a list of simple regions { name, slug } as props to keep it simple
// Or fetch from an API endpoint `/api/regions` for search.

export default function VintageSelector({ side, regions }: { side: 'v1' | 'v2', regions: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedYear, setSelectedYear] = useState('2023');

    // Parse initial URL params
    useEffect(() => {
        const currentRef = searchParams.get(side); // e.g. "bordeaux:2015"
        if (currentRef) {
            const [r, y] = currentRef.split(':');
            setSelectedRegion(r);
            setSelectedYear(y || '2023');
        }
    }, [searchParams, side]);

    const handleUpdate = (r: string, y: string) => {
        setSelectedRegion(r);
        setSelectedYear(y);

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (r) {
            params.set(side, `${r}:${y}`);
        } else {
            params.delete(side);
        }
        router.push(`/compare?${params.toString()}`);
    };

    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Vintage {side === 'v1' ? 'A' : 'B'}</h3>

            <div className="space-y-4">
                {/* Region Select */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Region</label>
                    <div className="relative">
                        <select
                            value={selectedRegion}
                            onChange={(e) => handleUpdate(e.target.value, selectedYear)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white appearance-none focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                        >
                            <option value="">Select Region</option>
                            {regions.map(r => (
                                <option key={r.slug} value={r.slug}>{r.name} ({r.country})</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Year Select (1980 - 2025) */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Year</label>
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => handleUpdate(selectedRegion, e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white appearance-none focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                        >
                            {Array.from({ length: 45 }, (_, i) => 2024 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
