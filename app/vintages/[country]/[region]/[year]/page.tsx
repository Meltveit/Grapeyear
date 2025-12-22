import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Vintage from '@/lib/models/Vintage';
import Region from '@/lib/models/Region';
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
    await dbConnect();

    const region = await Region.findOne({ slug });
    if (!region) return null;

    const vintage = await Vintage.findOne({ regionId: region._id, year });
    if (!vintage) return { region, vintage: null };

    return { region, vintage };
}

export default async function VintagePage({ params }: PageParams) {
    const { country, region: regionSlug, year } = await params;

    const yearInt = parseInt(year);

    const data = await getVintageData(regionSlug, yearInt);

    if (!data) notFound();

    const { region, vintage } = data;

    // If vintage data doesn't exist yet but region does
    if (!vintage) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-playfair mb-4">Vintage Data Not Found</h1>
                <p className="text-gray-400">We don't have climate data for {region.name} {yearInt} yet.</p>
                <Link href="/" className="mt-8 text-purple-400 hover:text-purple-300 underline">
                    Back to Home
                </Link>
            </div>
        );
    }

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
                            <span className="text-2xl font-serif italic text-white capitalize">{vintage.quality}</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Score & Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center">
                            <GrapeyearScore score={vintage.grapeyearScore} quality={vintage.quality} />

                            <div className="mt-8 pt-8 border-t border-white/5 w-full">
                                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">AI Climate Summary</h3>
                                <p className="text-gray-300 font-serif leading-relaxed italic">
                                    "{vintage.aiSummary}"
                                </p>
                            </div>
                        </div>

                        {/* Region Info */}
                        <div className="bg-gradient-to-br from-purple-900/10 to-black/20 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 mb-2">About {region.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {region.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Detailed Data */}
                    <div className="lg:col-span-8 space-y-8">
                        <ClimateTable
                            metrics={{
                                gdd: vintage.metrics.growingDegreeDays,
                                rainfall: vintage.metrics.totalRainfallMm,
                                diurnal: vintage.metrics.diurnalShiftAvg,
                                avgTemp: vintage.metrics.avgTemperature
                            }}
                        />

                        <HistoricalChart
                            currentYear={yearInt}
                            currentMetrics={{ gdd: vintage.metrics.growingDegreeDays }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
