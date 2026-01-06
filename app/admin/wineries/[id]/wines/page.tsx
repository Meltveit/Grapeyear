'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WineryWinesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [wines, setWines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [wineryName, setWineryName] = useState('');
    const [regionId, setRegionId] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Winery Info
                const wineryRes = await fetch(`/api/admin/wineries/${id}`);
                if (wineryRes.ok) {
                    const wineryData = await wineryRes.json();
                    setWineryName(wineryData.name);
                    setRegionId(wineryData.region);
                }

                // Fetch Wines
                const winesRes = await fetch(`/api/admin/wineries/${id}/wines`);
                if (winesRes.ok) {
                    const winesData = await winesRes.json();
                    setWines(winesData);
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
                <Link href={`/admin/regions/${regionId}/wineries`} className="text-gray-400 hover:text-white transition-colors">
                    ← Back to Wineries
                </Link>
                <h1 className="text-3xl font-bold font-playfair">Wines by {wineryName || '...'}</h1>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Wines List</span>
                    <Link href={`/admin/wineries/${id}/wines/new`} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors">
                        + Add Wine
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : wines.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p className="mb-4">No wines found for this winery.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {wines.map((wine) => (
                            <div key={wine._id} className="p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <h3 className="font-bold text-lg">{wine.name}</h3>
                                    <div className="text-xs text-gray-400 font-mono">/{wine.slug}</div>
                                </div>
                                <div className="flex gap-3">
                                    <Link href={`/admin/wines/${wine._id}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-gray-300 transition-colors">
                                        Edit
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
