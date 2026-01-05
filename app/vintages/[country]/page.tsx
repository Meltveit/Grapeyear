import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOP_REGIONS } from '@/lib/constants';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

interface PageParams {
    params: Promise<{
        country: string;
    }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { country } = await params;
    const countryName = country.charAt(0).toUpperCase() + country.slice(1);

    // Find a representative image (first region in country)
    const regions = TOP_REGIONS.filter(r =>
        r.country.toLowerCase() === country.toLowerCase() ||
        r.countryCode.toLowerCase() === country.toLowerCase()
    );
    const ogImage = regions[0]?.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200';

    const canonicalPath = regions[0]?.country.toLowerCase() || country.toLowerCase();

    return {
        title: `Wines of ${countryName} | Grapeyear`,
        description: `Explore the top wine regions of ${countryName}. Detailed vintage reports and climate data.`,
        openGraph: {
            title: `Wines of ${countryName} | Grapeyear`,
            description: `Explore the top wine regions of ${countryName}.`,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        alternates: {
            canonical: `/vintages/${canonicalPath}`,
        }
    };
}

export default async function CountryPage({ params }: PageParams) {
    const { country } = await params;

    // Filter regions
    // We try to match either full country name (france) or code (fr) for flexibility
    const regions = TOP_REGIONS.filter(r =>
        r.country.toLowerCase() === country.toLowerCase() ||
        r.countryCode.toLowerCase() === country.toLowerCase()
    );

    if (regions.length === 0) {
        notFound();
    }

    const countryName = regions[0].country; // Get nice display name from first match

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.grapeyear.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: countryName,
                item: `https://www.grapeyear.com/vintages/${countryName.toLowerCase()}`
            }
        ]
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav className="p-6">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </nav>

            <div className="container mx-auto px-4">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
                        Wines of {countryName}
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Explore the diverse terroirs and premium wine regions of {countryName}.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regions.map((region) => (
                        <Link
                            key={region.slug}
                            href={`/vintages/${region.countryCode.toLowerCase()}/${region.slug}/2023`}
                            className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                            <div
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                                style={{ backgroundImage: `url(${region.imageUrl})` }}
                            />

                            <div className="absolute bottom-6 left-6 z-20 pr-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs uppercase tracking-widest text-purple-400">{region.country}</span>
                                </div>
                                <h2 className="text-3xl font-playfair font-bold group-hover:text-purple-200 transition-colors mb-2">
                                    {region.name}
                                </h2>
                                <p className="text-sm text-gray-300 line-clamp-2">
                                    {region.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
