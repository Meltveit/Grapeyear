
import Link from 'next/link';
import Image from 'next/image';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import DestinationSelector from '@/components/DestinationSelector';

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
    const { country } = await params;
    // Normalize logic (same as Step 4391 fix: "south-africa" -> "south africa")
    const decodedCountry = country.replace(/-/g, ' ');
    // Find canonical name (e.g. "South Africa" vs "south africa")
    const canonical = TOP_REGIONS.find(r => r.country.toLowerCase() === decodedCountry.toLowerCase())?.country;

    if (!canonical) return { title: 'Destination Not Found' };
    return {
        title: `Wine Travel Guide: ${canonical} | Grapeyear`,
        description: `Plan your wine trip to ${canonical}. Explore top regions, hotels, and guides.`,
    };
}

export default async function CountryTravelPage({ params }: { params: Promise<{ country: string }> }) {
    const { country } = await params;
    const decodedCountry = country.replace(/-/g, ' ');

    // Filter Regions
    const countryRegions = TOP_REGIONS.filter(r => r.country.toLowerCase() === decodedCountry.toLowerCase());

    if (countryRegions.length === 0) {
        notFound();
    }

    const canonicalName = countryRegions[0].country;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/30">
            <nav className="p-6 absolute z-30">
                <Link href="/travel-to" className="inline-flex items-center text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Destinations
                </Link>
            </nav>

            {/* Hero */}
            <header className="relative h-[50vh] flex flex-col items-center justify-center">
                <Image
                    src={`/images/countries/${country}.jpg`} // Assumes image exists (from Vineyards page logic)
                    alt={canonicalName}
                    fill
                    className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

                <div className="relative z-10 text-center">
                    <h1 className="text-6xl font-playfair font-bold mb-4">{canonicalName}</h1>
                    <p className="text-xl text-gray-300">Select a region to start planning.</p>
                </div>
            </header>

            {/* Country Picker (Persistent) */}
            <div className="-mt-10 relative z-20 px-4">
                <DestinationSelector countries={Array.from(new Set(TOP_REGIONS.map(r => r.country))).sort()} />
            </div>

            {/* Region Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {countryRegions.map(region => (
                        <Link
                            key={region.slug}
                            href={`/travel-to/${country}/${region.slug}`}
                            className="group relative h-[350px] rounded-xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={region.imageUrl}
                                alt={region.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8">
                                <h3 className="text-3xl font-playfair font-bold text-white mb-2">{region.name}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{region.description}</p>
                                <div className="flex items-center text-amber-400 text-sm font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                    View Guides <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
