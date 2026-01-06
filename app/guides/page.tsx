import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Grapeyear Guides | Master the World of Wine',
    description: 'Expert guides on winemaking, collecting, investing, and tasting. Your hub for wine knowledge.',
};

const GUIDES = [
    {
        title: 'How to Start Making Wine',
        description: 'From the first vine to the final bottle. A complete beginner\'s guide.',
        slug: 'making-wine',
        image: '/images/guides/making-wine.png',
        color: 'purple'
    },
    {
        title: 'How to Start Collecting Wine',
        description: 'Building a cellar? Learn about provenance, storage, and investment.',
        slug: 'collecting-wine',
        image: '/images/guides/collecting-wine.png',
        color: 'emerald'
    },
    // Future guides can be added here
];

export default function GuidesIndex() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Link href="/" className="text-gray-500 hover:text-white mb-6 inline-block transition-colors">&larr; Back to Home</Link>
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">Wine Knowledge Hub</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Deep dive into the craft, culture, and business of wine. Whether you are a creator or a collector, your journey starts here.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GUIDES.map((guide) => (
                        <Link
                            href={`/guides/${guide.slug}`}
                            key={guide.slug}
                            className={`group relative h-96 rounded-2xl overflow-hidden border border-white/10 hover:border-${guide.color}-500/50 transition-all`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                            <Image
                                src={guide.image}
                                alt={guide.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-gray-900"
                            />

                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <div className={`text-xs font-bold uppercase tracking-widest mb-2 text-${guide.color}-400`}>
                                    Guide
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                                    {guide.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {guide.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    Read Article &rarr;
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Coming Soon Card */}
                    <div className="group relative h-96 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col items-center justify-center p-8 text-center">
                        <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-gray-400">
                            <span className="text-2xl">+</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">More Coming Soon</h3>
                        <p className="text-gray-500 text-sm">Investing, Tasting, and Pairing guides are in the works.</p>
                    </div>

                </div>
            </div>
        </main>
    );
}
