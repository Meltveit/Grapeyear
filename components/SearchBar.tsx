'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Wine, Globe, Store } from 'lucide-react';
import debounce from 'lodash/debounce';

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

    // REST API Search
    const fetchResults = async (val: string) => {
        if (val.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Debounce to prevent API spam
    const debouncedSearch = useCallback(debounce(fetchResults, 300), []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setShowSuggestions(true);
        debouncedSearch(val);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            handleSelect(suggestions[0]);
        }
    };

    const handleSelect = (item: any) => {
        setShowSuggestions(false);
        setQuery(item.name);

        if (item.url) {
            router.push(item.url);
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
                    placeholder="Search wines, wineries, regions..."
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
                                key={`${item.type}-${item.slug}`}
                                onClick={() => handleSelect(item)}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-lg bg-gray-800 bg-cover bg-center shrink-0 flex items-center justify-center overflow-hidden relative"
                                    style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
                                >
                                    {!item.imageUrl && (
                                        item.type === 'region' ? <MapPin className="h-5 w-5 text-purple-400" /> :
                                            item.type === 'winery' ? <Store className="h-5 w-5 text-emerald-400" /> :
                                                item.type === 'wine' ? <Wine className="h-5 w-5 text-pink-400" /> :
                                                    <Globe className="h-5 w-5 text-gray-400" />
                                    )}
                                    {/* Type Indicator */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.type === 'region' ? 'bg-purple-500' :
                                            item.type === 'winery' ? 'bg-emerald-500' :
                                                item.type === 'wine' ? 'bg-pink-500' : 'bg-gray-500'
                                        }`} />
                                </div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-purple-300 transition-colors">{item.name}</div>
                                    <div className="text-xs text-gray-400 capitalize">
                                        {item.type} {item.country ? `• ${item.country}` : ''}
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
