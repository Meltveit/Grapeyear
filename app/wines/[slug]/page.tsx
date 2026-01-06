import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Wine from '@/lib/models/Wine';
import Winery from '@/lib/models/Winery'; // Need to populate winery
import { Award, Grape } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();
    const wine = await Wine.findOne({ slug });

    if (!wine) return { title: 'Wine Not Found' };

    return {
        title: `${wine.name} - Review & Ratings | Grapeyear`,
        description: wine.description?.substring(0, 160) || `Read reviews for ${wine.name} on Grapeyear.`,
    };
}

export default async function WinePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await connectToDatabase();

    const wine = await Wine.findOne({ slug }).populate('wineryId');
    if (!wine) notFound();

    const winery = wine.wineryId;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-4 py-20 max-w-5xl">
                <Link href={`/wineries/${winery.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors mb-8 inline-block">
                    ← Back to {winery.name}
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="relative aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                        {wine.imageUrl ? (
                            <Image
                                src={wine.imageUrl}
                                alt={wine.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                <Grape size={64} className="opacity-20" />
                            </div>
                        )}
                        {wine.isFeatured && (
                            <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Award size={12} /> Recommended
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-2">{wine.name}</h1>
                        <Link href={`/wineries/${winery.slug}`} className="text-xl text-purple-400 hover:text-purple-300 transition-colors mb-8 block">
                            {winery.name}
                        </Link>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Description</h3>
                                <p className="text-lg text-gray-300 leading-relaxed text-balance">
                                    {wine.description || "No description available yet."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 border-t border-gray-800 pt-8">
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Type</h4>
                                    <div className="font-medium text-lg">{wine.type}</div>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Region</h4>
                                    <div className="font-medium text-lg">{winery.region}</div>
                                </div>
                                {wine.grapeVarieties?.length > 0 && (
                                    <div className="col-span-2">
                                        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Grapes</h4>
                                        <div className="flex flex-wrap gap-2 text-gray-300">
                                            {wine.grapeVarieties.map((g: string) => (
                                                <span key={g} className="bg-white/5 px-2 py-1 rounded text-sm">{g}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
