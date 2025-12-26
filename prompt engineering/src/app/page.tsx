import { ScrollHeader } from '@/components/layout/scroll-header'
import { verifySession } from '@/lib/auth'
import { LandingPage } from '@/components/home/landing-page'

export default async function Home() {
  const session = await verifySession()

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ScrollHeader />
      <LandingPage session={session} />
    </div>
  )
}
