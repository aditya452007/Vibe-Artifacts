import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, List } from "lucide-react";

interface MetadataViewerProps {
    metadata: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    className?: string;
    compact?: boolean;
}

export function MetadataViewer({ metadata, className, compact = false }: MetadataViewerProps) {
    const keys = Object.keys(metadata);
    const [open, setOpen] = useState(false);

    if (keys.length === 0) {
        return <p className="text-sm text-[var(--text-secondary)] italic">No metadata detected.</p>;
    }

    // Default important keys to show in preview
    const importantKeys = ["Make", "Model", "Software", "DateTimeOriginal", "GPSLatitude", "GPSLongitude", "LensModel", "ExposureTime", "FNumber", "ISOSpeedRatings"];

    const displayEntries = Object.entries(metadata)
        .filter(([key]) => importantKeys.includes(key) || (typeof metadata[key] !== "object" && String(metadata[key]).length < 40))
        .slice(0, compact ? 5 : 8);

    return (
        <div className={cn("space-y-2", className)}>
            <div className="grid grid-cols-1 gap-2 text-xs">
                {displayEntries.map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-[var(--surface)] pb-1 last:border-0">
                        <span className="font-medium text-[var(--text-secondary)] truncate mr-2 max-w-[120px]" title={key}>{key}</span>
                        <span className="font-mono text-right truncate max-w-[150px]" title={String(value)}>{String(value)}</span>
                    </div>
                ))}
            </div>

            {(keys.length > displayEntries.length || !compact) && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-xs h-7 mt-2 text-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10">
                            <List className="mr-2 h-3 w-3" />
                            View All {keys.length} Tags
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Full Metadata Report</DialogTitle>
                            <DialogDescription>
                                Complete list of EXIF and metadata tags found in the image.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto mt-4 pr-2 border rounded-md bg-[var(--surface)] p-2" data-lenis-prevent>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[var(--surface-highlight)] text-[var(--text-secondary)] uppercase text-xs sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Tag Name</th>
                                        <th className="px-4 py-2 font-medium">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {Object.entries(metadata).map(([key, value]) => (
                                        <tr key={key} className="hover:bg-[var(--surface-highlight)]/50 transition-colors">
                                            <td className="px-4 py-2 font-medium text-[var(--text-secondary)] whitespace-nowrap">{key}</td>
                                            <td className="px-4 py-2 font-mono break-all text-xs">{
                                                typeof value === 'object' ? JSON.stringify(value) : String(value)
                                            }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
