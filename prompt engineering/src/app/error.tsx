'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface glass border border-border rounded-2xl p-8 shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-foreground">System Critical Error</h2>
        <p className="text-canvas-subtext mb-8 text-sm leading-relaxed">
          The cognitive architecture encountered an unexpected state. <br/>
          Reference: {error.digest || 'Unknown Fault'}
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-system-blue text-white rounded-xl font-medium hover:bg-system-blue/90 transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Reinitialize System
        </button>
      </motion.div>
    </div>
  )
}
