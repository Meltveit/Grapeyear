'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MapPin, Globe } from 'lucide-react';
import { TOP_REGIONS } from '@/lib/constants';

// Group regions by Country
const regionsByCountry = TOP_REGIONS.reduce((acc, region) => {
    if (!acc[region.country]) {
        acc[region.country] = [];
    }
    acc[region.country].push(region);
    return acc;
}, {} as Record<string, typeof TOP_REGIONS>);

const sortedCountries = Object.keys(regionsByCountry).sort();

export default function RegionExplorer() {
    const [openCountry, setOpenCountry] = useState<string | null>(null);

    const toggleCountry = (country: string) => {
        setOpenCountry(openCountry === country ? null : country);
    };

    return (
        <section className="py-20 container mx-auto px-4 border-t border-white/5">
            <h2 className="text-3xl font-playfair font-bold mb-10 text-center">Browse by Country</h2>

            <div className="max-w-4xl mx-auto space-y-4">
                {sortedCountries.map((country) => (
                    <div key={country} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                        <button
                            onClick={() => toggleCountry(country)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex items-center gap-4">
                                <span className={`p-2 rounded-lg bg-purple-500/10 text-purple-400`}>
                                    <Globe className="w-6 h-6" />
                                </span>
                                <span className="text-xl font-bold font-playfair">{country}</span>
                                <span className="text-sm text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                                    {regionsByCountry[country].length} Regions
                                </span>
                            </div>
                            <ChevronDown
                                className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${openCountry === country ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <div
                            className={`
                                transition-all duration-300 ease-in-out overflow-hidden
                                ${openCountry === country ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {regionsByCountry[country].map((region) => (
                                    <Link
                                        key={region.slug}
                                        href={`/vintages/${region.countryCode.toLowerCase()}/${region.slug}/2024`}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-black/20 hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/30 transition-all group"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full bg-cover bg-center border border-white/10"
                                            style={{ backgroundImage: `url(${region.imageUrl})` }}
                                        />
                                        <div>
                                            <div className="font-bold group-hover:text-purple-300 transition-colors">{region.name}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{region.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
