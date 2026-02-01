import { useState } from "react";
import { ProcessedFile, useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetadataViewer } from "./metadata-viewer";
import { CheckCircle, Trash2, Download, Eye, EyeOff, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProcessedFileCardProps {
    fileState: ProcessedFile;
}

export function ProcessedFileCard({ fileState }: ProcessedFileCardProps) {
    const { removeFile } = useAppStore();
    const [showOriginal, setShowOriginal] = useState(false);

    const handleDownloadSingle = () => {
        if (!fileState.cleanFile) return;
        const url = URL.createObjectURL(fileState.cleanFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clean-${fileState.file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const hasCleaned = !!fileState.cleanUrl;
    // Show original if explicitly requested
    const currentUrl = (hasCleaned && !showOriginal) ? fileState.cleanUrl! : fileState.previewUrl;

    const isShowingOriginal = showOriginal || !hasCleaned;

    return (
        <Card className="overflow-hidden flex flex-col md:grid md:grid-cols-2 h-auto md:h-[400px] group/card transition-all hover:shadow-md border-muted/40">
            {/* Left Column: Image Preview */}
            <div className="relative h-[250px] md:h-full bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={currentUrl}
                    alt="Preview"
                    className={cn(
                        "object-cover w-full h-full transition-all duration-300",
                        isShowingOriginal ? "scale-100 opacity-100" : "scale-105 opacity-100"
                    )}
                />

                {/* Overlay Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <Badge variant={isShowingOriginal ? "destructive" : "default"} className={cn(
                        "backdrop-blur-md shadow-sm transition-colors duration-300",
                        isShowingOriginal ? "bg-red-500/90 hover:bg-red-500/90 text-white" : "bg-emerald-500/90 hover:bg-emerald-500/90 text-white"
                    )}>
                        {isShowingOriginal ? (
                            <><ShieldAlert className="w-3 h-3 mr-1" /> Original (Metadata Present)</>
                        ) : (
                            <><ShieldCheck className="w-3 h-3 mr-1" /> Cleaned (Safe)</>
                        )}
                    </Badge>
                </div>

                {/* Secure / Warning Overlay Effect */}
                {isShowingOriginal && (
                    <div className="absolute inset-0 border-[6px] border-red-500/20 pointer-events-none animate-pulse" />
                )}

                {/* Controls Overlay */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                    {hasCleaned && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className={cn(
                                "h-9 px-3 backdrop-blur-md transition-all shadow-sm border",
                                showOriginal
                                    ? "bg-red-500/20 border-red-500/50 text-red-100 hover:bg-red-500/30"
                                    : "bg-black/40 border-white/10 text-white hover:bg-black/60"
                            )}
                            onMouseDown={() => setShowOriginal(true)}
                            onMouseUp={() => setShowOriginal(false)}
                            onMouseLeave={() => setShowOriginal(false)}
                            onTouchStart={() => setShowOriginal(true)}
                            onTouchEnd={() => setShowOriginal(false)}
                        >
                            {showOriginal ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            {showOriginal ? "Release to Hide" : "Hold to Compare"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Right Column: Details & Metadata */}
            <CardContent className="flex flex-col h-full p-0 overflow-hidden bg-card">
                {/* Header */}
                <div className="p-4 border-b border-border bg-muted/5 flex justify-between items-start shrink-0">
                    <div className="overflow-hidden pr-2">
                        <h3 className="font-semibold text-sm truncate" title={fileState.file.name}>
                            {fileState.file.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{(fileState.originalSize / 1024).toFixed(1)} KB</span>
                            {fileState.cleanSize && (
                                <>
                                    <span>→</span>
                                    <span className="text-emerald-600 font-medium">{(fileState.cleanSize / 1024).toFixed(1)} KB</span>
                                </>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(fileState.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Metadata List - Scrollable */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4" data-lenis-prevent>
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>{hasCleaned ? "Metadata Status" : "Detected Metadata"}</span>
                            {hasCleaned && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                        </p>

                        {hasCleaned ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-sm text-emerald-700 dark:text-emerald-400">
                                    <p className="flex items-center font-medium mb-1">
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Metadata Stripped
                                    </p>
                                    <p className="text-xs opacity-90">
                                        All EXIF, GPS, and device data has been permanently removed from this file.
                                    </p>
                                </div>
                                <div className="opacity-50 grayscale pointer-events-none select-none">
                                    <MetadataViewer metadata={fileState.metadata} compact />
                                </div>
                            </div>
                        ) : (
                            <MetadataViewer metadata={fileState.metadata} />
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-muted/5 shrink-0 mt-auto">
                    {hasCleaned ? (
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            onClick={handleDownloadSingle}
                        >
                            <Download className="mr-2 h-4 w-4" /> Download Clean Image
                        </Button>
                    ) : (
                        <div className="text-xs text-center text-muted-foreground italic py-2">
                            Ready to process...
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
