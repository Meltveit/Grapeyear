import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Winery from '@/lib/models/Winery';
import Wine from '@/lib/models/Wine';
import { MapPin, Globe, Mail } from 'lucide-react';

import Region from '@/lib/models/Region'; // Import Region model
import RecommendationSidebar from '../components/RecommendationSidebar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();

    // Explicitly select meta fields
    const winery = await Winery.findOne({ slug }).select('name description metaTitle metaDescription imageUrl');

    if (!winery) {
        return {
            title: 'Winery Not Found',
        };
    }

    // Use custom meta tags if available, otherwise fallback to defaults
    const title = winery.metaTitle || `${winery.name} | Grapeyear`;
    const description = winery.metaDescription || winery.description?.substring(0, 160) || `Discover ${winery.name} on Grapeyear.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: winery.imageUrl ? [winery.imageUrl] : [],
        },
    };
}

export default async function WineryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await connectToDatabase();
    const winery = await Winery.findOne({ slug });

    if (!winery) {
        notFound();
    }

    // Fetch wines for this winery
    const wines = await Wine.find({ wineryId: winery._id });

    let regionName = "Unknown Region";
    let countryName = winery.country; // Default to winery's country
    let breadcrumbRegionSlug = "#";
    let breadcrumbCountrySlug = winery.country.toLowerCase().replace(/\s+/g, '-'); // Default to winery's country slug

    if (winery.region) {
        try {
            const region = await Region.findById(winery.region);
            if (region) {
                regionName = region.name;
                countryName = region.country; // Assuming region has country code/name

                // Construct slugs (simplified logic, ideally fetch full objects if slugs differ from names)
                breadcrumbCountrySlug = region.country.toLowerCase().replace(/\s+/g, '-');
                breadcrumbRegionSlug = region.slug;
            }
        } catch (e) {
            console.error("Error fetching region:", e);
        }
    }

    // JSON-LD Schema for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Winery',
        name: winery.name,
        image: winery.imageUrl,
        description: winery.description,
        url: `https://grapeyear.com/wineries/${winery.slug}`,
        telephone: winery.phone,
        address: {
            '@type': 'PostalAddress',
            addressLocality: winery.location,
            addressCountry: winery.country
        },
        sameAs: winery.websiteUrl,
        priceRange: '$$$' // Optional placeholder
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="absolute top-0 left-0 w-full p-6 z-20">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                    <li className="text-gray-600">/</li>
                    <li><Link href="/vineyards" className="hover:text-white transition-colors">Vineyards</Link></li>
                    <li className="text-gray-600">/</li>
                    <li>
                        <Link href={`/vineyards/${breadcrumbCountrySlug}`} className="hover:text-white transition-colors">
                            {winery.country}
                        </Link>
                    </li>
                    <li className="text-gray-600">/</li>
                    {breadcrumbRegionSlug !== "#" ? (
                        <li>
                            <Link href={`/vineyards/${breadcrumbCountrySlug}/${breadcrumbRegionSlug}`} className="hover:text-white transition-colors">
                                {regionName}
                            </Link>
                        </li>
                    ) : (
                        <li>{regionName}</li>
                    )}
                    <li className="text-gray-600">/</li>
                    <li className="text-white bg-white/10 px-2 py-0.5 rounded-md" aria-current="page">{winery.name}</li>
                </ol>
            </nav>

            {/* Hero */}
            <div className="relative h-[50vh] flex items-center justify-center">
                {winery.imageUrl ? (
                    <Image
                        src={winery.imageUrl}
                        alt={winery.name}
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                        <MapPin size={14} className="text-purple-400" />
                        <span className="text-sm font-medium tracking-wide">{regionName}, {winery.country}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-6">{winery.name}</h1>


                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-playfair font-bold mb-6 border-b border-gray-800 pb-4">About the Winery</h2>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-wrap">
                            <p>{winery.description}</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-playfair font-bold mb-6 border-b border-gray-800 pb-4">Our Wines</h2>
                        {wines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {wines.map((wine) => (
                                    <Link
                                        key={wine._id}
                                        href={`/wines/${wine.slug}`}
                                        className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-6 transition-all"
                                    >
                                        <h3 className="text-xl font-playfair font-bold mb-2 group-hover:text-purple-300 transition-colors">{wine.name}</h3>
                                        <div className="text-sm text-purple-400 mb-4">{wine.type}</div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{wine.description || "No description available."}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No wines listed yet.</p>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 text-purple-400">Contact & Location</h3>

                        {winery.location && (
                            <div className="mb-6">
                                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Address</label>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winery.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-200 hover:text-purple-400 transition-colors flex items-start gap-2"
                                >
                                    <MapPin size={18} className="mt-0.5 shrink-0" />
                                    <span>{winery.location}</span>
                                </a>
                            </div>
                        )}

                        <div className="space-y-3">
                            {winery.phone && (
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Phone</label>
                                    <a href={`tel:${winery.phone}`} className="text-gray-300 hover:text-white flex items-center gap-2">
                                        <span>📞 {winery.phone}</span>
                                    </a>
                                </div>
                            )}

                            {winery.email && (
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                                    <a href={`mailto:${winery.email}`} className="text-gray-300 hover:text-white flex items-center gap-2">
                                        <Mail size={16} /> {winery.email}
                                    </a>
                                </div>
                            )}

                            {winery.websiteUrl && (
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Website</label>
                                    <a href={winery.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white flex items-center gap-2 truncate">
                                        <Globe size={16} /> Visit Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Discovery / Recommendations */}
                    <RecommendationSidebar
                        currentWineryId={winery._id}
                        currentRegionId={winery.region}
                        currentCountry={winery.country}
                    />

                    {winery.isFeatured && (
                        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2 text-purple-300">Grapeyear Selection</h3>
                            <p className="text-sm text-gray-300">This winery is recognized for its exceptional quality and contribution to the {regionName} region.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
