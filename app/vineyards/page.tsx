
import Link from 'next/link';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, Map } from 'lucide-react';

export const metadata = {
    title: 'Vineyards of the World | Grapeyear',
    description: 'Explore wineries and vineyards by country and region.',
};

export default function VineyardDirectory() {
    // 1. Curated Country Images
    const COUNTRY_IMAGES: Record<string, string> = {
        'France': 'https://images.unsplash.com/photo-1599666921545-1275ca82bc92?q=80&w=1600&auto=format&fit=crop', // Rolling French vineyards
        'Italy': 'https://images.unsplash.com/photo-1528629297340-d1d466945dc5?q=80&w=1600&auto=format&fit=crop', // Tuscan landscape
        'USA': 'https://images.unsplash.com/photo-1548685913-fe6678babe8d?q=80&w=1600&auto=format&fit=crop', // Napa palms
        'Spain': 'https://images.unsplash.com/photo-1566838381836-e414c330f545?q=80&w=1600&auto=format&fit=crop', // Priorat slate
        'Germany': 'https://images.unsplash.com/photo-1563820658760-4def71be582d?q=80&w=1600&auto=format&fit=crop', // Mosel steep slopes
        'Austria': 'https://images.unsplash.com/photo-1594300742183-11381333792f?q=80&w=1600&auto=format&fit=crop',
        'Hungary': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop',
        'Argentina': 'https://images.unsplash.com/photo-1534234828569-1f27c7e81e31?q=80&w=1600&auto=format&fit=crop', // Andes backdrop
        'Chile': 'https://images.unsplash.com/photo-1582848386829-d5c2250284ae?q=80&w=1600&auto=format&fit=crop',
        'Australia': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1600&auto=format&fit=crop',
        'New Zealand': 'https://images.unsplash.com/photo-1501601004392-5444ca9f4a5c?q=80&w=1600&auto=format&fit=crop',
        'South Africa': 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop',
        'Portugal': 'https://images.unsplash.com/photo-1585501815599-2475510667db?q=80&w=1600&auto=format&fit=crop', // Douro terraced
    };

    // 2. Get unique countries
    const uniqueCountries = Array.from(new Set(TOP_REGIONS.map(r => r.country)))
        .sort()
        .map(countryName => {
            const region = TOP_REGIONS.find(r => r.country === countryName);
            return {
                name: countryName,
                code: region?.countryCode.toLowerCase() || 'un',
                image: COUNTRY_IMAGES[countryName] || region?.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb'
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
