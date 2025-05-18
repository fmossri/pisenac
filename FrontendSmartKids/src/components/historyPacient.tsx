'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const statusColors = {
  confirmada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  reagendada: 'bg-orange-100 text-orange-700',
  realizada: 'bg-blue-100 text-blue-700',
};

export default function HistoricoMedico() {
  const { data: session, status } = useSession();
  const [historicos, setHistoricos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchHistoricos = async () => {
        try {
          const res = await fetch(`http://localhost:3001/historico/${session.user.id}`);
          if (!res.ok) throw new Error('Erro ao buscar históricos');
          const data = await res.json();
          setHistoricos(data);
        } catch (err: any) {
          setErro(err.message || 'Erro desconhecido');
        } finally {
          setLoading(false);
        }
      };

      fetchHistoricos();
    }
  }, [session, status]);

  if (status === 'loading' || loading) return <p className="text-center mt-10">Carregando históricos...</p>;
  if (status === 'unauthenticated') return <p className="text-center text-red-500 mt-10">Usuário não autenticado.</p>;
  if (erro) return <p className="text-red-500 text-center mt-10">{erro}</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Histórico de Pacientes</h1>

        {historicos.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum histórico encontrado.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {historicos.map((item) => {
              const dataFormatada = new Date(item.dtAtendimento || item.dtAgendamento).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const status = item.dtAtendimento
                ? 'realizada'
                : item.dtConfirmacao
                ? 'confirmada'
                : 'reagendada';

              return (
                <li
                  key={item.idHistorico}
                  className="flex justify-between items-center border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                >
                  <div>
                    <p className="font-semibold text-gray-800">Paciente #{item.Paciente}</p>
                    <p className="text-gray-600 text-sm">{dataFormatada}</p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full font-semibold text-sm capitalize ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
