import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Vintage, { IVintage } from '@/lib/models/Vintage';
import Region, { IRegion } from '@/lib/models/Region';
import GrapeyearScore from '@/components/GrapeyearScore';
import ClimateTable from '@/components/ClimateTable';
import HistoricalChart from '@/components/HistoricalChart';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

    return {
        title: `${regionName} ${year} Vintage Report | Grapeyear`,
        description: `Detailed climate analysis for ${regionName} ${year} vintage. Data-driven scores, growing degree days, and weather metrics.`,
    };
}

async function getVintageData(slug: string, year: number) {
    try {
        await dbConnect();

        const region = await Region.findOne({ slug }).lean() as IRegion | null;
        if (!region) return null;

        const vintage = await Vintage.findOne({ regionId: (region as any)._id, year }).lean() as IVintage | null;

        // Return structured data
        return { region, vintage };
    } catch (e) {
        console.error("Error fetching vintage data:", e);
        // In case of DB error, we might still want to show something or let the page handle it
        throw e;
    }
}

export default async function VintagePage({ params }: PageParams) {
    const { country, region: regionSlug, year } = await params;
    const yearInt = parseInt(year);

    let data;
    try {
        data = await getVintageData(regionSlug, yearInt);
    } catch (e) {
        // Fallback for critical DB errors
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-playfair mb-4 text-red-400">System Error</h1>
                <p className="text-gray-400 mb-8">Unable to load vintage data at this time.</p>
                <Link href="/" className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    if (!data) notFound();

    const { region, vintage } = data;

    // Default values if vintage is missing
    const metrics = vintage?.metrics || {} as any;
    const gdd = metrics.growingDegreeDays ?? 0;
    const rainfall = metrics.totalRainfallMm ?? 0;
    const diurnal = metrics.diurnalShiftAvg ?? 0;
    const avgTemp = metrics.avgTemperature ?? 0;
    const score = vintage?.grapeyearScore ?? 0;
    const quality = vintage?.quality ?? 'Data Pending';
    const summary = vintage?.aiSummary ?? 'Historical climate data for this vintage is currently being ingested.';
    const description = region.description || 'No description available.';

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            {/* Navbar simple override */}
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
                        <div className="text-4xl font-light text-gray-400">{yearInt}</div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <div className="text-right hidden md:block">
                            <span className="block text-xs uppercase tracking-widest text-gray-500">Vintage Quality</span>
                            {/* If quality is N/A (Data Pending), style it differently */}
                            <span className={`text-2xl font-serif italic capitalize ${!vintage ? 'text-gray-500' : 'text-white'}`}>
                                {quality}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Score & Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center">
                            {/* If no vintage, show placeholder score or 0 */}
                            <GrapeyearScore score={score} quality={vintage?.quality || 'average'} />

                            <div className="mt-8 pt-8 border-t border-white/5 w-full">
                                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">AI Climate Summary</h3>
                                <p className="text-gray-300 font-serif leading-relaxed italic">
                                    "{summary}"
                                </p>
                            </div>
                        </div>

                        {/* Region Info */}
                        <div className="bg-gradient-to-br from-purple-900/10 to-black/20 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 mb-2">About {region.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Detailed Data */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Only show data visualization if we have at least some metrics or if we want to show empty state */}
                        <div className={`transition-opacity ${!vintage ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <ClimateTable
                                metrics={{
                                    gdd,
                                    rainfall,
                                    diurnal,
                                    avgTemp
                                }}
                            />

                            <div className="relative">
                                <HistoricalChart
                                    currentYear={yearInt}
                                    currentMetrics={{ gdd }}
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
