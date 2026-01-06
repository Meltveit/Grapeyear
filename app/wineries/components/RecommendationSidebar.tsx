import Link from 'next/link';
import Image from 'next/image';
import Winery from '@/lib/models/Winery';
import Region from '@/lib/models/Region';
import connectToDatabase from '@/lib/mongodb';
import { Sparkles, MapPin } from 'lucide-react';

async function getRecommendations(currentId: string, currentRegionId: string, currentCountry: string) {
    await connectToDatabase();

    // We want to discover "Other" places.
    // Priority 1: Different Country (Max Discovery)
    // Priority 2: Different Region (Same Country)
    // Exclude: Same Region (unless we have absolutely nothing else, but user asked to exclude same district)

    // 1. Fetch random Featured from DIFFERENT COUNTRY (Limit 2)
    let featured = await Winery.aggregate([
        {
            $match: {
                _id: { $ne: currentId } as any,
                isFeatured: true,
                country: { $ne: currentCountry } // Different country
            }
        },
        { $sample: { size: 2 } }
    ]);

    // If we didn't get enough featured from different countries, try Different Region in Same Country
    if (featured.length < 2) {
        const moreFeatured = await Winery.aggregate([
            {
                $match: {
                    _id: { $ne: currentId } as any,
                    isFeatured: true,
                    region: { $ne: currentRegionId }, // Different Region
                    country: currentCountry // Same Country fallback
                }
            },
            { $sample: { size: 2 - featured.length } }
        ]);
        featured = [...featured, ...moreFeatured];
    }

    // 2. Fetch random Regular from DIFFERENT COUNTRY (Limit 2)
    let regular = await Winery.aggregate([
        {
            $match: {
                _id: { $ne: currentId } as any,
                isFeatured: { $ne: true },
                country: { $ne: currentCountry }
            }
        },
        { $sample: { size: 2 } }
    ]);

    // Fallback regular: Different Region, Same Country
    if (regular.length < 2) {
        const moreRegular = await Winery.aggregate([
            {
                $match: {
                    _id: { $ne: currentId } as any,
                    isFeatured: { $ne: true },
                    region: { $ne: currentRegionId },
                    country: currentCountry
                }
            },
            { $sample: { size: 2 - regular.length } }
        ]);
        regular = [...regular, ...moreRegular];
    }

    // 3. Combine Logic (Same as before: Aim for 3 items, mix of featured/regular)
    let selected = [];
    if (featured.length > 0) selected.push({ ...featured[0], _isFeatured: true });
    if (regular.length > 0) selected.push(...regular.slice(0, 2));

    // Fill up to 3 if needed
    if (selected.length < 3 && featured.length > 1) selected.push({ ...featured[1], _isFeatured: true });

    // If still < 3 (database very small?), try to just get ANYTHING that isn't this winery
    if (selected.length < 3) {
        // Try anything not current
        const others = await Winery.aggregate([
            { $match: { _id: { $ne: currentId } as any } },
            { $sample: { size: 3 - selected.length } }
        ]);
        // Filter out duplicates if any (unlikely with Aggregation but safe)
        const existingIds = new Set(selected.map(s => s._id.toString()));
        for (const o of others) {
            if (!existingIds.has(o._id.toString())) {
                selected.push(o);
                existingIds.add(o._id.toString());
            }
        }
    }

    // Shuffle
    selected = selected.sort(() => 0.5 - Math.random());

    // Enrich with Region Names
    const enriched = await Promise.all(selected.map(async (w) => {
        let regionName = w.region; // default to ID
        if (w.region && w.region.length === 24) {
            try {
                const r = await Region.findById(w.region);
                if (r) regionName = r.name;
            } catch (e) { }
        }
        return { ...w, regionName };
    }));

    return enriched;
}

export default async function RecommendationSidebar({ currentWineryId, currentRegionId, currentCountry }: { currentWineryId: any, currentRegionId: string, currentCountry: string }) {
    const recommendations = await getRecommendations(currentWineryId, currentRegionId, currentCountry);

    if (recommendations.length === 0) return null;

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-purple-300 flex items-center gap-2">
                <Sparkles size={18} />
                Discover More
            </h3>
            <div className="space-y-4">
                {recommendations.map((winery) => (
                    <Link
                        key={winery._id}
                        href={`/wineries/${winery.slug}`}
                        className="block relative h-48 rounded-xl overflow-hidden group border border-white/10"
                    >
                        {/* Background Image */}
                        {winery.imageUrl ? (
                            <Image
                                src={winery.imageUrl}
                                alt={winery.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                                <span className="text-purple-500 font-playfair font-bold text-2xl">GY</span>
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                            <h4 className="font-bold text-lg text-white font-playfair leading-tight mb-1 group-hover:text-purple-300 transition-colors">{winery.name}</h4>
                            <div className="flex items-center text-xs text-gray-300 font-medium uppercase tracking-wider">
                                <MapPin size={12} className="mr-1 text-purple-400" />
                                <span className="truncate">{winery.regionName}, {winery.country}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
