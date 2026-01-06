import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Winery from '@/lib/models/Winery';
import Wine from '@/lib/models/Wine';
import { MapPin, Globe, Mail } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();
    const winery = await Winery.findOne({ slug });

    if (!winery) return { title: 'Winery Not Found' };

    return {
        title: `${winery.name} - Winery Profile | Grapeyear`,
        description: winery.description?.substring(0, 160) || `Explore wines from ${winery.name} on Grapeyear.`,
    };
}

export default async function WineryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await connectToDatabase();

    const winery = await Winery.findOne({ slug });
    if (!winery) notFound();

    // Fetch wines for this winery
    const wines = await Wine.find({ wineryId: winery._id });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Hero */}
            <div className="relative h-[50vh] flex items-center justify-center">
                {winery.imageUrl ? (
                    <Image
                        src={winery.imageUrl}
                        alt={winery.name}
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                        <MapPin size={14} className="text-purple-400" />
                        <span className="text-sm font-medium tracking-wide">{winery.region}, {winery.country}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-6">{winery.name}</h1>

                    {/* Contact Links */}
                    <div className="flex gap-4 justify-center">
                        {winery.websiteUrl && (
                            <a href={winery.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                                <Globe size={16} /> Website
                            </a>
                        )}
                        {winery.email && (
                            <a href={`mailto:${winery.email}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                                <Mail size={16} /> Email
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-playfair font-bold mb-6 border-b border-gray-800 pb-4">About the Winery</h2>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                            <p>{winery.description}</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-playfair font-bold mb-6 border-b border-gray-800 pb-4">Our Wines</h2>
                        {wines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {wines.map((wine) => (
                                    <Link
                                        key={wine._id}
                                        href={`/wines/${wine.slug}`}
                                        className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-6 transition-all"
                                    >
                                        <h3 className="text-xl font-playfair font-bold mb-2 group-hover:text-purple-300 transition-colors">{wine.name}</h3>
                                        <div className="text-sm text-purple-400 mb-4">{wine.type}</div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{wine.description || "No description available."}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No wines listed yet.</p>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Location</h3>
                        <p className="text-gray-300 mb-4">{winery.location}</p>
                        {/* Add Map placeholder if needed */}
                    </div>
                    {winery.isFeatured && (
                        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2 text-purple-300">Grapeyear Selection</h3>
                            <p className="text-sm text-gray-300">This winery is recognized for its exceptional quality and contribution to the {winery.region} region.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
