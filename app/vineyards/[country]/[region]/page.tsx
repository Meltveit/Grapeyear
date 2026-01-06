
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, ChevronRight, MapPin, ExternalLink, Globe } from 'lucide-react';
import type { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Region from '@/lib/models/Region';
import Winery from '@/lib/models/Winery';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

interface PageParams {
    params: Promise<{
        country: string;
        region: string;
    }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { region } = await params;
    const regionName = region.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `Vineyards in ${regionName} | Grapeyear`,
        description: `Discover the best wineries and vineyards in ${regionName}.`,
    };
}

export default async function RegionVineyardsPage({ params }: PageParams) {
    const { country, region: regionSlug } = await params;

    // Find region config
    const regionConfig = TOP_REGIONS.find(r => r.slug === regionSlug);

    if (!regionConfig) {
        return notFound();
    }

    const countryName = regionConfig.country;



    await connectToDatabase();

    // Find the Region document in DB to get its ID (needed to find linked wineries)
    const regionDoc = await Region.findOne({ slug: regionSlug }).lean();

    let wineries: any[] = [];
    if (regionDoc) {
        wineries = await Winery.find({ region: regionDoc._id }).sort({ isFeatured: -1, name: 1 }).lean();
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumbs
                    items={[
                        { label: 'Vineyards', href: '/vineyards' },
                        { label: countryName, href: `/vineyards/${country.toLowerCase()}` },
                        { label: regionConfig.name }
                    ]}
                />
            </div>

            {/* Hero */}
            <div className="relative h-[40vh] md:h-[50vh]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${regionConfig.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-4">
                        {regionConfig.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-light">
                        {regionConfig.description}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* Intro / Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-purple-400 font-bold mb-1">Country</div>
                        <div className="text-xl">{countryName}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-purple-400 font-bold mb-1">Famous For</div>
                        <div className="text-xl">{regionDoc?.famousFor || 'World-Class Wines'}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-purple-400 font-bold mb-1">Climate</div>
                        <div className="text-xl">{regionDoc?.climate || 'Unique Microclimate'}</div>
                    </div>
                </div>



                {/* Wineries List */}
                <div className="mb-20">
                    <h2 className="text-3xl font-playfair font-bold mb-8 text-center text-white">
                        Wineries in {regionConfig.name}
                    </h2>

                    {wineries.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wineries.map((winery) => (
                                <Link
                                    key={winery._id}
                                    href={`/wineries/${winery.slug}`}
                                    className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-900/20"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        {winery.imageUrl ? (
                                            <Image
                                                src={winery.imageUrl}
                                                alt={winery.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600">
                                                <MapPin className="w-8 h-8 opacity-50" />
                                            </div>
                                        )}
                                        {winery.isFeatured && (
                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                                ★ Recommended
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-playfair font-bold text-white group-hover:text-purple-400 transition-colors">
                                                {winery.name}
                                            </h3>
                                        </div>
                                        {winery.description && (
                                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                                {winery.description}
                                            </p>
                                        )}
                                        <div className="flex items-center text-xs text-purple-400 font-bold uppercase tracking-wider">
                                            Visit Winery <ChevronRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-gray-400 mb-4">No wineries added yet for this region.</p>
                            <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline">
                                Suggest a winery
                            </Link>
                        </div>
                    )}
                </div>

                {/* Integration with Vintages */}
                <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/20 to-black border border-white/10 text-center">
                    <h3 className="text-3xl font-playfair font-bold mb-4">Explore Vintages</h3>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Dive deep into the climate history and vintage quality of {regionConfig.name}.
                    </p>
                    <Link
                        href={`/vintages/${country.toLowerCase()}/${regionConfig.slug}/${new Date().getFullYear() - 1}`}
                        className="inline-flex items-center px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                    >
                        View Vintage Report <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                {/* Internal Linking: Other Regions in Same Country */}
                <div className="mt-24 border-t border-white/10 pt-16">
                    <h3 className="text-2xl font-playfair font-bold mb-8 text-center">
                        More Regions in {countryName}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {TOP_REGIONS.filter(r => r.country === countryName && r.slug !== regionSlug)
                            .slice(0, 4)
                            .map(r => (
                                <Link
                                    key={r.slug}
                                    href={`/vineyards/${r.country.toLowerCase().replace(/ /g, '-')}/${r.slug}`}
                                    className="block p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    <span className="text-lg font-playfair">{r.name}</span>
                                </Link>
                            ))}

                        {/* Fallback if few regions in country: Show popular global regions */}
                        {TOP_REGIONS.filter(r => r.country === countryName && r.slug !== regionSlug).length < 2 &&
                            TOP_REGIONS.filter(r => r.country !== countryName).slice(0, 2).map(r => (
                                <Link
                                    key={r.slug}
                                    href={`/vineyards/${r.country.toLowerCase()}/${r.slug}`}
                                    className="block p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    <span className="text-xs uppercase text-purple-400 block mb-1">{r.country}</span>
                                    <span className="text-lg font-playfair">{r.name}</span>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
