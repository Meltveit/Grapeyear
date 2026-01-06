'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';

export default function RegionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/regions/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
            } catch (err) {
                setMessage({ text: 'Failed to load region data', type: 'error' });
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
            const res = await fetch(`/api/admin/regions/${id}`, {
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
        if (!data.name || !data.country) {
            setMessage({ text: 'Name and Country required for AI generation', type: 'error' });
            return;
        }

        setGenerating(true);
        try {
            const prompt = `Write a compelling, evocative description for the wine region "${data.name}" in ${data.country}. Focus on its climate, famous grape varieties, and wine style. Keep it under 200 words.`;

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: 'region' }),
            });

            if (!res.ok) throw new Error('AI generation failed');

            const { text } = await res.json();
            setData({ ...data, description: text });
            setMessage({ text: 'Description generated! Don\'t forget to save.', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to generate description', type: 'error' });
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Region not found</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/countries/${data.countryId}/regions`} className="text-gray-400 hover:text-white transition-colors">
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
                {/* Basic Info */}
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
                    <Link href={`/admin/countries/${data.countryId}/regions`} className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
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
            </form>
        </div>
    );
}
