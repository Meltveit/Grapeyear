import type { Metadata } from 'next';
import Image from 'next/image';
import { GRAPE_VARIETIES } from '@/lib/grapes';
import Link from 'next/link';
import { ArrowLeft, Droplets, Thermometer, Mountain, Sprout } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Grape Varieties | Grapeyear',
    description: 'Explore the characteristics, climate preferences, and unique traits of the world\'s most famous wine grapes.',
};

export default function GrapesPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 pb-20">
            {/* Navbar simple override */}
            <nav className="p-6">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </nav>

            <div className="container mx-auto px-4">
                <header className="mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
                        Grape Varieties
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        Understand the personalities of the vines. Each variety has specific needs for heat, soil, and water to reach its perfect expression.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GRAPE_VARIETIES.map((grape) => (
                        <div key={grape.slug} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                            {/* Image Header */}
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
                                <Image
                                    src={grape.imageUrl}
                                    alt={grape.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <h2 className="text-2xl font-playfair font-bold">{grape.name}</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {grape.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                            <Thermometer className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Ideal Climate</h3>
                                            <p className="text-sm text-gray-200">{grape.idealClimate}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-stone-500/10 text-stone-400">
                                            <Mountain className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Soil Preference</h3>
                                            <p className="text-sm text-gray-200">{grape.soilPreference}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                            <Sprout className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-1">In The Glass</h3>
                                            <p className="text-sm text-gray-200 italic">{grape.characteristics}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-white/5">
                                        <h3 className="text-xs uppercase tracking-widest text-red-400 mb-1">Main Challenge</h3>
                                        <p className="text-sm text-gray-400">{grape.dislikes}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
