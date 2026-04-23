"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    Library,
    PlusSquare,
    Heart,
    Users,
    Calendar,
    Image as ImageIcon,
    Megaphone,
    UserCircle,
    ArrowLeftFromLine,
    ArrowRightFromLine,
    Disc,
    LayoutGrid
} from "lucide-react";

import SearchModal from "@/components/ui/SearchModal";

// Mapping Icon Lucide biar keren
// Kita group menu biar kayak Spotify
const mainMenu = [
    { href: "/", label: "Home", icon: Home },
    { href: "#search", label: "Cari", icon: Search },
    { href: "/profil", label: "Profil Kelas", icon: Library },
];

const playlistMenu = [
    { href: "/siswa", label: "Data Siswa", icon: Users },
    { href: "/jadwal", label: "Jadwal", icon: Calendar },
    { href: "/bangku", label: "Denah Bangku", icon: LayoutGrid },
    { href: "/pengumuman", label: "Papan Info", icon: Megaphone },
    { href: "/galeri", label: "Galeri", icon: ImageIcon },
    { href: "/wali-kelas", label: "Wali Kelas", icon: UserCircle },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Shortcut Ctrl+K / Cmd+K for Search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Update variable layout --sidebar-width saat collapsed berubah
    useEffect(() => {
        const root = document.documentElement;
        if (isCollapsed) {
            root.style.setProperty('--sidebar-width', '80px');
        } else {
            root.style.setProperty('--sidebar-width', '256px');
        }
    }, [isCollapsed]);

    // Widget: Random Dino Fact atau Quote
    const dinoFacts = [
        "T-Rex punya gigitan terkuat!",
        "Stegosaurus punya otak sebesar kenari.",
        "Velociraptor sebenarnya berbulu.",
        "8B adalah predator puncak sekolah.",
        "Jangan lupa PR Matematika!",
        "Piket hari ini siapa?",
        "Solidaritas tanpa batas!",
        "Dino pun butuh istirahat.",
        "Sekolah itu seru, kalau ada wifi."
    ];
    const [randomFact, setRandomFact] = useState("");

    useEffect(() => {
        setRandomFact(dinoFacts[Math.floor(Math.random() * dinoFacts.length)]);
    }, []);

    const NavItem = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        // Handle click khusus untuk Search
        const handleClick = (e: React.MouseEvent) => {
            if (item.href === "#search") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        if (isMobile) {
            return (
                <Link
                    href={item.href}
                    onClick={handleClick}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? "text-white" : "text-[#b3b3b3] hover:text-white"}`}
                >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium truncate max-w-[64px]">{item.label}</span>
                </Link>
            )
        }

        return (
            <Link
                href={item.href}
                onClick={handleClick}
                className={`
                    flex items-center gap-4 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 group relative
                    ${isActive
                        ? "text-white bg-[#282828]" // Active
                        : "text-[#b3b3b3] hover:text-white" // Inactive
                    }
                    ${isCollapsed ? "justify-center px-2" : ""}
                `}
                title={isCollapsed ? item.label : ""}
            >
                <Icon size={24} className={isActive ? "text-white" : "text-[#b3b3b3] group-hover:text-white"} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isCollapsed && isActive && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
            </Link>
        );
    };

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* ================= DESKTOP SIDEBAR (Left) ================= */}
            <aside
                className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-black z-50 pt-6 px-2 pb-24 transition-[width] duration-300 ease-in-out border-r border-[#282828] overflow-hidden`}
                style={{ width: isCollapsed ? '80px' : '256px' }}
            >
                {/* Logo Area */}
                <div className={`flex items-center gap-2 mb-8 group transition-all duration-300 ${isCollapsed ? "justify-center px-0 cursor-pointer scale-90" : "px-4"}`} onClick={() => isCollapsed && setIsCollapsed(false)}>
                    <Link href="/" className="text-3xl hover:scale-110 transition-transform block">🦕</Link>
                    {!isCollapsed && (
                        <Link href="/" className="flex flex-col opacity-100 transition-opacity duration-300 min-w-max">
                            <span className="text-xl font-bold font-heading text-white tracking-tight">Eight Brachonyxx</span>
                            <span className="text-xs text-gray-400 font-medium">Spotify User Interface</span>
                        </Link>
                    )}
                </div>

                {/* Main Menu */}
                <div className="flex flex-col gap-1 px-2 mb-6">
                    {mainMenu.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </div>

                {/* Library/Playlist Section */}
                <div className="flex-1 px-2 overflow-y-auto no-scrollbar flex flex-col">
                    {!isCollapsed && (
                        <div className="flex items-center justify-between px-4 mb-2 text-[#b3b3b3] hover:text-white cursor-pointer group whitespace-nowrap">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <Library size={24} />
                                <span>Your Library</span>
                            </div>
                            <PlusSquare size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}

                    {/* Filter Tags (Only if expands) */}
                    {!isCollapsed && (
                        <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
                            <span className="px-3 py-1 bg-[#282828] rounded-full text-xs font-medium text-white whitespace-nowrap cursor-pointer hover:bg-[#3E3E3E]">Playlists</span>
                            <span className="px-3 py-1 bg-[#282828] rounded-full text-xs font-medium text-white whitespace-nowrap cursor-pointer hover:bg-[#3E3E3E]">Artists</span>
                        </div>
                    )}

                    {/* The "Playlists" (Menu Lainnya) */}
                    <div className="flex flex-col gap-1">
                        {playlistMenu.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </div>

                    {/* WIDGET: Agar tidak hampa (Only Expanded) */}
                    {!isCollapsed && (
                        <div className="mt-auto mb-4 mx-2 p-4 bg-gradient-to-br from-[#121212] to-[#1e1e1e] rounded-xl border border-[#282828] relative group overflow-hidden animate-fade-in">
                            <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                <Disc size={16} className="animate-spin-slow text-[#1DB954]" />
                            </div>
                            <h4 className="text-xs font-bold text-[#1DB954] mb-1 font-heading">Dino Fact 🦖</h4>
                            <p className="text-xs text-[#b3b3b3] leading-relaxed italic">
                                "{randomFact}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Visualizer & Collapse Button Area */}
                <div className="mt-auto flex flex-col items-center gap-4 mb-4 pt-4 border-t border-[#282828]/50">
                    {/* Visualizer (Simple CSS Bars) */}
                    <div className="flex items-end gap-1 h-6">
                        <div className="w-1 bg-[#1DB954] animate-[bounce_1s_infinite] h-[40%]" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 bg-[#1DB954] animate-[bounce_1.2s_infinite] h-[70%]" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 bg-[#1DB954] animate-[bounce_0.8s_infinite] h-[50%]" style={{ animationDelay: '0.2s' }}></div>
                        {!isCollapsed && (
                            <>
                                <div className="w-1 bg-[#1DB954] animate-[bounce_1.1s_infinite] h-[80%]" style={{ animationDelay: '0.3s' }}></div>
                                <div className="w-1 bg-[#1DB954] animate-[bounce_0.9s_infinite] h-[60%]" style={{ animationDelay: '0.4s' }}></div>
                            </>
                        )}
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded-full transition-colors"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ArrowRightFromLine size={20} /> : <ArrowLeftFromLine size={20} />}
                    </button>
                </div>

            </aside>


            {/* ================= MOBILE BOTTOM BAR ================= */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#121212]/95 backdrop-blur-lg border-t border-[#282828] z-50 flex items-center overflow-x-auto no-scrollbar px-2 gap-1 touch-pan-x">
                {/* Scrollable Mobile Menu */}
                <NavItem item={mainMenu[0]} isMobile /> {/* Home */}
                <NavItem item={mainMenu[1]} isMobile /> {/* Cari */}
                <NavItem item={playlistMenu[0]} isMobile /> {/* Siswa (Data Siswa) */}
                <NavItem item={playlistMenu[1]} isMobile /> {/* Jadwal */}
                <NavItem item={playlistMenu[2]} isMobile /> {/* Bangku */}
                <NavItem item={{ href: "/galeri", label: "Galeri", icon: ImageIcon }} isMobile />
                <NavItem item={{ href: "/pengumuman", label: "Info", icon: Megaphone }} isMobile />
                <NavItem item={{ href: "/profil", label: "Profil", icon: UserCircle }} isMobile />
            </nav>
        </>
    );
}
