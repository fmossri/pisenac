'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Agendamento() {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [medico, setMedico] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const medicosDisponiveis = [
    { id: 1, nome: 'Dr. João Silva' },
    { id: 2, nome: 'Dra. Maria Souza' },
    { id: 3, nome: 'Dr. Carlos Oliveira' },
  ];

const handleAgendar = async () => {
  if (!data || !hora || !medico) {
    setMensagem('Por favor, preencha todos os campos.');
    return;
  }

  setLoading(true);
  setMensagem('Agendando...');

  try {
    const response = await fetch(`http://localhost:3001/historico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pacienteId: session.user?.id,
        profissionalId: Number(medico),
        data,
        hora,
      }),
    });

    if (!response.ok) throw new Error('Erro na resposta da API');

    setMensagem('Agendamento realizado com sucesso!');
  } catch (err) {
    console.error(err);
    setMensagem('Erro ao agendar. Tente novamente.');
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Agendamento de Consulta</h1>

        <div className="w-full max-w-xs space-y-4">
          <div>
            <label htmlFor="data" className="block text-left text-gray-600">Data da Consulta</label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="hora" className="block text-left text-gray-600">Hora da Consulta</label>
            <input
              type="time"
              id="hora"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="medico" className="block text-left text-gray-600">Selecione o Médico</label>
            <select
              id="medico"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione um médico</option>
              {medicosDisponiveis.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAgendar}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>

          {mensagem && (
            <p className={`mt-4 text-sm ${mensagem.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}