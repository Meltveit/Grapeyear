'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegionWineriesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [wineries, setWineries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [regionName, setRegionName] = useState('');
    const [countryId, setCountryId] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Region Info
                const regionRes = await fetch(`/api/admin/regions/${id}`);
                if (regionRes.ok) {
                    const regionData = await regionRes.json();
                    setRegionName(regionData.name);
                    setCountryId(regionData.countryId);
                }

                // Fetch Wineries
                const wineriesRes = await fetch(`/api/admin/regions/${id}/wineries`);
                if (wineriesRes.ok) {
                    const wineriesData = await wineriesRes.json();
                    setWineries(wineriesData);
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
                <Link href={`/admin/countries/${countryId}/regions`} className="text-gray-400 hover:text-white transition-colors">
                    ← Back to Regions
                </Link>
                <h1 className="text-3xl font-bold font-playfair">Wineries in {regionName || '...'}</h1>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Wineries List</span>
                    <Link href={`/admin/regions/${id}/wineries/new`} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors">
                        + Add Winery
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : wineries.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p className="mb-4">No wineries found for this region.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {wineries.map((winery) => (
                            <div key={winery._id} className="p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <h3 className="font-bold text-lg">{winery.name}</h3>
                                    <div className="text-xs text-gray-400 font-mono">/{winery.slug}</div>
                                </div>
                                <div className="flex gap-3">
                                    <Link href={`/admin/wineries/${winery._id}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-gray-300 transition-colors">
                                        Edit
                                    </Link>
                                    <Link href={`/admin/wineries/${winery._id}/wines`} className="px-4 py-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded text-sm transition-colors">
                                        Manage Wines
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
