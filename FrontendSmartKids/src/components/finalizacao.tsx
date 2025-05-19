'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Finalizacao() {
  const { data: session, status } = useSession();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [selectedConsulta, setSelectedConsulta] = useState<any>(null);
  const [historico, setHistorico] = useState('');

  useEffect(() => {
    const fetchConsultas = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/history?idUsuario=' + session.user?.id, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log('Finalizacao - Data from backend:', data);
        // Filter for confirmed appointments with null histórico
        setConsultas(data.filter((consulta: any) => 
          consulta.dtConfirmacao && !consulta.historico
        ));
      } catch (error) {
        setMensagem('Erro ao buscar consultas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchConsultas();
    }
  }, [session]);

  const handleEdit = (consulta: any) => {
    setSelectedConsulta(consulta);
    setHistorico('');
  };

  const handleSubmit = async () => {
    if (!historico.trim()) {
      setMensagem('O histórico é obrigatório.');
      return;
    }

    setLoading(true);
    setMensagem('Salvando histórico...');

    try {
      const response = await fetch('/api/confirmacao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idHistorico: selectedConsulta.idHistorico,
          Paciente: selectedConsulta.Paciente,
          Profissional: selectedConsulta.Profissional,
          dtConfirmacao: selectedConsulta.dtConfirmacao,
          dtAtendimento: selectedConsulta.dtAtendimento,
          historico: historico
        }),
      });

      if (response.ok) {
        setConsultas(consultas.filter(c => c.idHistorico !== selectedConsulta.idHistorico));
        setSelectedConsulta(null);
        setHistorico('');
        setMensagem('Histórico salvo com sucesso!');
      } else {
        const errorData = await response.json();
        setMensagem(errorData.error || 'Erro ao salvar histórico. Tente novamente.');
      }
    } catch (err) {
      setMensagem('Erro ao salvar histórico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-4 flex flex-col items-center gap-3 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Finalização de Consultas</h1>

        {mensagem && (
          <p className={`mt-4 text-sm ${mensagem.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>
            {mensagem}
          </p>
        )}

        {loading && <p className="text-gray-600 dark:text-gray-300">Aguarde...</p>}

        <div className="w-full space-y-2 mt-2">
          {consultas.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Não há consultas para finalizar.</p>
          ) : (
            consultas.map((consulta) => (
              <div key={consulta.idHistorico} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{consulta.paciente.nome} {consulta.paciente.sobrenome}</h2>
                <p className="text-gray-600 dark:text-gray-300">Data: {new Date(consulta.dtAtendimento).toLocaleDateString()}</p>
                <p className="text-gray-600 dark:text-gray-300">Hora: {new Date(consulta.dtAtendimento).toLocaleTimeString()}</p>

                <button
                  onClick={() => handleEdit(consulta)}
                  className="mt-4 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl transition duration-300"
                >
                  Adicionar Histórico
                </button>
              </div>
            ))
          )}
        </div>

        {selectedConsulta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Adicionar Histórico</h2>
              <textarea
                value={historico}
                onChange={(e) => setHistorico(e.target.value)}
                className="w-full h-40 p-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4"
                placeholder="Digite o histórico da consulta..."
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedConsulta(null)}
                  className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white py-2 px-4 rounded-xl transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-sky-500 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-700 text-white py-2 px-4 rounded-xl transition duration-300"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
} 