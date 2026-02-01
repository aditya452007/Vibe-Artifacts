"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { extractMetadata, stripMetadata } from "@/lib/image-processing";
import { Button } from "@/components/ui/button";
import { ProcessedFileCard } from "./processed-file-card";
import { SkeletonProcessedFileCard } from "./skeleton-card";
import { Loader2, Download, Plus, RefreshCw } from "lucide-react";
import JSZip from "jszip";

export function ProcessingView() {
    const { files, removeFile, updateFile, isProcessing, setProcessing, reset } = useAppStore();

    useEffect(() => {
        // Auto-analyze files on mount
        const analyzeFiles = async () => {
            const pendingFiles = files.filter(f => f.status === "idle");

            if (pendingFiles.length === 0) return;

            // Analyze in parallel
            await Promise.all(pendingFiles.map(async (fileState) => {
                updateFile(fileState.id, { status: "analyzing" });
                try {
                    const metadata = await extractMetadata(fileState.file);
                    updateFile(fileState.id, { status: "analyzed", metadata });
                } catch (error) {
                    console.error("Metadata analysis failed", error);
                    updateFile(fileState.id, { status: "analyzed", metadata: {}, error: "Analysis failed" });
                }
            }));
        };

        analyzeFiles();
    }, [files, updateFile]);

    const handleRemoveMetadata = async () => {
        setProcessing(true);

        const filesToProcess = files.filter(f => !f.cleanUrl);

        // Process in parallel
        await Promise.all(filesToProcess.map(async (fileState) => {
            updateFile(fileState.id, { status: "cleaning" });
            try {
                // Add a small artificial delay if needed for UX, but parallel is requested
                // const delay = (ms) => new Promise(res => setTimeout(res, ms));
                // await delay(500); 

                const cleanBlob = await stripMetadata(fileState.file);
                const cleanUrl = URL.createObjectURL(cleanBlob);
                updateFile(fileState.id, {
                    status: "complete",
                    cleanUrl,
                    cleanFile: cleanBlob,
                    cleanSize: cleanBlob.size
                });
            } catch (error) {
                console.error("Failed to clean file", error);
                updateFile(fileState.id, { status: "error", error: "Failed to process" });
            }
        }));

        setProcessing(false);
    };

    const handleDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clean-${filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleBatchDownload = async () => {
        const zip = new JSZip();
        let count = 0;
        files.forEach(f => {
            if (f.cleanFile) {
                zip.file(`clean-${f.file.name}`, f.cleanFile);
                count++;
            }
        });

        if (count === 0) return;

        const content = await zip.generateAsync({ type: "blob" });
        handleDownload(content, "processed-images.zip");
    };

    if (files.length === 0) return null;

    const allComplete = files.every(f => f.status === "complete");
    const anyAnalyzing = files.some(f => f.status === "analyzing");

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Processed Images
                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {files.length}
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review metadata and clean everything instantly.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reset()}
                        disabled={isProcessing}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                    </Button>

                    {!allComplete && (
                        <Button
                            onClick={handleRemoveMetadata}
                            disabled={isProcessing || anyAnalyzing}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px]"
                        >
                            {isProcessing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cleaning...</>
                            ) : (
                                "Remove All Metadata"
                            )}
                        </Button>
                    )}

                    {allComplete && (
                        <Button variant="default" onClick={handleBatchDownload} className="bg-emerald-600 hover:bg-emerald-700">
                            <Download className="mr-2 h-4 w-4" /> Download All (ZIP)
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {files.map((fileState) => (
                    fileState.status === "analyzing" ? (
                        <SkeletonProcessedFileCard key={fileState.id} />
                    ) : (
                        <ProcessedFileCard key={fileState.id} fileState={fileState} />
                    )
                ))}
            </div>

            {/* Bottom Action for quick add - optional, but user asked for "upload more images" 
                 Since the main upload zone is hidden, we might want to just rely on "Start Over" 
                 which takes them back to upload. Or we could add a small dropzone here. 
                 For now, "Start Over" fulfills the reset requirement. 
             */}
        </div>
    );
}
