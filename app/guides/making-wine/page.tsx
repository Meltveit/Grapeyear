import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'How to Make Wine at Home: The Complete Guide (2025) | Grapeyear',
    description: 'Learn the art of home winemaking. A step-by-step guide covering equipment, grape selection, yeast types (EC-1118, RC-212), pH management, and proper filtration techniques.',
    keywords: ['making wine', 'home winemaking', 'wine yeast types', 'wine pH', 'wine filtration', 'winemaking guide'],
};

export default function MakingWineGuide() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href="/guides" className="text-purple-400 hover:text-purple-300 text-sm mb-4 inline-block">&larr; Back to Guides</Link>
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">How to Start Making Wine: From Grapes to Glass</h1>
                    <p className="text-xl text-gray-300 font-light leading-relaxed">
                        Winemaking is a dance between art and science. It requires patience, cleanliness, and a bit of daring. Whether you are crushing fresh grapes from the vineyard or starting with high-quality juice, this guide will walk you through the professional techniques used to create exceptional wine at home.
                    </p>
                </div>

                {/* Hero Image */}
                <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 border border-white/10">
                    <Image
                        src="/images/guides/making-wine.png"
                        alt="Winemaking process with grapes and barrels"
                        fill
                        className="object-cover bg-gray-900"
                    />
                </div>

                {/* Article Content */}
                <article className="prose prose-invert prose-lg max-w-none">

                    <h2 className="text-3xl font-playfair font-bold text-purple-200 mt-12 mb-6">1. The Essentials: What You Need</h2>
                    <p>
                        Before you start, you need the right tools. Sanitation is 90% of winemaking; if your equipment isn't clean, your wine will spoil. Avoid bleach (it causes cork taint) and use a dedicated sanitizer like <strong>Star San</strong>.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-purple-400 block mb-1">Primary Fermenter</strong>
                            Food-grade plastic bucket (7-8 gallons) with a lid.
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-purple-400 block mb-1">Carboy (Glass/PET)</strong>
                            6-gallon vessel for secondary fermentation and aging.
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-purple-400 block mb-1">Airlock & Bung</strong>
                            Allows CO2 to escape while keeping oxygen (and bugs) out.
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-purple-400 block mb-1">Hydrometer</strong>
                            Measures sugar content (Brix) and potential alcohol.
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-purple-400 block mb-1">pH Meter</strong>
                            Crucial for monitoring acidity (more on this later).
                        </li>
                        <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-purple-400 block mb-1">Auto-Siphon</strong>
                            For "racking" (moving) wine without disturbing sediment.
                        </li>
                    </ul>

                    <h2 className="text-3xl font-playfair font-bold text-purple-200 mt-16 mb-6">2. The Process: Step-by-Step</h2>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">Step 1: Prep & Crush</h3>
                    <p>
                        If using fresh grapes, you must <strong>destem and crush</strong> them. Stems contain harsh tannins that can make wine bitter. The goal is to break the skins to release the juice. This mixture of juice, skins, and seeds is called the <strong>Must</strong>.
                    </p>
                    <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4 italic">
                        <strong>Pro Tip:</strong> Add <em>Potassium Metabisulfite</em> (Campden tablets) right away to kill wild bacteria and let the must sit for 24 hours before adding yeast.
                    </div>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">Step 2: Analysis & Adjustment</h3>
                    <p>
                        Before fermentation, measure your stats.
                        <br />
                        <strong>Sugar (Brix):</strong> You want a specific gravity (SG) around 1.090 for a 12-13% ABV wine.
                        <br />
                        <strong>Acidity (pH):</strong> This is critical for stability.
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">Step 3: Primary Fermentation</h3>
                    <p>
                        Add your chosen yeast (see below). Keep the temperature stable (70-75°F for reds, cooler for whites). You will see vigorous bubbling. Stir the "cap" of skins down daily to extract color and prevent mold.
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">Step 4: Pressing & Racking</h3>
                    <p>
                        After 5-7 days, when the SG drops to around 1.000, fermentation slows. Press the skins to extract the last wine, then siphon (rack) the liquid into your glass carboy. Fill it to the neck to minimize oxygen exposure. Attach the airlock.
                    </p>

                    <h2 className="text-3xl font-playfair font-bold text-purple-200 mt-16 mb-6">3. Deep Dive: Choosing Your Yeast</h2>
                    <p>
                        Never rely on "bread yeast". Using the right strain gives you control over the flavor profile.
                    </p>
                    <table className="w-full text-left border-collapse my-6">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="py-2 text-purple-400">Yeast Strain</th>
                                <th className="py-2 text-purple-400">Best For</th>
                                <th className="py-2 text-purple-400">Characteristics</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            <tr className="border-b border-white/10">
                                <td className="py-3 font-semibold text-white">Lalvin EC-1118</td>
                                <td className="py-3">Everything (Sparkling, White, Late Harvest)</td>
                                <td className="py-3">The "workhorse". High alcohol tolerance (18%), neutral flavor, very robust.</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <td className="py-3 font-semibold text-white">Lalvin RC-212</td>
                                <td className="py-3">Pinot Noir, Light Reds</td>
                                <td className="py-3">Enhances structure and color stability. fruity and spicy notes.</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <td className="py-3 font-semibold text-white">Lalvin 71B</td>
                                <td className="py-3">Fruity Whites, Rosé, Nouveau styles</td>
                                <td className="py-3">Metabolizes properly malic acid, creating a smoother, softer wine.</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <td className="py-3 font-semibold text-white">Montrachet</td>
                                <td className="py-3">Full-bodied Chardonnay, Reds</td>
                                <td className="py-3">Vigorous, good for complex wines, but produces sulfides if stressed (needs nutrients).</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2 className="text-3xl font-playfair font-bold text-purple-200 mt-16 mb-6">4. The Science: pH and Filtration</h2>

                    <h3 className="text-2xl font-bold text-white mt-6 mb-2">Understanding pH</h3>
                    <p>
                        pH is the gatekeeper of wine quality. It controls color, sulfite effectiveness, and aging potential.
                        <br />
                        <strong>Target Range:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 mb-4">
                        <li><strong>White Wines:</strong> 3.0 – 3.3 (Crisp, fresh)</li>
                        <li><strong>Red Wines:</strong> 3.3 – 3.6 (Stable color, smoother)</li>
                    </ul>
                    <p>
                        Use a digital pH meter. If pH is too high (&gt;3.8), the wine tastes "flabby" and spoils easily (add Tartaric Acid). If too low (Start 3.0), it is tart (add Calcium Carbonate).
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-2">Filtration: Clarity vs. Flavor</h3>
                    <p>
                        Filtration is optional but highly recommended for brilliance. It removes yeast and prevents re-fermentation in the bottle.
                        Filters are rated in <strong>microns</strong>:
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 mb-4">
                        <li><strong>Coarse (6 microns):</strong> Removes visible sediment.</li>
                        <li><strong>Fine (1 micron):</strong> "Polishing" grade. Adds shine.</li>
                        <li><strong>Sterile (0.45 microns):</strong> Removes yeast and bacteria. Mandatory for sweet wines to prevent exploding bottles.</li>
                    </ul>
                    <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 my-4">
                        <strong>Note:</strong> Always filter from Coarse &rarr; Fine. Jumping straight to sterile will clog your pads instantly.
                    </div>

                    <h2 className="text-3xl font-playfair font-bold text-purple-200 mt-16 mb-6">Start Your Winemaking Journey</h2>
                    <p className="mb-8">
                        The best way to learn is to do. Start with a kit or a batch of juice, master the sanitation and fermentation steps, and soon you will be ready to tackle fresh grapes.
                    </p>

                    {/* Affiliate / CTA Section */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-12">
                        <h3 className="text-2xl font-bold mb-4">Recommended Starter Gear</h3>
                        <p className="text-gray-400 mb-6">We have curated the best equipment for beginners to start their journey correctly.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-black/40 rounded-lg text-center opacity-50 border border-dashed border-gray-700">
                                <span className="text-sm">Affiliate Link: Complete Starter Kit (North Mountain)</span>
                            </div>
                            <div className="p-4 bg-black/40 rounded-lg text-center opacity-50 border border-dashed border-gray-700">
                                <span className="text-sm">Affiliate Link: Digital pH Meter (Apera Instruments)</span>
                            </div>
                        </div>
                    </div>

                </article>
            </div>
        </main>
    );
}
