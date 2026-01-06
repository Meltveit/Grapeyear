import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'How to Start a Wine Collection: Investment, Storage & Provenance | Grapeyear',
    description: 'The ultimate guide to collecting wine. Learn about provenance, proper storage conditions (temperature, humidity), identifying investment-grade wines, and building a cellar.',
    keywords: ['wine collecting', 'wine investment', 'wine storage', 'provenance', 'wine cellar', 'aged wine'],
};

export default function CollectingWineGuide() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'How to Start a Wine Collection: Investment, Storage & Provenance',
        image: 'https://grapeyear.com/images/guides/collecting-wine.png',
        author: {
            '@type': 'Organization',
            name: 'Grapeyear'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Grapeyear',
            logo: {
                '@type': 'ImageObject',
                url: 'https://grapeyear.com/logo.png'
            }
        },
        description: 'The ultimate guide to collecting wine. Learn about provenance, storage, and investment.',
        datePublished: '2025-10-15'
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href="/guides" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">&larr; Back to Guides</Link>
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">How to Start Collecting Wine</h1>
                    <p className="text-xl text-gray-300 font-light leading-relaxed">
                        Building a cellar is about more than just buying bottles. It is about curating history, flavor, and future value. Whether for pleasure or profit, every serious collection starts with the same fundamentals.
                    </p>
                </div>

                {/* Hero Image */}
                <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 border border-white/10">
                    <Image
                        src="/images/guides/collecting-wine.png"
                        alt="Luxury wine cellar with wooden racks"
                        fill
                        className="object-cover bg-gray-900"
                    />
                </div>

                <article className="prose prose-invert prose-lg max-w-none">

                    <h2 className="text-3xl font-playfair font-bold text-emerald-200 mt-12 mb-6">1. The Golden Rule: Provenance</h2>
                    <p>
                        In the world of fine wine, <strong>Provenance is King</strong>. It refers to the documented history of a bottle's life—from the winery to your hands.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 mb-6">
                        <li><strong>Why it matters:</strong> A ’82 Château Margaux stored in a hot garage is vinegar. The same bottle stored at 55°F is nectar.</li>
                        <li><strong>What to look for:</strong> Buy from reputable merchants who can guarantee "cold chain" shipping. Avoid auctions with vague "found in grandpa's attic" descriptions.</li>
                    </ul>

                    <h2 className="text-3xl font-playfair font-bold text-emerald-200 mt-16 mb-6">2. Perfect Storage Conditions</h2>
                    <p>
                        Wine is a living organism. To age gracefully, it needs stability.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">Temperature</h3>
                            <p className="text-sm">
                                <strong>Target:</strong> 12-14°C (55°F).
                                <br />
                                <strong>Consistency:</strong> Fluctuations are the enemy. They cause the cork to expand/contract, letting in oxygen.
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">Humidity</h3>
                            <p className="text-sm">
                                <strong>Target:</strong> 70%.
                                <br />
                                <strong>Why:</strong> Keeps the cork moist. Dry corks shrink and crumble (&lt; 50%). Too humid (&gt; 80%) risks mold on labels.
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">Darkness</h3>
                            <p className="text-sm">
                                UV rays degrade wine (lightstrike). Store in a dark room or use UV-tinted glass doors.
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">Vibration</h3>
                            <p className="text-sm">
                                Keep away from washing machines or heavy foot traffic. Vibration disturbs sediment and speeds up chemical aging negatively.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-playfair font-bold text-emerald-200 mt-16 mb-6">3. Investment vs. Drinking</h2>
                    <p>
                        Decide early: Are you a <em>Drinker</em>, an <em>Investor</em>, or both?
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">Investment Grade Wines (Blue Chips)</h3>
                    <p>
                        These wines historically appreciate in value. They represent the top 1% of production.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 mb-6">
                        <li><strong>Bordeaux:</strong> First Growths (Lafite, Latour, Margaux, Haut-Brion, Mouton).</li>
                        <li><strong>Burgundy:</strong> Grand Crus (DRC, Leroy, Rousseau). Extreme scarcity drives price.</li>
                        <li><strong>Napa:</strong> Cult Cabernets (Screaming Eagle, Harlan).</li>
                        <li><strong>Italy:</strong> Super Tuscans (Sassicaia, Masseto) and Barolo.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">The "Drinker's" Collection</h3>
                    <p>
                        Focus on regions that offer value and ageability but aren't overpriced brands.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 mb-6">
                        <li><strong>Rioja Gran Reserva:</strong> Ages for decades, affordable.</li>
                        <li><strong>German Riesling:</strong> Specifically Spätlese/Auslese. Immortal wines.</li>
                        <li><strong>Vintage Port:</strong> The longest-lived wine on earth.</li>
                    </ul>

                    <h2 className="text-3xl font-playfair font-bold text-emerald-200 mt-16 mb-6">4. Tools of the Trade</h2>
                    <p>
                        You cannot manage what you do not measure.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-emerald-400 block mb-1">CellarTracker</strong>
                            The gold standard community app for inventory management and tasting notes.
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-emerald-400 block mb-1">Wine-Searcher Pro</strong>
                            Essential for checking fair market value before you buy.
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-emerald-400 block mb-1">Coravin</strong>
                            Allows you to sample a bottle without pulling the cork. A game changer for collectors.
                        </li>
                    </ul>

                    <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-4 my-8">
                        <strong>Insurance Tip:</strong> Most homeowners insurance <em>does not</em> cover wine collections properly. Get a standalone policy from a specialist like Chubb or AIG if your collection exceeds $10,000.
                    </div>

                    <h2 className="text-3xl font-playfair font-bold text-emerald-200 mt-16 mb-6">Start Building Today</h2>
                    <p className="mb-8">
                        The best time to plant a vineyard was 20 years ago. The best time to start a collection is today. Start small, buy what you love, and protect it well.
                    </p>

                </article>
            </div>
        </main>
    );
}
