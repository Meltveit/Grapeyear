
import Link from 'next/link';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, Map } from 'lucide-react';

export const metadata = {
    title: 'Vineyards of the World | Grapeyear',
    description: 'Explore wineries and vineyards by country and region.',
};

export default function VineyardDirectory() {
    // 1. Get unique countries
    const uniqueCountries = Array.from(new Set(TOP_REGIONS.map(r => r.country)))
        .map(countryName => {
            const region = TOP_REGIONS.find(r => r.country === countryName);
            return {
                name: countryName,
                code: region?.countryCode.toLowerCase() || 'un',
                // Use the image of the first region found as the country cover for now
                image: region?.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb'
            };
        });

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <nav className="p-6">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6">
                        <Map className="w-6 h-6 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
                        Vineyards of the World
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Explore the world's premier wine destinations.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uniqueCountries.map((country) => (
                        <Link
                            key={country.name}
                            href={`/vineyards/${country.code}`}
                            className="group relative h-[300px] rounded-2xl overflow-hidden border border-white/10"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${country.image})` }}
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <h2 className="text-4xl font-playfair font-bold text-white mb-2">
                                    {country.name}
                                </h2>
                                <span className="inline-block px-4 py-1 rounded-full border border-white/30 text-xs uppercase tracking-widest backdrop-blur-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    Explore Regions
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
