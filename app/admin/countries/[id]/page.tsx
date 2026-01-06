'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';

import { use } from 'react';

export default function CountryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/countries/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
            } catch (err) {
                setMessage({ text: 'Failed to load country data', type: 'error' });
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
            const res = await fetch(`/api/admin/countries/${id}`, {
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

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Country not found</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/countries" className="text-gray-400 hover:text-white transition-colors">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold font-playfair">{data.name}</h1>
                <span className="text-gray-500 font-mono text-xl">[{data.code}]</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                {/* pSEO Templates */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-blue-400">SEO Templates</h2>
                        <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1 rounded">
                            Available variables: <span className="text-yellow-400">{`{country}, {top_regions}, {current_year}`}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">SEO Title Template</label>
                            <input
                                type="text"
                                value={data.seoTitleTemplate || ''}
                                onChange={(e) => setData({ ...data, seoTitleTemplate: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm text-yellow-100"
                                placeholder="Best Vineyards in {country} | Grapeyear"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Meta Description Template</label>
                            <textarea
                                value={data.metaDescTemplate || ''}
                                onChange={(e) => setData({ ...data, metaDescTemplate: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm h-24 text-gray-300"
                                placeholder="Explore {country}'s top wine regions..."
                            />
                        </div>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-400">Intro Text Template</label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!data.name) return;
                                        setMessage({ text: 'Generating...', type: 'info' });
                                        try {
                                            const res = await fetch('/api/ai/generate', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    prompt: `Write a generic but engaging introduction template for wines from ${data.name}. Use placeholder {Year} naturally in the text.`,
                                                    type: 'intro_template'
                                                }),
                                            });
                                            const json = await res.json();
                                            if (json.text) {
                                                setData({ ...data, introTextTemplate: json.text });
                                                setMessage({ text: 'Generated!', type: 'success' });
                                            }
                                        } catch (e) {
                                            setMessage({ text: 'Failed to generate', type: 'error' });
                                        }
                                    }}
                                    className="text-xs flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity"
                                >
                                    <Wand2 size={12} />
                                    Generate Template
                                </button>
                            </div>
                            <textarea
                                value={data.introTextTemplate || ''}
                                onChange={(e) => setData({ ...data, introTextTemplate: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-32 font-mono text-sm"
                                placeholder="Example: The {Year} vintage in France was..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Use <code>{'{Year}'}</code> as a placeholder.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/countries" className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
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
