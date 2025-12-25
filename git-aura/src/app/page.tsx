import ThemeToggle from '@/components/ThemeToggle';
import SingularityLogo from '@/components/landing/SingularityLogo';
import VisualizerInput from '@/components/landing/VisualizerInput';

export default function LandingPage() {
    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-[var(--void-bg)] overflow-hidden text-[var(--foreground)] selection:bg-[var(--neon-rust)] selection:text-black transition-colors duration-500">

            {/* Theme Toggle (Top Right) */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Atmospheric Depth (Mist/Noise) - Global */}
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay z-0" />

            {/* LEFT COL: Interaction (Flex Center) */}
            <section className="flex flex-col justify-center items-center p-12 relative z-10 border-r border-white/5">
                <div className="w-full max-w-xl flex flex-col gap-8">
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[var(--foreground)] to-gray-500">
                            GIT AURA
                        </h1>
                        <p className="text-sm md:text-base font-mono text-gray-500 tracking-[0.3em] uppercase">
                            Titan Edition / v2.0
                        </p>
                    </div>

                    <VisualizerInput />
                </div>

                {/* Footer Status */}
                <div className="absolute bottom-12 left-12 text-[10px] text-gray-500 font-mono tracking-widest uppercase pointer-events-none">
                    System Online /// Monitoring Qi Flow
                </div>
            </section>

            {/* RIGHT COL: Visual (Flex Center) */}
            <section className="hidden lg:flex justify-center items-center relative bg-black/5 dark:bg-black/20">
                {/* Radial Gradient for Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--void-bg)_120%)] pointer-events-none" />

                <SingularityLogo />
            </section>
        </main>
    );
}
