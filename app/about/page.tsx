export const metadata = {
    title: 'About Grapeyear | The Digital Terroir',
    description: 'Grapeyear is the world\'s first objective climate intelligence platform for fine wine. We democratize vintage data for collectors and investors.'
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl font-playfair font-bold mb-6 bg-gradient-to-r from-amber-200 to-purple-400 bg-clip-text text-transparent">
                        The Digital Terroir
                    </h1>
                    <p className="text-xl text-gray-400 font-serif italic">
                        "Great wine is made in the vineyard. We just measure the weather that made it happen."
                    </p>
                </header>

                <div className="space-y-12 text-gray-300 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p>
                            For centuries, knowledge about wine vintages was locked away in the heads of local farmers or behind the paywalls of elite critics.
                            <strong>Grapeyear</strong> exists to democratize this data.
                        </p>
                        <p className="mt-4">
                            We believe that <em>objective climate data</em>—rainfall, temperature, sunlight hours—tells the true story of a vintage long before the first bottle is uncorked.
                            Our mission is to give collectors, investors, and enthusiasts the raw intelligence they need to make smarter wine decisions.
                        </p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">How it Works</h2>
                        <ul className="space-y-4 list-disc pl-6">
                            <li><strong>Data Aggregation:</strong> We process millions of weather data points from global stations in top wine regions.</li>
                            <li><strong>The Algorithm:</strong> Our proprietary 'Grapeyear Score' analyzes Growing Degree Days (GDD), Diurnal Range, and Rainfall timing to objectively rate vintage potential.</li>
                            <li><strong>Transparency:</strong> No biases, no pay-to-play. Just pure numbers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Who looks at weather charts for fun?</h2>
                        <p>
                            We do. And we think you should too. Because in a world of changing climates, the old rules of "good years" and "bad years" are being rewritten.
                            Grapeyear is your navigator in this new landscape.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
