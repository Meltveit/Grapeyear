import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'How to Start Collecting Wine | Grapeyear Guide',
    description: 'Expert advice on building a wine collection. Learn about storage, provenance, and investment-grade vintages.',
};

export default function CollectingWineGuide() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href="/guides" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">&larr; Back to Guides</Link>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">How to Start Collecting Wine</h1>
                    <p className="text-xl text-gray-300 font-light">
                        Building a cellar is about more than just buying bottles. It is about curating history, flavor, and future value.
                    </p>
                </div>

                {/* Hero Image */}
                <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 border border-white/10">
                    <Image
                        src="/images/guides/collecting-wine.png"
                        alt="Wine Cellar"
                        fill
                        className="object-cover bg-gray-900"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <h2>The Philosophy of Collecting</h2>
                    <p>
                        Before you buy your first case, ask yourself: Are you collecting for investment, or for drinking? The best collections often balance both.
                    </p>

                    <h3>1. Proper Storage is Non-Negotiable</h3>
                    <p>
                        Wine is a living organism. To age gracefully, it needs:
                    </p>
                    <ul>
                        <li><strong>Temperature:</strong> Constant 12-14°C (55°F).</li>
                        <li><strong>Humidity:</strong> Around 70% to keep corks moist.</li>
                        <li><strong>Darkness:</strong> UV light damages wine.</li>
                        <li><strong>Stillness:</strong> Vibration disturbs the sediment.</li>
                    </ul>

                    <h3>2. Focus on Regions You Love</h3>
                    <p>
                        It is easy to get lost in the world of wine. Start with what you know. If you love Pinot Noir, dive deep into Burgundy or Oregon.
                        Vertical collections (same wine, different years) are a hallmark of a serious collector.
                    </p>

                    <h3>3. Provenance Matters</h3>
                    <p>
                        Where you buy is as important as what you buy. Ensures the wine has been stored correctly since leaving the winery.
                    </p>

                    <div className="bg-white/5 p-6 rounded-xl border-l-4 border-emerald-500 my-8">
                        <h4 className="text-lg font-bold text-white m-0 mb-2">Investment Tip</h4>
                        <p className="m-0 text-gray-300">Blue-chip wines from Bordeaux and Napa Valley have historically outperformed many traditional stock market indices.</p>
                    </div>

                    <h3>4. Determining Vintage Quality</h3>
                    <p>
                        Not every year is a vintage year. Use tools like <strong>Grapeyear</strong> to assess the climatic conditions of a vintage before investing.
                        A cooler year might produce wines that age longer than a hot year.
                    </p>

                    <hr className="border-white/10 my-10" />

                    <h2>Starting Your Cellar</h2>
                    <p>
                        You don't need a subterranean cave to start. A high-quality wine fridge is a perfect entry point.
                    </p>

                    <p>
                        <i>Looking for storage solutions?</i>
                    </p>

                    {/* Affiliate Placeholder */}
                    <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 p-8 rounded-xl border border-white/10 mt-10 text-center">
                        <h3 className="text-2xl font-bold mb-4">Recommended Wine Fridges</h3>
                        <p className="text-gray-400 mb-6">Protect your investment with professional cooling.</p>
                        <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold transition-all">
                            View Top Picks (Coming Soon)
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
