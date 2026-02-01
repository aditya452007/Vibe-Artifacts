"use client";

import * as React from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadCloud, FileImage, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
    onFilesSelected: (files: File[]) => void;
    className?: string;
    maxFiles?: number; // default unlimited
    maxSize?: number; // 20MB default
}

export function UploadZone({
    onFilesSelected,
    className,
    maxFiles = 0,
    maxSize = 20 * 1024 * 1024,
}: UploadZoneProps) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFilesSelected(acceptedFiles);
            }
        },
        [onFilesSelected]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        maxSize,
        maxFiles: maxFiles > 0 ? maxFiles : undefined,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/heic": [],
        },
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
                // Light/Dark mode: Visible Dashed Border (Primary color with opacity for premium separation)
                "bg-[var(--surface)] border-[var(--primary)]/25",
                // Hover state: Darker/Stronger border + Shadow
                "hover:border-[var(--accent)] hover:shadow-2xl hover:shadow-[var(--accent)]/10 hover:bg-[var(--background)]",
                // Drag active state
                isDragActive && "border-[var(--accent)] bg-[var(--accent)]/10 scale-[1.01] shadow-xl",
                className
            )}
        >
            <input {...getInputProps()} />

            {/* Gradient Glow Effect on Hover - Gold/Neutral */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center p-12">
                <div className={cn(
                    "mb-6 rounded-2xl p-4 transition-all duration-300 shadow-sm",
                    "bg-[var(--background)] text-[var(--accent)]",
                    "group-hover:scale-110 group-hover:shadow-md group-hover:text-[var(--primary)]"
                )}>
                    <UploadCloud className="h-10 w-10" />
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {isDragActive ? "Drop images now" : "Upload Images"}
                </h3>

                <p className="mb-8 text-sm text-[var(--muted-foreground)] max-w-xs text-center">
                    Drag & drop your files here, or click to browse.
                    <br />
                    <span className="text-xs opacity-70 mt-1 block">Supports JPG, PNG, WebP up to 20MB</span>
                </p>

                <Button
                    variant="default" // Using default primary button styles now that globals are fixed
                    className="pointer-events-none shadow-lg shadow-[var(--primary)]/20 px-8"
                >
                    Select Files
                </Button>

                {fileRejections.length > 0 && (
                    <div className="mt-6 flex flex-col gap-2 text-sm text-red-500 bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg w-full">
                        {fileRejections.map(({ file, errors }) => (
                            <div key={file.name} className="flex items-center gap-2 justify-center">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span className="truncate max-w-[200px] font-medium">
                                    {file.name}: {errors[0].message}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
