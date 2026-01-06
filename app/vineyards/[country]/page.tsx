
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

interface PageParams {
    params: Promise<{
        country: string;
    }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { country } = await params;
    const countryName = country.charAt(0).toUpperCase() + country.slice(1);

    return {
        title: `Vineyards in ${countryName} | Grapeyear`,
        description: `Explore the top wine regions and vineyards in ${countryName}.`,
    };
}

export default async function CountryVineyardsPage({ params }: PageParams) {
    const { country } = await params;

    // Clean up country code check
    const normalizedCountryCode = country.toLowerCase();

    // Filter regions belonging to this country (match Code OR Name)
    const regions = TOP_REGIONS.filter(
        r => r.countryCode.toLowerCase() === normalizedCountryCode ||
            r.country.toLowerCase() === normalizedCountryCode
    );

    if (!regions.length) {
        // Simple 404 if no regions found
        return notFound();
    }

    const countryName = regions[0].country; // Get nice display name from first region match

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <nav className="p-6">
                <div className="container mx-auto flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/vineyards" className="hover:text-white transition-colors">
                        Vineyards
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">{countryName}</span>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <header className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
                        {countryName}
                    </h1>
                    <p className="text-xl text-gray-400 font-light">
                        Select a region to explore vineyards and wineries.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regions.map((region) => (
                        <Link
                            key={region.slug}
                            href={`/vineyards/${normalizedCountryCode}/${region.slug}`}
                            className="group block bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${region.imageUrl})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-2xl font-playfair font-bold text-white">
                                        {region.name}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                    {region.description}
                                </p>
                                <div className="flex items-center text-purple-400 text-sm font-medium">
                                    Browse Vineyards <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Internal Linking: Other Countries */}
                <div className="mt-24 border-t border-white/10 pt-16">
                    <h3 className="text-2xl font-playfair font-bold mb-8 text-center">
                        Explore Other Wine Destinations
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from(new Set(TOP_REGIONS.map(r => r.country)))
                            .filter(c => c.toLowerCase() !== normalizedCountryCode && c !== countryName)
                            .slice(0, 4) // Show up to 4 other countries
                            .map(c => {
                                const r = TOP_REGIONS.find(reg => reg.country === c);
                                return (
                                    <Link
                                        key={c}
                                        href={`/vineyards/${c.toLowerCase()}`}
                                        className="block p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors border border-white/5"
                                    >
                                        <span className="text-lg font-playfair">{c}</span>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            </div>
        </main>
    );
}
