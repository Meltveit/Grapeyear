import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import LiveMetrics from '@/components/LiveMetrics';
import { TOP_REGIONS } from '@/lib/constants';
import dbConnect from '@/lib/mongodb';
import Vintage from '@/lib/models/Vintage';
import Region from '@/lib/models/Region'; // Ensure model is registered

async function getTopVintages() {
  try {
    await dbConnect();
    // Ensure Region is loaded so populate works

    void Region;

    // Fetch top 6 vintages
    const vintages = await Vintage.find({ grapeyearScore: { $gte: 90 } })
      .sort({ grapeyearScore: -1 })
      .limit(6)
      .populate('regionId')
      .lean(); // lighter plain JS objects

    // strict serialization for Next.js props if needed, but in server component it's ok usually
    // cleaning up _id to string for safety
    return JSON.parse(JSON.stringify(vintages));
  } catch (e) {
    console.error("Failed to fetch top vintages", e);
    return [];
  }
}

interface TopVintageProps {
  _id: string;
  grapeyearScore: number;
  year: number;
  quality: string;
  regionId: {
    country: string;
    name: string;
    countryCode: string;
    slug: string;
  };
}

export default async function Home() {
  const topVintages = await getTopVintages();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <LiveMetrics />
      {/* Hero Section */}
      <div className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] z-0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            The Digital Terroir
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
            Vintage intelligence driven by climate data.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">Objective data for collectors, investors, and enthusiasts.</span>
          </p>

          <SearchBar />
        </div>
      </div>

      {/* Top Rated Vintages (New Section) */}
      {topVintages.length > 0 && (
        <section className="py-16 container mx-auto px-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-playfair font-bold">Recommended Vintages</h2>
            <div className="text-xs text-purple-400 uppercase tracking-widest">Highest Scores</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topVintages.map((v: TopVintageProps) => (
              <Link
                key={v._id}
                href={`/vintages/${v.regionId.countryCode.toLowerCase()}/${v.regionId.slug}/${v.year}`}
                className="group flex items-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all"
              >
                <div className={`
                   w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-playfair border-2
                   ${v.grapeyearScore >= 90 ? 'text-emerald-400 border-emerald-500/30' : 'text-white border-white/20'}
                `}>
                  {v.grapeyearScore}
                </div>
                <div className="ml-5">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{v.regionId.country}</div>
                  <div className="text-lg font-bold group-hover:text-purple-300 transition-colors">
                    {v.regionId.name} {v.year}
                  </div>
                  <div className="text-sm text-gray-400 capitalize italic">{v.quality}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Regions (Quick Links) */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-playfair font-bold mb-10 text-center">Explore Top Regions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TOP_REGIONS.map((region) => (
            <Link
              key={region.slug}
              href={`/vintages/${region.countryCode.toLowerCase()}/${region.slug}/2023`}
              className="group relative h-64 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              {/* Region Image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${region.imageUrl})` }}
              />

              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">{region.country}</p>
                <h3 className="text-lg font-bold group-hover:text-purple-200 transition-colors">{region.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Props / Stats */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">20+</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm">Years of History</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">10</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm">Premium Regions</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">1M+</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm">Data Points</div>
          </div>
        </div>
      </section>
    </main>
  );
}
