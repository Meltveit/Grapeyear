import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Wine, Map, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
                <div className="mb-10">
                    <Link href="/" className="font-playfair font-bold text-2xl text-purple-400 tracking-tighter">
                        Grapeyear Admin
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <div className="pt-4 pb-2 text-xs uppercase tracking-widest text-gray-500 font-bold">Content</div>
                    <Link href="/admin/countries" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Map size={20} />
                        Countries & Regions
                    </Link>
                    <Link href="/admin/wines" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Wine size={20} />
                        Wines & Vintages
                    </Link>

                    <div className="pt-4 pb-2 text-xs uppercase tracking-widest text-gray-500 font-bold">System</div>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings size={20} />
                        Settings
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-700">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                            {session.user?.name?.[0] || "A"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="truncate font-medium text-white">{session.user?.name}</div>
                            <div className="truncate text-xs">{session.user?.email}</div>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 mt-2 text-red-400 hover:text-red-300 transition-colors text-sm">
                        <LogOut size={16} />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-[#0a0a0a] overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
