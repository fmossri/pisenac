'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react';

interface Agendamento {
  id: number
  dataHora: string
  status: 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO' | 'REAGENDADO'
  paciente: {
    email: string
  }
}

export default function HistoricoAtendimentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const { data: session } = useSession();

  const fetchHistorico = async () => {
    const res = await fetch(`http://localhost:3001/historico/${session.user.id}`, {
      method: 'GET'
    })
    const data = await res.json()
    setAgendamentos(data)
  }

  useEffect(() => {
    fetchHistorico()
  }, [])

  const cancelar = async (id: number) => {
    const res = await fetch(`http://localhost:3001/historico/${session.user.id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      toast.success('Agendamento cancelado.')
      fetchHistorico()
    } else {
      toast.error('Erro ao cancelar agendamento.')
    }
  }

  const reagendar = async (id: number) => {
    const novaData = prompt('Informe nova data e hora (yyyy-MM-dd HH:mm):')
    if (!novaData) return

    const res = await fetch(`/api/agendamento/${id}/reagendar`, {
      method: 'PATCH',
      body: JSON.stringify({ novaData }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      toast.success('Agendamento reagendado.')
      fetchHistorico()
    } else {
      toast.error('Erro ao reagendar agendamento.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Atendimentos</h1>
      {agendamentos.length === 0 ? (
        <p className="text-gray-500">Nenhum atendimento encontrado.</p>
      ) : (
        agendamentos.map((item) => (
          <div key={item.id} className="bg-white shadow p-4 rounded mb-4">
            <p><strong>Paciente:</strong> {item.paciente.email}</p>
            <p><strong>Data:</strong> {format(new Date(item.dataHora), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</p>
            <p><strong>Status:</strong> {item.status}</p>

            {item.status === 'CONFIRMADO' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => cancelar(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => reagendar(item.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Reagendar
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
