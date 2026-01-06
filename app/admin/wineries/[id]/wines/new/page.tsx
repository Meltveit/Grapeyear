'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewWinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: wineryId } = use(params); // The page is at /admin/wineries/[id]/wines/new
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Initial state
    const [data, setData] = useState({
        name: '',
        slug: '',
        wineryId: wineryId, // Pre-fill winery ID
        description: '',
        type: 'Red',
        imageUrl: '',
        grapeVarieties: [] as string[] // Todo: add UI for this
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/admin/wines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create wine');

            // Redirect back to list
            router.push(`/admin/wineries/${wineryId}/wines`);
        } catch (err) {
            setError('Error creating wine. Make sure name/slug are unique.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/wineries/${wineryId}/wines`} className="text-gray-400 hover:text-white transition-colors">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold font-playfair">Add New Wine</h1>
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
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Type</label>
                            <select
                                value={data.type}
                                onChange={(e) => setData({ ...data, type: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="Red">Red</option>
                                <option value="White">White</option>
                                <option value="Sparkling">Sparkling</option>
                                <option value="Rosé">Rosé</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create Wine'}
                    </button>
                </div>
            </form>
        </div>
    );
}
