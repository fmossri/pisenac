'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ConfirmaConsulta() {
  const { data: session, status } = useSession();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const fetchConsultas = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/history?idUsuario=' + session.user?.id, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setConsultas(data.filter((consulta: any) => !consulta.dtConfirmacao));
      } catch (error) {
        setMensagem('Erro ao buscar consultas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, []);

  const handleConfirmarConsulta = async (idHistorico: number) => {
    setLoading(true);
    setMensagem('Confirmando consulta...');

    try {
      const consulta = consultas.find(c => c.idHistorico === idHistorico);
      if (!consulta) {
        setMensagem('Consulta não encontrada.');
        return;
      }

      const now = new Date();
      const data = now.toISOString().split('T')[0];
      const hora = now.toTimeString().slice(0, 5);
      const dtConfirmacao = `${data}T${hora}:00`;

      const response = await fetch(`/api/confirmacao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idHistorico: idHistorico,
          Paciente: consulta.Paciente,
          Profissional: consulta.Profissional,
          dtConfirmacao,
          dtAtendimento: consulta.dtAtendimento,
          historico: null
        }),
      });

      if (response.ok) {
        setConsultas(consultas.filter((consulta) => consulta.idHistorico !== idHistorico));
        setMensagem('Consulta confirmada com sucesso!');
      } else {
        const errorData = await response.json();
        setMensagem(errorData.error || 'Erro ao confirmar consulta. Tente novamente.');
      }
    } catch (err) {
      console.error('Error:', err);
      setMensagem('Erro ao confirmar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarConsulta = async (idHistorico: number) => {
    setLoading(true);
    setMensagem('Cancelando consulta...');

    try {
      const response = await fetch(`/api/confirmacao?idHistorico=${idHistorico}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setConsultas(consultas.filter((consulta) => consulta.idHistorico !== idHistorico));
        setMensagem('Consulta cancelada com sucesso!');
      } else {
        setMensagem('Erro ao cancelar consulta. Tente novamente.');
      }
    } catch (err) {
      setMensagem('Erro ao cancelar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-4 flex flex-col items-center gap-3 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Confirmação de Consultas</h1>

        {mensagem && (
          <p className={`mt-4 text-sm ${mensagem.includes('sucesso') ? 'text-green-500 dark:text-green-300' : 'text-red-500 dark:text-red-300'}`}>
            {mensagem}
          </p>
        )}

        {loading && <p className="text-gray-600 dark:text-gray-300">Aguarde...</p>}

        <div className="w-full space-y-2 mt-2">
          {consultas.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Não há pedidos de consulta pendentes.</p>
          ) : (
            consultas.map((consulta) => (
              <div key={consulta.idHistorico} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{consulta.paciente.nome} {consulta.paciente.sobrenome}</h2>
                <p className="text-gray-600 dark:text-gray-300">Data: {new Date(consulta.dtAtendimento).toLocaleDateString()}</p>
                <p className="text-gray-600 dark:text-gray-300">Hora: {new Date(consulta.dtAtendimento).toLocaleTimeString()}</p>
                <p className="text-sm text-yellow-500 dark:text-yellow-300">Status: {consulta.status}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleConfirmarConsulta(consulta.idHistorico)}
                    className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl transition duration-300"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleCancelarConsulta(consulta.idHistorico)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  );
}