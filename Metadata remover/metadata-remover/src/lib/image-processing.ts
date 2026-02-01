import exifr from "exifr";

const formatValue = (key: string, value: any): string | number => {
    if (value instanceof Date) return value.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (value instanceof Number) return Number(value);
    if (Array.isArray(value)) {
        if (value.length > 3 && typeof value[0] === 'number') return `[Binary Data ${value.length} bytes]`;
        return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
        if (value.constructor && value.constructor.name === "Uint8Array") return "[Binary Data]";
        return JSON.stringify(value);
    }
    if (typeof value === 'string' && value.length > 100) return value.substring(0, 100) + "...";

    return String(value);
};

export async function extractMetadata(file: File): Promise<Record<string, any>> { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
        const output = await exifr.parse(file, {
            tiff: true,
            exif: true,
            gps: true,
            iptc: true,
            xmp: true,
            icc: true,
            jfif: true,
            makerNote: false, // often causes issues or is just binary
            userComment: true
        });

        if (!output) return {};

        const formatted: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(output)) {
            if (value === undefined || value === null) continue;
            formatted[key] = formatValue(key, value);
        }

        return formatted;
    } catch (error) {
        console.warn("Metadata extraction failed", error);
        return {};
    }
}

export async function stripMetadata(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            // Determine format
            const type = file.type;
            // Default quality 0.92 for jpeg to minimize artifacting while stripping metadata
            // For PNG it's lossless anyway
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Canvas to Blob conversion failed"));
                    }
                },
                type,
                type === "image/jpeg" ? 0.95 : undefined
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };

        img.src = url;
    });
}
