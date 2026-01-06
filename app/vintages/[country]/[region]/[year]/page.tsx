import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Vintage, { IVintage } from '@/lib/models/Vintage';
import Region, { IRegion } from '@/lib/models/Region';
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
            </div>
        </main>
    );
}
