
import Link from 'next/link';
import Image from 'next/image';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, Map } from 'lucide-react';

export const metadata = {
    title: 'Vineyards of the World | Grapeyear',
    description: 'Explore wineries and vineyards by country and region.',
};

export default function VineyardDirectory() {
    // 1. Curated Country Images
    const COUNTRY_IMAGES: Record<string, string> = {
        'France': '/images/countries/france.jpg', // Custom user image
        'Italy': '/images/countries/italy.jpg', // Custom user image
        'USA': '/images/countries/usa.jpg', // Custom user image
        'Spain': '/images/countries/spain.jpg', // Custom user image
        'Germany': '/images/countries/germany.jpg', // Custom user image
        'Austria': '/images/countries/austria.jpg', // Custom user image
        'Hungary': '/images/countries/hungary.jpg', // Custom user image
        'Argentina': '/images/countries/argentina.jpg', // Custom user image
        'Chile': '/images/countries/chile.jpg', // Custom user image
        'Australia': '/images/countries/australia.jpg', // Custom user image
        'New Zealand': '/images/countries/new-zealand.jpg', // Custom user image
        'South Africa': '/images/countries/south-africa.jpg', // Custom user image
        'Portugal': '/images/countries/portugal.jpg', // Custom user image
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
                            href={`/vineyards/${country.name.toLowerCase()}`}
                            className="group relative h-[300px] rounded-2xl overflow-hidden border border-white/10"
                        >
                            <div className="relative h-full w-full bg-gray-900">
                                <Image
                                    src={country.image}
                                    alt={`${country.name} vineyards`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <h2 className="text-4xl font-playfair font-bold text-white mb-2 relative z-10">
                                        {country.name}
                                    </h2>
                                    <span className="inline-block px-4 py-1 rounded-full border border-white/30 text-xs uppercase tracking-widest backdrop-blur-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 relative z-10">
                                        Explore Regions
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main >
    );
}
