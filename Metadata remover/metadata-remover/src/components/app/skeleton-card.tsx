import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProcessedFileCard() {
    return (
        <Card className="overflow-hidden h-[300px] grid grid-cols-2">
            {/* Left Image Skeleton */}
            <div className="h-full bg-muted/20 animate-pulse relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>

            {/* Right Content Skeleton */}
            <CardContent className="p-4 flex flex-col space-y-4 h-full">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>

                <div className="space-y-2 flex-1 pt-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>

                <div className="pt-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}
