
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DestinationSelector({ countries }: { countries: string[] }) {
    const pathname = usePathname();

    return (
        <section className="container mx-auto px-4 -mt-10 relative z-20">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <h2 className="text-center text-gray-400 uppercase tracking-widest text-sm mb-6">Select a Destination</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/travel-to"
                        className={`px-6 py-3 rounded-full border transition-all duration-300 font-playfair ${pathname === '/travel-to'
                                ? 'bg-amber-500 text-black border-amber-500 font-bold'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/50'
                            }`}
                    >
                        All
                    </Link>
                    {countries.map(country => {
                        const slug = country.toLowerCase().replace(/ /g, '-');
                        const isActive = pathname.includes(`/travel-to/${slug}`);

                        return (
                            <Link
                                key={country}
                                href={`/travel-to/${slug}`}
                                className={`px-6 py-3 rounded-full border transition-all duration-300 font-playfair ${isActive
                                        ? 'bg-amber-500 text-black border-amber-500 font-bold'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/50'
                                    }`}
                            >
                                {country}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
