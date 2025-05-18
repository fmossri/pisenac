'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HistoricoPaciente from '@/components/historyPacient'
import HistoricoMedico from '@/components/historyDoctor'
import { useSession } from 'next-auth/react'

export default function HistoryPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  console.log('Session:', session)
  
  return (
    <main className="bg-gray-50">
      {session.user.tipo === 1 ? (
        <HistoricoPaciente/>
        ) : (
          <HistoricoMedico/>
        )}
    </main>
  )
}
