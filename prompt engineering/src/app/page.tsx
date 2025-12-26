import dynamic from 'next/dynamic'
import { ScrollHeader } from '@/components/layout/scroll-header'
import { verifySession } from '@/lib/auth'

const LandingPage = dynamic(() => import('@/components/home/landing-page').then(mod => mod.LandingPage), {
  ssr: true,
})

export default async function Home() {
  const session = await verifySession()

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ScrollHeader />
      <LandingPage session={session} />
    </div>
  )
}
