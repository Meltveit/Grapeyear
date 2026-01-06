'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { use } from 'react';

export default function CountryRegionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [regions, setRegions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [countryName, setCountryName] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Country Name for Header
                const countryRes = await fetch(`/api/admin/countries/${id}`);
                if (countryRes.ok) {
                    const countryData = await countryRes.json();
                    setCountryName(countryData.name);
                }

                // Fetch Regions
                const regionsRes = await fetch(`/api/admin/countries/${id}/regions`);
                if (regionsRes.ok) {
                    const regionsData = await regionsRes.json();
                    setRegions(regionsData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/countries" className="text-gray-400 hover:text-white transition-colors">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold font-playfair">Regions in {countryName || '...'}</h1>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Regions List</span>
                    <Link href={`/admin/countries/${id}/regions/new`} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors">
                        + Add Region
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : regions.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p className="mb-4">No regions found for this country.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {regions.map((region) => (
                            <div key={region._id} className="p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">{region.name}</h3>
                                        {region.isTopRegion && (
                                            <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-0.5 rounded border border-yellow-500/20">Top Region</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono">/{region.slug}</div>
                                </div>

                                <Link href={`/admin/regions/${region._id}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-gray-300 transition-colors">
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
