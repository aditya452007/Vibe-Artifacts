import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full transition-all duration-300">


            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 relative z-10">
                <Link
                    href="/"
                    className="group flex items-center gap-3 transition-opacity hover:opacity-90"
                    aria-label="MetaClear Home"
                >
                    <div className="relative overflow-hidden rounded-full shadow-md dark:shadow-lg border border-black/10 dark:border-white/10 w-10 h-10 bg-white/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/logo.png"
                            alt="MetaClear"
                            className="w-full h-full object-cover dark:filter-none filter drop-shadow-sm"
                        />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-[#1A1A1A] dark:text-white transition-colors duration-300 drop-shadow-none dark:drop-shadow-md">
                        MetaClear
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Optional: Add navigation links here if needed later */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
