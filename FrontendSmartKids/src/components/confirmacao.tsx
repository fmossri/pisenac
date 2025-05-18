'use client';

import { useState, useEffect } from 'react';

export default function ConfirmaConsulta() {
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const consultasSimuladas = [
    { id: 1, paciente: 'João Silva', data: '2025-05-20', hora: '10:00', status: 'Pendente' },
    { id: 2, paciente: 'Maria Souza', data: '2025-05-20', hora: '14:00', status: 'Pendente' },
    { id: 3, paciente: 'Carlos Oliveira', data: '2025-05-21', hora: '09:00', status: 'Confirmada' },
  ];

  useEffect(() => {
    setConsultas(consultasSimuladas.filter(consulta => consulta.status === 'Pendente'));
  }, []);

  const handleConfirmarConsulta = async (id: number) => {
    setLoading(true);
    setMensagem('Confirmando consulta...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConsultas(consultas.map((consulta) =>
        consulta.id === id ? { ...consulta, status: 'Confirmada' } : consulta
      ));

      setMensagem('Consulta confirmada com sucesso!');
    } catch (err) {
      setMensagem('Erro ao confirmar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarConsulta = async (id: number) => {
    setLoading(true);
    setMensagem('Cancelando consulta...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConsultas(consultas.map((consulta) =>
        consulta.id === id ? { ...consulta, status: 'Cancelada' } : consulta
      ));

      setMensagem('Consulta cancelada com sucesso!');
    } catch (err) {
      setMensagem('Erro ao cancelar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-4xl w-200 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Confirmação de Consultas Pendentes</h1>

        {mensagem && (
          <p className={`mt-4 text-sm ${mensagem.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>
            {mensagem}
          </p>
        )}

        {loading && <p className="text-gray-600">Aguarde...</p>}

        <div className="w-150 space-y-4 mt-2">
          {consultas.length === 0 ? (
            <p className="text-gray-600">Não há consultas pendentes no momento.</p>
          ) : (
            consultas.map((consulta) => (
              <div key={consulta.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">{consulta.paciente}</h2>
                <p className="text-gray-600">Data: {consulta.data}</p>
                <p className="text-gray-600">Hora: {consulta.hora}</p>
                <p className="text-sm text-yellow-500">Status: {consulta.status}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleConfirmarConsulta(consulta.id)}
                    className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl transition duration-300"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleCancelarConsulta(consulta.id)}
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
    </main>
  );
}