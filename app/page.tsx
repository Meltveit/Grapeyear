import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import LiveMetrics from '@/components/LiveMetrics';
import RegionExplorer from '@/components/RegionExplorer';
import { TOP_REGIONS } from '@/lib/constants';
import dbConnect from '@/lib/mongodb';
import Vintage from '@/lib/models/Vintage';
import Region from '@/lib/models/Region'; // Ensure model is registered

export const metadata = {
  title: 'Grapeyear - Vintage Intelligence Driven by Climate Data',
  description: 'Objective climate data for wine collectors, investors, and enthusiasts. Explore vintage ratings across 30+ global wine regions.',
};

async function getTopVintages() {
  try {
    await dbConnect();
    void Region;

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;

    // 1. Fetch top 40 high-scoring vintages from the last 10 years
    const vintages = await Vintage.find({
      grapeyearScore: { $gte: 85 },
      year: { $gte: startYear }
    })
      .sort({ grapeyearScore: -1 })
      .limit(40)
      .populate('regionId')
      .lean();

    // 2. Deduplicate manually: Keep only the HIGHEST scoring vintage per region
    // This effectively gives us "Top Year for Each Region"
    const seenRegions = new Set();
    const diverseVintages: any[] = []; // Explicit type to allow push

    for (const v of vintages as any[]) {
      const rName = v.regionId?.name;
      if (!seenRegions.has(rName)) {
        seenRegions.add(rName);
        diverseVintages.push(v);
        // Stop if we have 6 nice cards
        if (diverseVintages.length >= 6) break;
      }
    }

    return JSON.parse(JSON.stringify(diverseVintages));
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
        {/* Optimized Hero Background Image */}
        <Image
          src="/images/regions/bordeaux.jpg"
          alt="Bordeaux vineyards"
          fill
          priority
          fetchPriority="high"
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-[#0a0a0a] z-10" />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full p-6 z-30 grid grid-cols-3 items-center">
          <div className="font-playfair font-bold text-2xl text-white tracking-tighter">Grapeyear</div>

          {/* Centered Button */}
          <div className="flex justify-center">
            <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-xl">
              <Link href="/vineyards" className="px-8 py-2.5 rounded-full hover:bg-white/20 transition-all text-sm font-medium tracking-wide">
                Explore Vineyards
              </Link>
            </div>
          </div>

          {/* Empty right side for LiveMetrics */}
          <div></div>
        </nav>

        <div className="relative z-20 container mx-auto px-4 text-center">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
            <h2 className="text-2xl font-playfair font-bold">Recommended Vintages</h2>
            <div className="text-xs text-purple-400 uppercase tracking-widest">Last 10 Years</div>
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
          {TOP_REGIONS.slice(0, 10).map((region) => (
            <Link
              key={region.slug}
              href={`/vintages/${region.countryCode.toLowerCase()}/${region.slug}/${new Date().getFullYear() - 1}`}
              className="group relative h-64 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              {/* Optimized Region Image */}
              <Image
                src={region.imageUrl}
                alt={`${region.name}, ${region.country}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                loading="lazy"
              />

              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">{region.country}</p>
                <h3 className="text-lg font-bold group-hover:text-purple-200 transition-colors">{region.name}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-500 italic">...and many more below</p>
        </div>
      </section>

      <RegionExplorer />

      {/* Value Props / Stats */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">20+</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm">Years of History</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">{TOP_REGIONS.length}+</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm">Global Regions</div>
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
