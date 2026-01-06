'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wine, Calendar } from 'lucide-react';

export default function WinesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold font-playfair mb-8">Wines & Vintages</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Wines Section */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                            <Wine size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Wines Marketplace</h2>
                            <p className="text-sm text-gray-400">Manage wine bottles and descriptions</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link href="/admin/wines/new" className="block w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-center transition-colors">
                            Add New Wine
                        </Link>
                        <div className="text-center text-sm text-gray-500">
                            0 Wines in database
                        </div>
                    </div>
                </div>

                {/* Vintages Section */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
                            <Calendar size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Vintage Reports</h2>
                            <p className="text-sm text-gray-400">Climate data and year assessments</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="block w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-center transition-colors">
                            Generate Vintage Report (AI)
                        </button>
                        <div className="text-center text-sm text-gray-500">
                            650+ Vintages logged
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg text-sm text-purple-200">
                <strong>SEO Tip:</strong> You can now add "Keywords" to each wine. This helps users find specific styles (e.g. "Oaky", "Full-bodied", "Organic").
            </div>
        </div>
    );
}
