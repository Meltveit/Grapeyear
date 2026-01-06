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
                <div className="p-8 text-center text-gray-400">
                    {/* Placeholder until we implement the fetch logic */}
                    <p className="mb-4">No countries found in the database yet.</p>
                    <p className="text-sm">Start by adding your first country above.</p>
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm text-blue-200">
                <strong>Note:</strong> This manager controls the "Templates" for SEO text. <br />
                When you add a country, you can define the text structure for all its region pages.
            </div>
        </div>
    );
}
