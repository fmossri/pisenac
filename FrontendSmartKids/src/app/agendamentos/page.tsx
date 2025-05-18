import Agendamento from '@/components/agendamento'
import ConfirmaConsulta from '@/components/confirmacao'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function consultasPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  } else {
    console.log('Session:', session.user)
  }
  return (
    <main className="bg-gray-50">
      {session.user.tipo === 1 ? (
        <Agendamento/>
        ) : (
          <ConfirmaConsulta/>
        )}
      
    </main>
  )
}
