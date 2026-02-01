import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-[var(--surface)] bg-[var(--background)] py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row px-4">
                <p className="text-center text-sm leading-loose text-[var(--text-secondary)] md:text-left">
                    Built according to privacy-first principles. No data leaves your device.
                </p>
                <div className="flex gap-4 text-sm font-medium text-[var(--text-secondary)]">
                    <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-[var(--foreground)] transition-colors">How it works</Link>
                </div>
            </div>
        </footer>
    );
}
