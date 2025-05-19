import Agendamento from '@/components/agendamento'
import ConfirmaConsulta from '@/components/confirmacao'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import Finalizacao from '@/components/finalizacao'

export default async function consultasPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('Nenhuma sessão encontrada, redirecionando para login');
    redirect('/auth/login')
  }

  return (
    <main className="flex-1 bg-gradient-to-b from-green-50 to-green-100 dark:from-black dark:to-gray-900 flex flex-col items-center pt-12 font-[family-name:var(--font-geist-sans)]">
      {session.user.tipo === 1 ? (
        <Agendamento/>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          <ConfirmaConsulta/>
          <Finalizacao/>
        </div>
      )}
    </main>
  )
}
