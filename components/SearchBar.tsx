'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { TOP_REGIONS } from '@/lib/constants';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<typeof TOP_REGIONS>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Click outside to close
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setShowSuggestions(true);

        const parts = val.trim().split(' ');
        const yearStr = parts.find(p => /^\d{4}$/.test(p));
        const searchTerm = parts.filter(p => p !== yearStr).join(' ').toLowerCase();

        if (searchTerm.length > 0) {
            const matches = TOP_REGIONS.filter(r =>
                r.name.toLowerCase().includes(searchTerm) ||
                r.slug.includes(searchTerm) ||
                r.country.toLowerCase().includes(searchTerm)
            ).slice(0, 6);
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        // Same logic as before if direct enter
        const parts = query.trim().split(' ');
        const yearStr = parts.find(p => /^\d{4}$/.test(p));
        const year = yearStr ? parseInt(yearStr) : new Date().getFullYear() - 1;
        const regionNamePart = parts.filter(p => p !== yearStr).join(' ').toLowerCase();

        const matchedRegion = TOP_REGIONS.find(r =>
            r.name.toLowerCase().includes(regionNamePart) ||
            r.slug.includes(regionNamePart)
        );

        if (matchedRegion) {
            goToRegion(matchedRegion, year);
        } else {
            alert(`Could not find region matching "${regionNamePart}". Try "Bordeaux 2015"`);
        }
    };

    const goToRegion = (region: typeof TOP_REGIONS[0], year?: number) => {
        // Determine year from query if not passed
        if (!year) {
            const parts = query.trim().split(' ');
            const yearStr = parts.find(p => /^\d{4}$/.test(p));
            year = yearStr ? parseInt(yearStr) : new Date().getFullYear() - 1;
        }
        setShowSuggestions(false);
        router.push(`/vintages/${region.countryCode.toLowerCase()}/${region.slug}/${year}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInput}
                    onFocus={() => { if (query) setShowSuggestions(true); }}
                    placeholder="Try 'Bordeaux 2015' or 'Tuscany'..."
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-xl"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                >
                    Explore
                </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="py-2">
                        <div className="px-4 py-2 text-xs uppercase tracking-widest text-gray-500 font-semibold">Suggested Regions</div>
                        {suggestions.map((region) => (
                            <div
                                key={region.slug}
                                onClick={() => {
                                    setQuery(region.name + ' '); // Update input
                                    goToRegion(region);
                                }}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-lg bg-gray-800 bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: region.imageUrl ? `url(${region.imageUrl})` : undefined }}
                                >
                                    {!region.imageUrl && <MapPin className="h-5 w-5 text-gray-500 m-auto mt-2.5" />}
                                </div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-purple-300 transition-colors">{region.name}</div>
                                    <div className="text-xs text-gray-400">{region.country}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
