'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Country {
    _id: string;
    name: string;
    slug: string;
    code: string;
}

export default function CountriesPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await fetch('/api/admin/countries');
                if (res.ok) {
                    const data = await res.json();
                    setCountries(data);
                }
            } catch (error) {
                console.error("Failed to fetch countries", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCountries();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-playfair">Countries & Regions</h1>
                <Link
                    href="/admin/countries/new"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Add Country
                </Link>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : countries.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p className="mb-4">No countries found in the database yet.</p>
                        <p className="text-sm">Start by adding your first country above.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {countries.map((country) => (
                            <div key={country._id} className="p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{country.code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))}</span>
                                    <div>
                                        <h3 className="font-bold text-lg">{country.name}</h3>
                                        <div className="text-xs text-gray-400 font-mono">/{country.slug}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link href={`/admin/countries/${country._id}`} className="text-sm bg-black/30 px-3 py-1.5 rounded hover:bg-black/50 transition-colors text-purple-300 border border-purple-500/20">
                                        Edit Templates
                                    </Link>
                                    <Link href={`/admin/countries/${country._id}/regions`} className="text-sm bg-black/30 px-3 py-1.5 rounded hover:bg-black/50 transition-colors text-blue-300 border border-blue-500/20">
                                        Manage Regions
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm text-blue-200">
                <strong>Note:</strong> This manager controls the "Templates" for SEO text. <br />
                When you add a country, you can define the text structure for all its region pages.
            </div>
        </div>
    );
}
