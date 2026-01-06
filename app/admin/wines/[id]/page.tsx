'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';

export default function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [wineryId, setWineryId] = useState('');
    const [vintageData, setVintageData] = useState<any>(null);

    // Fetch vintage score when year or wineryId changes
    useEffect(() => {
        if (!data?.year || !wineryId) {
            setVintageData(null);
            return;
        }

        const fetchScore = async () => {
            try {
                const res = await fetch(`/api/admin/wines/score?wineryId=${wineryId}&year=${data.year}`);
                const json = await res.json();
                if (json.found) {
                    setVintageData(json);
                } else {
                    setVintageData(null);
                }
            } catch (e) {
                console.error(e);
            }
        };

        // Debounce slightly 
        const timeout = setTimeout(fetchScore, 500);
        return () => clearTimeout(timeout);
    }, [data?.year, wineryId]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/wines/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
                if (json.wineryId) setWineryId(json.wineryId);
            } catch (err) {
                setMessage({ text: 'Failed to load wine data', type: 'error' });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch(`/api/admin/wines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to save');

            setMessage({ text: 'Changes saved successfully!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Error saving changes', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const generateDescription = async () => {
        if (!data.name) {
            setMessage({ text: 'Name required for AI generation', type: 'error' });
            return;
        }

        setGenerating(true);
        try {
            const prompt = `Write a tasting note and description for the wine "${data.name}". Focus on its flavor profile, aroma, and food pairings. Keep it under 150 words.`;

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: 'wine' }),
            });

            if (!res.ok) throw new Error('AI generation failed');

            const { text } = await res.json();
            setData({ ...data, description: text }); // Note: Model might call it seoDescription or description. Using description for now as mapped to UI
            // Wait, checking model schema... It has 'description' and 'seoDescription'. Let's use 'description' for the main text.
            setMessage({ text: 'Description generated!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to generate description', type: 'error' });
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Wine not found</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/wineries/${data.wineryId}/wines`} className="text-gray-400 hover:text-white transition-colors">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold font-playfair">{data.name}</h1>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 className="text-xl font-bold mb-4 text-purple-400">Basic Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Slug</label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData({ ...data, slug: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Type</label>
                            <select
                                value={data.type || 'Red'}
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
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Vintage Year</label>
                            <input
                                type="number"
                                value={data.year || ''}
                                onChange={(e) => setData({ ...data, year: e.target.value ? parseInt(e.target.value) : '' })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="YYYY"
                            />
                            {/* Vintage Score Card */}
                            {vintageData && (
                                <div className="mt-4 p-4 bg-white/5 border border-purple-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                            ${vintageData.score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                                                vintageData.score >= 80 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-gray-700 text-gray-400'}
                                        `}>
                                            {vintageData.score}
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase tracking-widest">Regional Score</div>
                                            <div className="font-bold text-white capitalize">{vintageData.quality || 'Unrated'}</div>
                                        </div>
                                    </div>
                                    {vintageData.summary && (
                                        <p className="text-xs text-gray-400 italic mt-1 line-clamp-2">
                                            "{vintageData.summary}"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Image URL</label>
                            <input
                                type="text"
                                value={data.imageUrl || ''}
                                onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.isFeatured || false}
                                    onChange={(e) => setData({ ...data, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm font-bold text-gray-400">Recomended Wine?</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-gray-400">Description</label>
                            <button
                                type="button"
                                onClick={generateDescription}
                                disabled={generating}
                                className="text-xs flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                <Wand2 size={12} />
                                {generating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            value={data.description || ''}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-40"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href={`/admin/wineries/${data.wineryId}/wines`} className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form >
        </div >
    );
}
