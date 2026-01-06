
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, ChevronRight, MapPin, ExternalLink, Globe } from 'lucide-react';
import type { Metadata } from 'next';

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

    // TODO: Connect to a real Winery database model later.
    // For now, we mock some premier estates based on the region to show the UI structure.
    const mockWineries = [
        {
            name: "Premier Estate",
            description: "A historic estate known for exceptional terroir and traditional winemaking methods.",
            location: "Heart of " + regionConfig.name,
            visitUrl: "#"
        },
        {
            name: "Domaine de la " + regionConfig.name,
            description: "Modern innovations meet centuries of tradition at this family-owned winery.",
            location: "Upper " + regionConfig.name,
            visitUrl: "#"
        },
        {
            name: "Château " + regionConfig.name,
            description: "Renowned for their single-vineyard bottlings and commitment to biodiversity.",
            location: "Valley Floor",
            visitUrl: "#"
        }
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <nav className="p-6">
                <div className="container mx-auto flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/vineyards" className="hover:text-white transition-colors">
                        Vineyards
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href={`/vineyards/${country}`} className="hover:text-white transition-colors">
                        {countryName}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">{regionConfig.name}</span>
                </div>
            </nav>

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
                        <div className="text-xl">World-Class Wines</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-purple-400 font-bold mb-1">Climate</div>
                        <div className="text-xl">Unique Microclimate</div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-playfair font-bold">Featured Wineries</h2>
                    <span className="text-sm text-gray-400">(Coming Soon)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockWineries.map((winery, i) => (
                        <div key={i} className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-8 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                                        {winery.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-purple-400">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {winery.location}
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                    <Globe className="w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <p className="text-gray-400 mb-6 leading-relaxed">
                                {winery.description}
                            </p>

                            <button className="flex items-center text-sm font-medium text-white/50 cursor-not-allowed uppercase tracking-wider">
                                Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    ))}
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
                                    href={`/vineyards/${country.toLowerCase()}/${r.slug}`}
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
                                    href={`/vineyards/${r.countryCode.toLowerCase()}/${r.slug}`}
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
