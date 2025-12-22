'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { TOP_REGIONS } from '@/lib/constants';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        // Basic navigation logic for MVP
        // parsing "Region Year" e.g. "Bordeaux 2015"
        const parts = query.trim().split(' ');
        const yearStr = parts.find(p => /^\d{4}$/.test(p));
        const year = yearStr ? parseInt(yearStr) : new Date().getFullYear() - 1; // Default to last vintage if no year

        // specific year removal to find region name roughly
        const regionNamePart = parts.filter(p => p !== yearStr).join(' ').toLowerCase();

        // Find matched region
        const matchedRegion = TOP_REGIONS.find(r =>
            r.name.toLowerCase().includes(regionNamePart) ||
            r.slug.includes(regionNamePart)
        );

        if (matchedRegion) {
            router.push(`/vintages/${matchedRegion.countryCode.toLowerCase()}/${matchedRegion.slug}/${year}`);
        } else {
            // Fallback or could alert users
            alert(`Could not find region matching "${regionNamePart}". Try "Bordeaux 2015"`);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try 'Bordeaux 2015' or 'Montalcino 2018'..."
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-xl"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                >
                    Explore
                </button>
            </form>
        </div>
    );
}
