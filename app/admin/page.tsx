export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 font-playfair">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Regions</h3>
                    <div className="text-4xl font-bold">32</div>
                    <div className="mt-4 text-emerald-400 text-sm">Active & Monitored</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Vintages Logged</h3>
                    <div className="text-4xl font-bold">650+</div>
                    <div className="mt-4 text-purple-400 text-sm">Across 20 years</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Pending Reviews</h3>
                    <div className="text-4xl font-bold text-yellow-500">0</div>
                    <div className="mt-4 text-gray-400 text-sm">All caught up</div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-left transition-colors group">
                        <div className="font-bold mb-1 group-hover:underline">Add New Vintage</div>
                        <div className="text-xs text-purple-200">Manually input data</div>
                    </button>
                    <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors group">
                        <div className="font-bold mb-1 group-hover:underline">Run Weather Sync</div>
                        <div className="text-xs text-gray-400">Fetch latest Open-Meteo data</div>
                    </button>
                    <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors group">
                        <div className="font-bold mb-1 group-hover:underline">Generate Reports</div>
                        <div className="text-xs text-gray-400">Trigger AI summaries</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
