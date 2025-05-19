'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function History() {
  const { data: session, status } = useSession();
  const [historicos, setHistoricos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchHistoricos = async () => {
        setLoading(true);
        setErro('');
        try {
          const res = await fetch(`/api/history?idUsuario=${session.user.id}`);
          if (!res.ok) throw new Error('Erro ao buscar históricos');
          const data = await res.json();
          setHistoricos(data);
        } catch (err) {
          setErro('Não foi possível carregar o histórico. Tente novamente mais tarde.');
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

  // Display logic based on user type
  const isPaciente = session.user.tipo === 1;

  // Sort historicos by dtAtendimento (most recent first)
  const sortedHistoricos = [...historicos].sort((a, b) => {
    const dateA = new Date(a.dtAtendimento).getTime();
    const dateB = new Date(b.dtAtendimento).getTime();
    return dateB - dateA;
  });

  return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-10 flex flex-col gap-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Histórico de Consultas
        </h1>

        {sortedHistoricos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {isPaciente
              ? 'Você ainda não possui consultas em seu histórico.'
              : 'Você ainda não possui agendamentos em seu histórico.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {sortedHistoricos.map((item) => {
              const now = new Date();
              const atendimentoDate = item.dtAtendimento ? new Date(item.dtAtendimento) : null;
              const isFinalizada =
                item.dtConfirmacao &&
                item.historico &&
                item.historico.trim().length > 0;

              let status = 'Aguardando Confirmação';
              if (isFinalizada) {
                status = 'Finalizada';
              } else if (item.dtConfirmacao) {
                status = 'Confirmada';
              }

              let statusClass =
                status === 'Finalizada'
                  ? 'bg-gray-200 text-gray-700'
                  : status === 'Confirmada'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700';

              return (
                <li
                  key={item.idHistorico}
                  className="flex flex-col border border-gray-200 rounded-xl p-4 shadow-sm bg-white dark:bg-[#1a1a1a]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {isPaciente
                          ? `Dr(a). ${item.profissional?.nome} ${item.profissional?.sobrenome}`
                          : `${item.paciente?.nome} ${item.paciente?.sobrenome}`}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {item.dtAtendimento
                          ? new Date(item.dtAtendimento).toLocaleString('pt-BR')
                          : 'Sem data de atendimento'}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full font-semibold text-sm capitalize ${statusClass}`}
                    >
                      {status}
                    </span>
                  </div>
                  {isFinalizada && item.historico && (
                    <p className="mt-2 text-gray-700 dark:text-gray-200 text-sm border-t border-gray-200 pt-2">
                      <span className="font-semibold">Histórico:</span> {item.historico}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
  );
}