import React from 'react';
import { motion } from 'motion/react';
import { RepositorySummary } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const item = {
    hidden: { x: -50, opacity: 0 },
    show: { x: 0, opacity: 1 }
};

interface ReposSlideProps {
    repos: RepositorySummary[];
}

export const ReposSlide = ({ repos }: ReposSlideProps) => {
    // Logic: Calculate Top 3 Most Popular (Stars + Forks)
    // Handle case where repos might be undefined or empty
    const topRepos = (repos || [])
        .slice() // Create a shallow copy before sorting
        .sort((a, b) => (b.stars + b.forks) - (a.stars + a.forks))
        .slice(0, 3);

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center bg-[var(--void-bg)] dark:bg-[#02040a] text-[var(--foreground)] dark:text-white p-8 relative overflow-hidden transition-colors duration-500"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Ambient Aurora Background - Consistent with ContributionSlide */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/10 dark:from-cyan-900/10 via-transparent to-purple-500/10 dark:to-purple-900/10 pointer-events-none transition-colors duration-700" />
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

            {/* Animated Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none animate-pulse-glow" />

            <h2 className="relative z-10 text-5xl sm:text-7xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 tracking-tighter drop-shadow-sm text-center">
                KEY ARTIFACTS
            </h2>

            {/* Horizontal Layout: 3 Blocks */}
            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                {topRepos.map((repo, index) => (
                    <motion.a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={item}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="group relative flex flex-col justify-between p-6 sm:p-8 glass-card rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer"
                    >
                        {/* Subtle Gradient Tint on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${index === 0 ? 'from-cyan-400 to-blue-500' :
                                index === 1 ? 'from-purple-400 to-pink-500' :
                                    'from-amber-400 to-orange-500'
                            }`} />

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-2.5 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-black/5 dark:border-white/10 group-hover:scale-105 transition-transform duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    {repo.isPrivate ? 'PRIVATE' : 'PUBLIC'}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 tracking-tight" title={repo.name}>
                                {repo.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 font-medium leading-relaxed">
                                {repo.description || "No description provided."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5 mt-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: repo.langColor || '#888', color: repo.langColor || '#888' }}></span>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{repo.language}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-bold text-gray-700 dark:text-gray-200">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <MotionNumber value={repo.stars} />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                                    <MotionNumber value={repo.forks} />
                                </div>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};
