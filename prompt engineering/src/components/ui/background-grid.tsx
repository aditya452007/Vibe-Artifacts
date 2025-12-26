'use client'

import { useState, useEffect } from 'react'


export function BackgroundGrid() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="absolute inset-x-0 top-0 h-[80vh] overflow-hidden -z-10 bg-void pointer-events-none" />

    return (
        <div className="absolute inset-x-0 top-0 h-[100vh] overflow-hidden -z-10 bg-void pointer-events-none">
            {/* Grid Pattern - Increased Opacity for Visibility */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,128,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,128,0.4)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_0%,black_40%,transparent_80%)]"
            />

            {/* Bottom Curve Overlay - Creates the curved cut-off effect */}
            <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-void [mask-image:radial-gradient(ellipse_80%_70%_at_50%_100%,black_0%,transparent_100%)] pointer-events-none" />

            {/* Additional Blur for smooth blending */}
            <div className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[30vh] bg-void rounded-[100%] blur-3xl" />
        </div>
    )
}
