import Link from 'next/link';
import { Grape } from 'lucide-react';
import EzoicPlaceholder from './EzoicPlaceholder';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050505] border-t border-white/10 py-12 md:py-16 text-sm">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand Column */}
                <div className="md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-4 group">
                        <div className="bg-gradient-to-br from-amber-400 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-serif font-bold group-hover:scale-110 transition-transform">
                            <Grape size={18} />
                        </div>
                        <span className="font-playfair font-bold text-xl tracking-tight text-white">
                            Grapeyear
                        </span>
                    </Link>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                        The Digital Terroir. Vintage intelligence driven by objective climate data for collectors and enthusiasts.
                    </p>
                    <div className="text-gray-600">
                        &copy; {currentYear} Grapeyear. All rights reserved.
                    </div>
                </div>

                {/* Navigation Column */}
                <div>
                    <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Explore</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="/vineyards" className="text-gray-400 hover:text-white transition-colors">Vineyards</Link></li>
                        <li><Link href="/compare" className="text-gray-400 hover:text-white transition-colors">Compare Vintages</Link></li>
                        <li><Link href="/vintages/france/bordeaux/2020" className="text-gray-400 hover:text-white transition-colors">Vintage Reports</Link></li>
                        <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
                    </ul>
                </div>

                {/* Resources Column */}
                <div>
                    <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Guides</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="/guides/making-wine" className="hover:text-amber-400 transition-colors">How to Make Wine</Link></li>
                        <li><Link href="/guides/collecting-wine" className="hover:text-amber-400 transition-colors">Collecting Wine</Link></li>
                    </ul>
                </div>

                {/* Legal Column */}
                <div>
                    <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Legal & Info</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                        <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                    </ul>
                </div>


            </div>

            <EzoicPlaceholder id={103} />
        </footer >
    );
}
