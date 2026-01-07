export const metadata = {
    title: 'Privacy Policy | Grapeyear',
    description: 'Privacy Policy and Terms of Service for Grapeyear.'
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="mb-12">
                    <h1 className="text-4xl font-playfair font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>
                            At Grapeyear, we respect your privacy. This policy explains how we handle information when you visit our website.
                            By using Grapeyear, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Data Collection (Vercel Analytics)</h2>
                        <p>
                            We use <strong>Vercel Analytics</strong> to understand how our website is used (e.g., page views, page speed, visitor countries).
                            Vercel Analytics collects anonymized data and does not track individual users across the web. It respects visitor privacy and often does not require cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Advertising (Google AdSense)</h2>
                        <p>
                            We use <strong>Google AdSense</strong> to display advertisements. Google and its partners uses cookies (like the DoubleClick cookie) to serve ads based on your visit to this site and/or other sites on the Internet.
                        </p>
                        <p className="mt-2">
                            You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting <a href="https://adssettings.google.com" className="text-blue-400 hover:underline">Google Ads Settings</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
                        <p>
                            Cookies are files with small amount of data which may include an anonymous unique identifier. Do not eat them (unless they go well with a Riesling).
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: admin@grapeyear.com
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
