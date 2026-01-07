export const metadata = {
    title: 'Contact Us | Grapeyear',
    description: 'Get in touch with the Grapeyear team.'
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <header className="mb-12">
                    <h1 className="text-4xl font-playfair font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-400">Questions? Feedback? Vintage tips?</p>
                </header>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <p className="text-lg text-gray-300 mb-6">
                        We are a small team of developers and wine lovers based in Norway.
                        The best way to reach us is via email.
                    </p>

                    <a href="mailto:admin@grapeyear.com" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                        admin@grapeyear.com
                    </a>

                    <p className="mt-8 text-sm text-gray-500">
                        We aim to respond to all inquiries within 48 hours.
                    </p>
                </div>
            </div>
        </main>
    );
}
