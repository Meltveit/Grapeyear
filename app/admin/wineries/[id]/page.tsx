'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function WineryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [regionId, setRegionId] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/wineries/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
                if (json.region) setRegionId(json.region); // Assuming region is stored as ID
            } catch (err) {
                setMessage({ text: 'Failed to load winery data', type: 'error' });
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
            const res = await fetch(`/api/admin/wineries/${id}`, {
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
            // Send just the name, let the API System Prompt handle the heavy lifting for 'winery'
            const prompt = data.name;

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: 'winery' }),
            });

            if (!res.ok) throw new Error('AI generation failed');

            const { text } = await res.json();

            try {
                // Attempt to parse JSON response
                // Clean markdown code blocks if present
                const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const json = JSON.parse(cleanText);

                setData({
                    ...data,
                    description: json.description || text,
                    metaTitle: json.metaTitle || data.metaTitle,
                    metaDescription: json.metaDescription || data.metaDescription
                    // Could also populate 'location', 'websiteUrl' if the AI returns them in the future
                });
                setMessage({ text: 'Full Profile & SEO Generated!', type: 'success' });
            } catch (e) {
                // Fallback for non-winery types or failed JSON
                setData({ ...data, description: text });
                setMessage({ text: 'Description generated!', type: 'success' });
            }

        } catch (err) {
            setMessage({ text: 'Failed to generate content', type: 'error' });
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Winery not found</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/regions/${data.region}/wineries`} className="text-gray-400 hover:text-white transition-colors">
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
                        <div className="md:col-span-2">
                            <ImageUpload
                                label="Winery Image"
                                value={data.imageUrl || ''}
                                onChange={(url) => setData({ ...data, imageUrl: url })}
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4 text-purple-400 border-t border-gray-700 pt-6">Contact & Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Website</label>
                            <input
                                type="url"
                                value={data.websiteUrl || ''}
                                onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Location</label>
                            <input
                                type="text"
                                value={data.location || ''}
                                onChange={(e) => setData({ ...data, location: e.target.value })}
                                placeholder="e.g. Margaux, France"
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={data.email || ''}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="contact@winery.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={data.phone || ''}
                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="+33 5 57 88 30 40"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Tier</label>
                            <select
                                value={data.tier || 'Basic'}
                                onChange={(e) => setData({ ...data, tier: e.target.value })}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="Basic">Basic</option>
                                <option value="Premium">Premium (Recommended)</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.isFeatured || false}
                                    onChange={(e) => setData({ ...data, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm font-bold text-gray-400">Mark as Featured?</span>
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
                </div >

                {/* SEO Settings */}
                <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-purple-300 border-b border-white/10 pb-4">SEO Settings</h2>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Meta Title</label>
                            <input
                                type="text"
                                value={data.metaTitle || ''}
                                onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                                placeholder="Custom Title Tag (defaults to Name | Grapeyear)"
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Meta Description</label>
                            <textarea
                                value={data.metaDescription || ''}
                                onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                                placeholder="Custom Meta Description (defaults to summary)"
                                rows={3}
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-8">
                    <Link
                        href="/admin/dashboard"
                        className="px-6 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 rounded-lg font-bold text-black bg-purple-500 hover:bg-purple-400 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Wines Management Section */}
            <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold font-playfair mb-2">Wines</h2>
                        <p className="text-gray-400 text-sm">Manage wines produced by {data.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={`/admin/wineries/${id}/wines`}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors border border-gray-600"
                        >
                            View All
                        </Link>
                        <Link
                            href={`/admin/wineries/${id}/wines/new`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>+</span> Add Wine
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
