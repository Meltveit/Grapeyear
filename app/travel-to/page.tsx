
import Link from 'next/link';
import Image from 'next/image';
import { TOP_REGIONS } from '@/lib/constants';
import { Map, Compass, ArrowRight } from 'lucide-react';
import DestinationSelector from '@/components/DestinationSelector';

export const metadata = {
    title: 'Wine Travel Guides | Grapeyear',
    description: 'Plan your next wine trip. Explore curated guides, hotels, and restaurants in the world\'s top wine regions.',
};

export default function TravelHub() {
    // Group regions by Country
    const countries = Array.from(new Set(TOP_REGIONS.map(r => r.country))).sort();

    // Featured Destinations (Hardcoded for now / could be dynamic)
    const featuredRegions = TOP_REGIONS.slice(0, 6); // Just grab first 6 for demo

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/30">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden">
                <Image
                    src="/images/regions/tuscany.jpg" // Fallback to a nice image
                    alt="Travel Header"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />

                <div className="relative z-10 text-center px-4">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-500/20 backdrop-blur-md rounded-full mb-6 border border-amber-500/30">
                        <Compass className="w-6 h-6 text-amber-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-400">
                        Wanderlust & Wine
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                        Discover the best places to stay, eat, and taste in the world's premier wine regions.
                    </p>
                </div>
            </div>


            {/* Country Picker - Client Component */}
            <DestinationSelector countries={countries} />


            {/* Featured Regions */}
            <section className="py-24 container mx-auto px-4">
                <h2 className="text-3xl font-playfair font-bold mb-12 text-center">Featured Destinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredRegions.map(region => (
                        <Link
                            key={region.slug}
                            href={`/travel-to/${region.country.toLowerCase().replace(/ /g, '-')}/${region.slug}`}
                            className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={region.imageUrl}
                                alt={region.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-amber-400 text-xs uppercase tracking-widest">{region.country}</span>
                                    <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                                </div>
                                <h3 className="text-3xl font-playfair font-bold text-white mb-2">{region.name}</h3>
                                <p className="text-gray-400 line-clamp-2 text-sm">{region.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
