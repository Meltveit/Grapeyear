import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Vintage, { IVintage } from '@/lib/models/Vintage';
import Region, { IRegion } from '@/lib/models/Region';
import Winery from '@/lib/models/Winery';
import Country from '@/lib/models/Country';
import GrapeyearScore from '@/components/GrapeyearScore';
import ClimateTable from '@/components/ClimateTable';
import HistoricalChart from '@/components/HistoricalChart';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { TOP_REGIONS } from '@/lib/constants';

interface PageParams {
    params: Promise<{
        country: string;
        region: string;
        year: string;
    }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { region, year } = await params;
    const regionName = region.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Find regional image
    const staticRegion = TOP_REGIONS.find(r => r.slug === region);
    const ogImage = staticRegion?.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200';

    const canonicalCountryCode = staticRegion?.countryCode.toLowerCase() || 'unknown';

    return {
        title: `${regionName} ${year} Vintage Report | Grapeyear`,
        description: `Detailed climate analysis for ${regionName} ${year}. See GDD, rainfall, and AI-driven vintage quality assessment.`,
        openGraph: {
            title: `${regionName} ${year} | Vintage Intelligence`,
            description: `Was ${year} a good year for ${regionName}? See the climate data behind the vintage.`,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${regionName} ${year} | Vintage Intelligence`,
            description: `Detailed climate report for ${regionName} ${year}.`,
            images: [ogImage],
        },
        alternates: {
            canonical: `/vintages/${canonicalCountryCode}/${region}/${year}`,
        }
    };
}

async function getRegion(slug: string) {
    // 1. Try DB
    try {
        await dbConnect();
        const doc = await Region.findOne({ slug }).lean() as IRegion | null;
        if (doc) return doc;
    } catch (e) {
        console.error("Critical: Failed to fetch region from DB", e);
    }

    // 2. Fallback to Constants (Static Data)
    const staticRegion = TOP_REGIONS.find(r => r.slug === slug);
    if (staticRegion) {
        return {
            ...staticRegion,
            _id: 'static_fallback'
        } as unknown as IRegion;
    }

    return null;
}

async function getVintage(regionId: any, year: number) {
    try {
        return await Vintage.findOne({ regionId, year }).lean() as IVintage | null;
    } catch (e) {
        console.error("Non-critical: Failed to fetch vintage data", e);
        return null;
    }
}

async function getHistoricalVintages(regionId: any, currentYear: number) {
    try {
        // Fetch last 10 years
        const startYear = currentYear - 9;
        const vintages = await Vintage.find({
            regionId,
            year: { $gte: startYear, $lte: currentYear }
        }).sort({ year: 1 }).lean();

        return vintages.map((v: any) => ({
            year: v.year,
            gdd: v.metrics?.growingDegreeDays || 0,
            score: v.grapeyearScore
        }));
    } catch (e) {
        console.error("Failed to fetch historical data", e);
        return [];
    }
}

export default async function VintagePage({ params }: PageParams) {
    const { country, region: regionSlug, year } = await params;
    const yearInt = parseInt(year);

    // 1. Fetch Region (Critical)
    const region = await getRegion(regionSlug);

    if (!region) notFound();

    // 2. Fetch Vintage Data
    const vintage = await getVintage((region as any)._id, yearInt);

    // 3. Fetch Historical Data
    const historicalData = await getHistoricalVintages((region as any)._id, yearInt);

    // 4. Fetch Wineries for this Region
    const wineries = await Winery.find({
        region: (region as any)._id
    })
        .sort({ isRecommended: -1, _id: -1 })
        .limit(3)
        .lean();

    // 5. Select Random Global Destinations (using Constants for consistency)
    const COUNTRY_IMAGES: Record<string, string> = {
        'France': '/images/countries/france.jpg',
        'Italy': '/images/countries/italy.jpg',
        'USA': '/images/countries/usa.jpg',
        'Spain': '/images/countries/spain.jpg',
        'Germany': '/images/countries/germany.jpg',
        'Austria': '/images/countries/austria.jpg',
        'Hungary': '/images/countries/hungary.jpg',
        'Argentina': '/images/countries/argentina.jpg',
        'Chile': '/images/countries/chile.jpg',
        'Australia': '/images/countries/australia.jpg',
        'New Zealand': '/images/countries/new-zealand.jpg',
        'South Africa': '/images/countries/south-africa.jpg',
        'Portugal': '/images/countries/portugal.jpg',
    };

    const currentCountryName = region.country;
    const allCountryNames = Array.from(new Set(TOP_REGIONS.map(r => r.country)));
    const otherCountries = allCountryNames.filter(c => c !== currentCountryName);

    // Shuffle and pick 3
    const randomSelection = otherCountries.sort(() => 0.5 - Math.random()).slice(0, 3);

    const randomCountries = randomSelection.map(name => {
        const r = TOP_REGIONS.find(reg => reg.country === name);
        return {
            _id: name,
            name: name,
            code: r?.countryCode.toLowerCase() || 'un',
            imageUrl: COUNTRY_IMAGES[name] || r?.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800'
        };
    });

    // Default values if vintage is missing
    const metrics = vintage?.metrics || {} as any;
    const gdd = metrics.growingDegreeDays ?? 0;
    const rainfall = metrics.totalRainfallMm ?? 0;
    const diurnal = metrics.diurnalShiftAvg ?? 0;
    const avgTemp = metrics.avgTemperature ?? 0;
    const metricsSunshineHours = metrics.sunshineHours ?? 0;
    const metricsFrostDays = metrics.frostDays ?? 0;

    const score = vintage?.grapeyearScore ?? 0;
    const quality = vintage?.quality ?? 'Data Pending';
    const summary = vintage?.aiSummary ?? 'Historical climate data for this vintage is currently being ingested.';
    const description = region.description || 'No description available.';

    // Re-calculate local image for Schema
    const staticRegion = TOP_REGIONS.find(r => r.slug === regionSlug);
    const ogImage = staticRegion?.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${region.name} ${year} Vintage`,
        description: summary,
        image: ogImage,
        brand: {
            '@type': 'Brand',
            name: 'Grapeyear'
        },
        review: {
            '@type': 'Review',
            reviewRating: {
                '@type': 'Rating',
                ratingValue: score,
                bestRating: 100,
                worstRating: 0
            },
            author: {
                '@type': 'Organization',
                name: 'Grapeyear AI'
            }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: score,
            bestRating: 100,
            worstRating: 0,
            ratingCount: 1
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav className="p-6">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
                </Link>
            </nav>

            <div className="container mx-auto px-4">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/10 pb-8">
                    <div>
                        <div className="text-sm uppercase tracking-widest text-purple-500 mb-2">{region.country}</div>
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-2">
                            {region.name}
                        </h1>
                        <div className="flex items-center gap-4 text-4xl font-light text-gray-400">
                            <Link
                                href={`/vintages/${country}/${regionSlug}/${yearInt - 1}`}
                                className="p-2 hover:text-white transition-colors"
                                aria-label="Previous Year"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </Link>
                            <span>{yearInt}</span>
                            {/* Allow next year navigation freely or limit logic if desired */}
                            <Link
                                href={`/vintages/${country}/${regionSlug}/${yearInt + 1}`}
                                className="p-2 hover:text-white transition-colors"
                                aria-label="Next Year"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <div className="text-right hidden md:block">
                            <span className="block text-xs uppercase tracking-widest text-gray-500">Vintage Quality</span>
                            <span className={`text-2xl font-serif italic capitalize ${!vintage ? 'text-gray-500' : 'text-white'}`}>
                                {quality}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Score & Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center">
                            <GrapeyearScore score={score} quality={vintage?.quality || 'average'} />
                            <div className="mt-8 pt-8 border-t border-white/5 w-full text-left">
                                <h3 className="text-xl font-playfair font-bold text-white mb-4">
                                    {region.name} {yearInt} Vintage Report
                                </h3>
                                <p className="text-gray-300 font-serif text-lg leading-relaxed">
                                    {summary}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900/10 to-black/20 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 mb-2">About {region.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Detailed Data */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className={`transition-opacity ${!vintage ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <ClimateTable
                                metrics={{
                                    gdd,
                                    rainfall,
                                    diurnal,
                                    avgTemp,
                                    sunshineHours: metricsSunshineHours,
                                    frostDays: metricsFrostDays
                                }}
                            />

                            <div className="relative">
                                <HistoricalChart
                                    currentYear={yearInt}
                                    data={historicalData}
                                />
                                {!vintage && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/80 p-4 rounded-xl border border-white/10 text-gray-400 text-sm">
                                            Collecting Data...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Wineries Section */}
                <div className="mt-20 pt-10 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-playfair font-bold text-white mb-2">
                                Want to explore vineyards in {region.name}?
                            </h2>
                            <p className="text-gray-400">
                                Discover the estates shaping the legacy of this region.
                            </p>
                        </div>
                        <Link
                            href={`/vineyards/${country}/${regionSlug}`}
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center mt-4 md:mt-0"
                        >
                            Explore all vineyards <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {wineries.map((winery: any) => (
                            <Link
                                key={winery._id}
                                href={`/wineries/${winery.slug}`}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden block border border-white/5 hover:border-white/20 transition-all"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={winery.image || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800'}
                                        alt={winery.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    {/* Recommended Badge (Fake logic for demo, ideally check field) */}
                                    {/* If you want real recommended logic, check winery.isRecommended */}
                                    {(winery.isRecommended || winery.tier === 'premium') && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md border border-white/20">
                                            <span className="text-[10px]">★</span> RECOMMENDED
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-white font-playfair mb-1 group-hover:text-purple-300 transition-colors">
                                        {winery.name}
                                    </h3>
                                    <div className="flex items-center text-xs text-gray-300 space-x-2">
                                        <span className="uppercase tracking-wider">{region.name}</span>
                                        {winery.wineryCount && <span>• {winery.wines?.length || 0} Wines</span>}
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {wineries.length === 0 && (
                            <div className="col-span-3 text-center py-10 text-gray-500 italic bg-white/5 rounded-xl border border-white/5">
                                No vineyards listed for this region yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Destinations Section */}
                <div className="mt-20 pt-10 border-t border-white/10">
                    <div className="flex items-end justify-between mb-8">
                        <h2 className="text-3xl font-playfair font-bold text-white">
                            Explore other Wine Nations
                        </h2>
                        <Link
                            href="/vineyards"
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
                        >
                            Explore All Regions <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {randomCountries.map((c: any) => (
                            <Link
                                key={c._id}
                                href={`/vineyards/${c.code.toLowerCase()}`}
                                className="group relative aspect-[16/9] rounded-xl overflow-hidden block border border-white/5 hover:border-white/20 transition-all"
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={c.imageUrl || 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=800'}
                                        alt={c.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white font-playfair tracking-wider uppercase group-hover:scale-110 transition-transform">
                                        {c.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
