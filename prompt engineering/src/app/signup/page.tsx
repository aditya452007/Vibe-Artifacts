'use client'

import { useActionState } from 'react'
import { signup } from '@/actions/auth'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 rounded-3xl bg-surface/30 backdrop-blur-xl border border-border/50 shadow-2xl"
      >
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-system-blue/10 text-system-blue mb-4">
                <Sparkles className="w-6 h-6" />
            </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Create Account</h1>
          <p className="text-canvas-subtext">Start engineering better prompts</p>
        </div>

        <form action={action} className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full px-5 py-3 rounded-xl bg-surface/50 border border-border/50 focus:border-system-blue/50 focus:ring-4 focus:ring-system-blue/10 outline-none transition-all placeholder:text-canvas-subtext"
              />
               {state?.errors?.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.email}</p>
              )}
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password (min 6 chars)"
                required
                className="w-full px-5 py-3 rounded-xl bg-surface/50 border border-border/50 focus:border-system-blue/50 focus:ring-4 focus:ring-system-blue/10 outline-none transition-all placeholder:text-canvas-subtext"
              />
               {state?.errors?.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.password}</p>
              )}
            </div>
          </div>

          {state?.message && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-2 rounded-lg">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full relative flex items-center justify-center gap-2 py-3.5 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-canvas-subtext">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
