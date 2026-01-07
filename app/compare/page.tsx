import { Suspense } from 'react';
import dbConnect from '@/lib/mongodb';
import Region from '@/lib/models/Region';
import Vintage from '@/lib/models/Vintage';
import VintageSelector from '@/components/VintageSelector';
import ComparisonTable from '@/components/ComparisonTable';
import Link from 'next/link';

// Force dynamic because of searchParams and DB calls?
export const dynamic = 'force-dynamic';

interface ComparePageProps {
    searchParams: Promise<{
        v1?: string;
        v2?: string;
    }>;
}

async function getVintageData(ref: string) {
    if (!ref) return null;
    const [slug, yearStr] = ref.split(':');
    if (!slug || !yearStr) return null;

    try {
        await dbConnect();
        const region = await Region.findOne({ slug }).select('_id name country').lean();
        if (!region) return null;

        const vintage = await Vintage.findOne({
            regionId: region._id,
            year: parseInt(yearStr)
        }).lean();

        // If no vintage data exists, return dummy structure or null?
        // Let's return a structure with partial data to show "No Data" gracefully
        if (!vintage) {
            return {
                year: parseInt(yearStr),
                exists: false,
                regionName: region.name,
                gdd: 0,
                score: 0
            }
        }

        return {
            ...vintage,
            exists: true,
            regionName: region.name,
            // Normalize for table
            score: vintage.grapeyearScore
        };

    } catch (e) {
        console.error("Comparison Fetch Error", e);
        return null;
    }
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
    // Await params in Next.js 15
    const params = await searchParams;

    // Fetch Regions for Selector
    await dbConnect();
    const regions = await Region.find({}).sort({ name: 1 }).select('name slug country').lean();

    // Fetch Compared Vintages
    const v1Data = await getVintageData(params.v1 || '');
    const v2Data = await getVintageData(params.v2 || '');

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="container mx-auto px-4">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
                        Vintage Comparison
                    </h1>
                    <p className="text-gray-400">
                        Analyze two growing seasons side-by-side.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <VintageSelector side="v1" regions={JSON.parse(JSON.stringify(regions))} />
                    <VintageSelector side="v2" regions={JSON.parse(JSON.stringify(regions))} />
                </div>

                {/* Comparison Table Or Empty Persuasion State */}
                {v1Data && v2Data && v1Data.exists && v2Data.exists ? (
                    <ComparisonTable
                        v1={JSON.parse(JSON.stringify(v1Data))}
                        v2={JSON.parse(JSON.stringify(v2Data))}
                        r1Name={v1Data.regionName}
                        r2Name={v2Data.regionName}
                    />
                ) : (
                    <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/5">
                        <div className="text-6xl mb-4">⚖️</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Select Two Vintages</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Choose a region and year for both columns above to generate a detailed climatic comparison.
                        </p>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
