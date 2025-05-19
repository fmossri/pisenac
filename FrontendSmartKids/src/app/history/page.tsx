'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import History from '@/components/history'
export default function HistoryPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])
  
  return (
    <main className="flex-1 bg-gradient-to-b from-green-50 to-green-100 dark:from-black dark:to-gray-900 flex flex-col items-center pt-12 font-[family-name:var(--font-geist-sans)]">
      <History/>
    </main>
  )
}
