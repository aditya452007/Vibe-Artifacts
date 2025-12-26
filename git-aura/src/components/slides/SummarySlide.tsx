import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { GitHubData } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';

// --- Archetype Logic ---
const getDeveloperArchetype = (languages: { name: string, percentage: number }[]) => {
    const topLangs = languages.slice(0, 3).map(l => l.name.toLowerCase());
    const mainLang = topLangs[0] || "";

    if (mainLang.includes('python') || mainLang.includes('jupyter')) return { title: "AI Architect", gradient: "from-yellow-400 via-orange-500 to-red-500" };
    if (mainLang.includes('typescript') || mainLang.includes('javascript') || mainLang.includes('html')) return { title: "Frontend Virtuoso", gradient: "from-cyan-400 via-blue-500 to-indigo-500" };
    if (mainLang.includes('rust') || mainLang.includes('go') || mainLang.includes('c++')) return { title: "System Smith", gradient: "from-orange-400 via-red-500 to-purple-600" };
    if (mainLang.includes('java') || mainLang.includes('c#')) return { title: "Backend Titan", gradient: "from-red-500 via-rose-600 to-pink-600" };
    if (mainLang.includes('swift') || mainLang.includes('kotlin')) return { title: "Mobile Maestro", gradient: "from-indigo-400 via-purple-500 to-pink-500" };

    // Default Polyglot check
    if (languages.length > 4) return { title: "Polyglot Wizard", gradient: "from-emerald-400 via-teal-500 to-cyan-500" };

    return { title: "Code Artisan", gradient: "from-gray-200 via-gray-400 to-gray-600" };
};

export const SummarySlide = ({ data }: { data: GitHubData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    // Derived Rich Stats
    const totalStars = data.repositories.reduce((acc, repo) => acc + repo.stars, 0);
    const accountAge = new Date().getFullYear() - new Date(data.profile.createdAt).getFullYear();
    const topLanguage = data.languages[0] || { name: "Universal", color: "#fff" };

    const archetype = useMemo(() => getDeveloperArchetype(data.languages), [data.languages]);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            // Need to capture at high scale and proper style
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 4, // Ultra Quality
                style: { transform: 'scale(1)', background: 'transparent' } // Force clean capture
            });
            saveAs(dataUrl, `git-aura-${data.profile.username}-card.png`);
        } catch (err) {
            console.error('Download failed', err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--void-bg)] dark:bg-[#050505] text-[var(--foreground)] dark:text-white p-4 relative overflow-hidden transition-colors duration-500">
            {/* Cinematic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${archetype.gradient} opacity-20 blur-[150px] pointer-events-none transition-all duration-1000`} />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-lg">

                {/* 
                   THE CAPTURE CARD 
                   Glassmorphism Premium Style
                */}
                <motion.div
                    initial={{ rotateX: 20, opacity: 0, y: 50 }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                    className="perspective-1000 w-full flex justify-center"
                >
                    <div
                        ref={cardRef}
                        className="w-[400px] aspect-[4/5] bg-white/10 dark:bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/20 dark:border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col"
                    >
                        {/* Dynamic Top Gradient Mesh */}
                        <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl ${archetype.gradient} blur-[80px] opacity-40 rounded-full translate-x-1/2 -translate-y-1/2`} />
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 blur-[50px] rounded-full translate-y-1/2 -translate-x-1/2" />

                        {/* Content Grid */}
                        <div className="relative z-20 flex flex-col h-full p-8 text-center text-white">

                            {/* Header: Identity */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative w-24 h-24 mb-4 rounded-full p-1 bg-gradient-to-br from-white/20 to-white/5 border border-white/10 shadow-xl">
                                    <img
                                        src={data.profile.avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    {/* Verified Badge */}
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black/50 shadow-lg text-xs">
                                        ✨
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight mb-1 drop-shadow-md">{data.profile.username}</h2>
                                <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${archetype.gradient} shadow-lg shadow-purple-500/20`}>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/95 text-shadow-sm">{archetype.title}</span>
                                </div>
                            </div>

                            {/* Vital Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-2 flex-grow">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black"><MotionNumber value={data.contributions.totalCommits} /></span>
                                    <span className="text-[10px] sm:text-[9px] uppercase font-bold text-white/50 tracking-widest mt-1">Commits</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black"><MotionNumber value={totalStars} /></span>
                                    <span className="text-[10px] sm:text-[9px] uppercase font-bold text-white/50 tracking-widest mt-1">Impact (Stars)</span>
                                </div>
                                <div className="col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between px-6">
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white/90">{topLanguage.name}</div>
                                        <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Main Tech</div>
                                    </div>
                                    <div className="h-full w-px bg-white/10 mx-2" />
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-white/90">Lvl {accountAge}</div>
                                        <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Veteran</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Branding */}
                            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end opacity-70">
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] uppercase tracking-[0.2em] mb-1">Generated By</span>
                                    <span className="text-xs font-black tracking-wider">GIT—AURA</span>
                                </div>
                                <div className="h-6 w-6 rounded bg-white/10 flex items-center justify-center text-[10px]">
                                    ⚡
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 
                    Action Area (Independent of Card)
                */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={downloading}
                    className="relative w-full max-w-sm group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="relative px-8 py-4 bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center gap-3 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        {downloading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        )}
                        <span className="font-bold text-white tracking-wide">
                            {downloading ? 'Capturing Badge...' : 'Download Shareable Card'}
                        </span>
                    </div>
                </motion.button>

            </div>
        </div>
    );
};
