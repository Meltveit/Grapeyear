'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSending(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get('email'),
            message: formData.get('message'),
            subject: 'General Inquiry' // Only one type for now
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setSent(true);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to send message.');
        } finally {
            setSending(false);
        }
    }

    if (sent) {
        return (
            <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-lg text-center">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 flex flex-col items-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                        <h1 className="text-3xl font-playfair font-bold mb-4">Message Sent!</h1>
                        <p className="text-gray-300 mb-8">
                            Thank you for reaching out. We have received your message and will get back to you shortly.
                        </p>
                        <button
                            onClick={() => setSent(false)}
                            className="text-green-400 hover:text-green-300 font-bold"
                        >
                            Send another message
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-2xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-playfair font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-400">Questions? Feedback? Vintage tips? Let us know.</p>
                </header>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                                Your Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder="you@example.com"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                rows={6}
                                placeholder="How can we help you?"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600 resize-none"
                            ></textarea>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-900/10 p-4 rounded-lg border border-red-900/20">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : (
                                <>
                                    Send Message <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
