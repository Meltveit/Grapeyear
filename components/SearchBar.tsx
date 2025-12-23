'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Wine, Globe } from 'lucide-react';
import { TOP_REGIONS } from '@/lib/constants';
import { GRAPE_VARIETIES } from '@/lib/grapes';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
            // 1. Region Matches
            const regionMatches = TOP_REGIONS.filter(r =>
                r.name.toLowerCase().includes(searchTerm) ||
                r.slug.includes(searchTerm)
            ); // Filter by country done in step 2 logic, not here to avoid dupes if searching "france"

            // 2. Country Matches (Unique list)
            const matchedCountries = [...new Set(TOP_REGIONS.map(r => r.country))].filter(c =>
                c.toLowerCase().includes(searchTerm)
            ).map(c => ({
                name: c,
                type: 'country',
                slug: c.toLowerCase(), // simple slug for routing
                imageUrl: null // No specific image for country row yet
            }));

            // 3. Grape Matches
            const grapeMatches = GRAPE_VARIETIES.filter(g =>
                g.name.toLowerCase().includes(searchTerm) ||
                g.slug.includes(searchTerm)
            );

            // Combine and prioritize: Countries -> Regions -> Grapes
            setSuggestions([...matchedCountries, ...regionMatches, ...grapeMatches].slice(0, 8));
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestions.length && query) {
            // Fallback logic could go here
        }
        if (suggestions.length > 0) {
            handleSelect(suggestions[0]);
        }
    };

    const handleSelect = (item: any) => {
        setShowSuggestions(false);
        setQuery(item.name);

        if (item.type === 'country') {
            router.push(`/vintages/${item.name.toLowerCase()}`);
        } else if ('country' in item) {
            // It's a region
            const parts = query.trim().split(' ');
            const yearStr = parts.find(p => /^\d{4}$/.test(p));
            const year = yearStr ? parseInt(yearStr) : new Date().getFullYear() - 1;
            router.push(`/vintages/${item.countryCode.toLowerCase()}/${item.slug}/${year}`);
        } else {
            // It's a grape
            router.push('/grapes');
        }
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
                    placeholder="Search countries (France), regions (Napa)..."
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-xl"
                />
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="py-2">
                        <div className="px-4 py-2 text-xs uppercase tracking-widest text-gray-500 font-semibold">Suggestions</div>
                        {suggestions.map((item: any) => (
                            <div
                                key={item.slug || item.name}
                                onClick={() => handleSelect(item)}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-lg bg-gray-800 bg-cover bg-center shrink-0 flex items-center justify-center"
                                    style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
                                >
                                    {!item.imageUrl && (
                                        item.type === 'country' ? <Globe className="h-5 w-5 text-purple-400" /> :
                                            'country' in item ? <MapPin className="h-5 w-5 text-gray-500" /> :
                                                <Wine className="h-5 w-5 text-pink-400" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-purple-300 transition-colors">{item.name}</div>
                                    <div className="text-xs text-gray-400">
                                        {item.type === 'country' ? 'Country' : ('country' in item ? item.country : 'Grape Variety')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
