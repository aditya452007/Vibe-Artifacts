import { create } from "zustand";

export interface ProcessedFile {
    id: string;
    file: File;
    previewUrl: string;
    status: "idle" | "analyzing" | "analyzed" | "cleaning" | "complete" | "error";
    metadata: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    cleanUrl?: string; // Blob URL of cleaned image
    cleanFile?: Blob;
    originalSize: number;
    cleanSize?: number;
    error?: string;
}

interface AppState {
    files: ProcessedFile[];
    isProcessing: boolean;

    addFiles: (files: File[]) => void;
    removeFile: (id: string) => void;
    updateFile: (id: string, updates: Partial<ProcessedFile>) => void;
    reset: () => void;
    setProcessing: (isProcessing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    files: [],
    isProcessing: false,

    addFiles: (newFiles) => {
        const fileObjects = newFiles.map((file) => ({
            id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
            file,
            previewUrl: URL.createObjectURL(file),
            status: "idle" as const,
            metadata: {},
            originalSize: file.size,
        }));

        set((state) => ({
            files: [...state.files, ...fileObjects],
        }));
    },

    removeFile: (id) =>
        set((state) => {
            const fileToRemove = state.files.find(f => f.id === id);
            if (fileToRemove?.previewUrl) URL.revokeObjectURL(fileToRemove.previewUrl);
            if (fileToRemove?.cleanUrl) URL.revokeObjectURL(fileToRemove.cleanUrl);
            return { files: state.files.filter((f) => f.id !== id) };
        }),

    updateFile: (id, updates) =>
        set((state) => ({
            files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),

    reset: () => set({ files: [], isProcessing: false }),
    setProcessing: (isProcessing) => set({ isProcessing }),
}));
