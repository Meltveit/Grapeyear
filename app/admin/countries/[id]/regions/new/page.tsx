'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewRegionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: countryId } = use(params);
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [data, setData] = useState({
        name: '',
        slug: '',
        description: '',
        famousFor: '',
        climate: '',
        coordinates: '0, 0' // Simple text input for now "lat, lng"
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Parse coordinates
            const [lat, lng] = data.coordinates.split(',').map(n => parseFloat(n.trim()));
            const location = {
                type: 'Point',
                coordinates: [lng || 0, lat || 0] // Mongo uses [lng, lat]
            };

            const res = await fetch(`/api/admin/countries/${countryId}/regions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    location
                }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to create region');
            }

            // Redirect back to list
            router.push(`/admin/countries/${countryId}/regions`);
        } catch (err: any) {
            setError(err.message || 'Error creating region');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/countries/${countryId}/regions`} className="text-gray-400 hover:text-white transition-colors">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold font-playfair">Add New Region</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                    setData({ ...data, name, slug })
                                }}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Slug</label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData({ ...data, slug: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-32"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Famous For</label>
                            <input
                                type="text"
                                value={data.famousFor}
                                onChange={(e) => setData({ ...data, famousFor: e.target.value })}
                                placeholder="e.g. World-Class Wines"
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Climate</label>
                            <input
                                type="text"
                                value={data.climate}
                                onChange={(e) => setData({ ...data, climate: e.target.value })}
                                placeholder="e.g. Unique Microclimate"
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2">Coordinates (Lat, Lng) (Optional)</label>
                        <input
                            type="text"
                            value={data.coordinates}
                            onChange={(e) => setData({ ...data, coordinates: e.target.value })}
                            placeholder="e.g. 44.8, -0.5"
                            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Used for future map features. Defaults to 0,0.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create Region'}
                    </button>
                </div>
            </form>
        </div>
    );
}
