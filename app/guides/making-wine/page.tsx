import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'How to Start Making Wine | Grapeyear Guide',
    description: 'A comprehensive guide on how to start your winemaking journey. From selecting grapes to fermentation and bottling.',
};

export default function MakingWineGuide() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm mb-4 inline-block">&larr; Back to Home</Link>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">How to Start Making Wine</h1>
                    <p className="text-xl text-gray-300 font-light">
                        Every great bottle starts with a vision. Whether you have a backyard vineyard or just a kit in your garage, here is how to begin.
                    </p>
                </div>

                {/* Hero Image */}
                <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 border border-white/10">
                    <Image
                        src="/images/guides/making-wine.png"
                        alt="Winemaking process"
                        fill
                        className="object-cover bg-gray-900"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <h2>The Winemaking Process</h2>
                    <p>
                        Winemaking is both an art and a science. It requires patience, cleanliness, and a bit of daring.
                    </p>

                    <h3>1. Selecting Your Grapes</h3>
                    <p>
                        The quality of your wine is determined in the vineyard. If you are buying grapes, look for healthy, ripe bunches without mold.
                        Popular starter varieties include Cabernet Sauvignon for reds and Chardonnay for whites due to their resilience.
                    </p>

                    <h3>2. Crushing and Destemming</h3>
                    <p>
                        Once you have your grapes, the skins must be broken to release the juice. For red wines, the skins are kept for fermentation to add color and tannins.
                    </p>

                    <h3>3. Fermentation</h3>
                    <p>
                        This is where the magic happens. Yeast converts the sugar in the grape juice into alcohol and carbon dioxide. Temperature control is key here.
                    </p>

                    <div className="bg-white/5 p-6 rounded-xl border-l-4 border-purple-500 my-8">
                        <h4 className="text-lg font-bold text-white m-0 mb-2">Pro Tip</h4>
                        <p className="m-0 text-gray-300">Sanitization is the most critical part of winemaking. Ensure all your equipment is sterilized to prevent spoilage.</p>
                    </div>

                    <h3>4. Aging and Bottling</h3>
                    <p>
                        After fermentation, the wine needs to settle and age. This can be done in stainless steel tanks or oak barrels, depending on the style you want to achieve.
                    </p>

                    <hr className="border-white/10 my-10" />

                    <h2>Essential Equipment</h2>
                    <ul>
                        <li>Primary Fermenter (Food grade bucket)</li>
                        <li>Carboy (Glass vessel for secondary fermentation)</li>
                        <li>Airlock and Bung</li>
                        <li>Hydrometer (To measure sugar/alcohol)</li>
                        <li>Siphon tube and racking cane</li>
                    </ul>

                    <p>
                        <i>Ready to get started? Check out our recommended starter kits below.</i>
                    </p>

                    {/* Affiliate Placeholder */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 rounded-xl border border-white/10 mt-10 text-center">
                        <h3 className="text-2xl font-bold mb-4">Recommended Starter Kits</h3>
                        <p className="text-gray-400 mb-6">We have curated the best equipment for beginners.</p>
                        <button className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-bold transition-all">
                            View Recommendations (Coming Soon)
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
