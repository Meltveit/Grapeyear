
import Link from 'next/link';
import Image from 'next/image';
import { TOP_REGIONS } from '@/lib/constants';
import dbConnect from '@/lib/mongodb';
import TravelGuide from '@/lib/models/TravelGuide';
import Hospitality from '@/lib/models/Hospitality';
import Region from '@/lib/models/Region'; // Ensure model loaded
import { ArrowLeft, ExternalLink, MapPin, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ country: string, region: string }> }) {
    const { region } = await params;
    const regionConfig = TOP_REGIONS.find(r => r.slug === region);
    if (!regionConfig) return { title: 'Region Not Found' };
    return {
        title: `Travel Guide: ${regionConfig.name} | Grapeyear`,
        description: `Best hotels, restaurants, and travel guides for ${regionConfig.name}.`,
    };
}

// Fetch Data
async function getData(regionSlug: string) {
    await dbConnect();
    // 1. Find Region Object (for ID)
    const regionDoc = await Region.findOne({ slug: regionSlug });
    if (!regionDoc) return null;

    // 2. Fetch Guides
    const guides = await TravelGuide.find({ regionId: regionDoc._id, status: 'published' }).sort({ createdAt: -1 });

    // 3. Fetch Hospitality
    const hospitality = await Hospitality.find({ regionId: regionDoc._id, paymentStatus: 'active' }).sort({ tier: -1, name: 1 });

    return { regionDoc, guides, hospitality };
}

export default async function RegionTravelPage({ params }: { params: Promise<{ country: string, region: string }> }) {
    const { country, region } = await params;
    const regionConfig = TOP_REGIONS.find(r => r.slug === region);

    if (!regionConfig) notFound();

    const data = await getData(region);
    // Even if no data in DB, we render the page using static config
    const guides = data?.guides || [];
    const hospitality = data?.hospitality || [];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/30">
            {/* Nav */}
            <nav className="p-6 absolute z-30 w-full flex justify-between items-center">
                <Link href={`/travel-to/${country}`} className="inline-flex items-center text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to {regionConfig.country}
                </Link>
            </nav>

            {/* Hero */}
            <header className="relative h-[60vh] flex flex-col items-center justify-center">
                <Image
                    src={regionConfig.imageUrl}
                    alt={regionConfig.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-black/40" />

                <div className="relative z-10 text-center px-4">
                    <div className="text-amber-400 uppercase tracking-widest text-sm mb-4 font-bold bg-black/50 inline-block px-3 py-1 rounded backdrop-blur">
                        Wine Region Guide
                    </div>
                    <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6 drop-shadow-lg">{regionConfig.name}</h1>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto font-light drop-shadow-md">
                        {regionConfig.description}
                    </p>
                </div>
            </header>

            {/* Travel Guides Section */}
            <section className="container mx-auto px-4 py-16 border-b border-white/5">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-playfair font-bold mb-2">Curated Guides</h2>
                        <p className="text-gray-400">Hand-picked articles and itineraries from around the web.</p>
                    </div>
                </div>

                {guides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guides.map((guide: any) => (
                            <a
                                key={guide._id}
                                href={guide.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-[#111] hover:bg-[#161616] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all h-full flex flex-col"
                            >
                                {/* Thumbnail (if available) - otherwise generic pattern */}
                                <div className="h-40 bg-gray-900 relative">
                                    {guide.imageUrl ? (
                                        <Image src={guide.imageUrl} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                                            <MapPin className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 text-xs text-white rounded">
                                        {guide.source}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold font-playfair mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                                        {guide.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{guide.summary}</p>

                                    <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                        {guide.keywords?.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-sm flex items-center">
                                                <Tag className="w-3 h-3 mr-1 opacity-50" /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center text-amber-500 text-sm font-medium">
                                        Read Article <ExternalLink className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
                        <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">Coming Soon</h3>
                        <p className="text-gray-500">We are currently curating the best guides for {regionConfig.name}.</p>
                    </div>
                )}
            </section>

            {/* Featured Hospitality Section */}
            {(hospitality.length > 0) && (
                <section className="container mx-auto px-4 py-16">
                    <h2 className="text-3xl font-playfair font-bold mb-10 text-center">Where to Stay & Eat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hospitality.map((place: any) => (
                            <div key={place._id} className="relative bg-[#111] rounded-xl overflow-hidden border border-white/10">
                                {place.tier === 'premium' && (
                                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 z-10">
                                        Editor's Pick
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">{place.type}</div>
                                    <h3 className="text-xl font-bold mb-2">{place.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{place.description}</p>
                                    {place.bookingUrl && (
                                        <a href={place.bookingUrl} target="_blank" className="block w-full text-center bg-white/10 hover:bg-white/20 py-2 rounded text-sm transition-colors">
                                            Book Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
