'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Agendamento() {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [profissional, setProfissional] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch('/api/users?tipo=2')
      .then(res => res.json())
      .then(setDoctors);
  }, []);

  const checkConflict = async (profissionalId, dtAtendimento) => {
    const res = await fetch(`/api/history?idUsuario=${profissionalId}`);
    const historicos = await res.json();
    
    return historicos.some(h => {
      if (!h.dtAtendimento || !dtAtendimento) return false;
      
      // Convert both dates to Date objects for comparison
      const existingDate = new Date(h.dtAtendimento);
      const newDate = new Date(dtAtendimento);
      
      // Compare dates ignoring milliseconds
      return existingDate.getTime() === newDate.getTime();
    });
  };

  const handleAgendar = async () => {
    if (!data || !hora || !profissional) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    const dtAtendimento = data && hora ? `${data}T${hora}:00` : null;

    if (dtAtendimento) {
      const now = new Date();
      const atendimentoDate = new Date(dtAtendimento);
      if (atendimentoDate.getTime() <= now.getTime()) {
        setMensagem('A data e hora da consulta devem ser futuras.');
        return;
      }
    }

    setLoading(true);
    setMensagem('Agendando...');

    const conflict = await checkConflict(profissional, dtAtendimento);
    if (conflict) {
      setMensagem('Já existe um agendamento para este horário.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/agendamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Paciente: session.user?.id,
          Profissional: Number(profissional),
          dtConfirmacao: null,
          dtAtendimento,
          historico: null,
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
    <main className="flex-1 bg-gradient-to-b from-green-50 to-green-100 dark:from-black dark:to-gray-900 flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Agendar uma Consulta</h1>

        <div className="w-full max-w-xs space-y-4">

          <div>
            <label htmlFor="profissional" className="block text-left text-gray-600 dark:text-gray-300">Selecione o Profissional</label>
            <select
              id="profissional"
              value={profissional}
              onChange={(e) => setProfissional(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione um profissional</option>
              {doctors.map((profissional) => (
                <option key={profissional.idUsuario} value={profissional.idUsuario}>
                  {profissional.nome && profissional.sobrenome
                    ? `Dr(a). ${profissional.nome} ${profissional.sobrenome}`
                    : profissional.nome
                    ? `Dr(a). ${profissional.nome}`
                    : profissional.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="data" className="block text-left text-gray-600 dark:text-gray-300">Data da Consulta</label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="hora" className="block text-left text-gray-600 dark:text-gray-300">Hora da Consulta</label>
            <input
              type="time"
              id="hora"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-100"
            />
          </div>

          <button
            onClick={handleAgendar}
            disabled={loading}
            className="w-full bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>

          {mensagem && (
            <p className={`mt-4 text-sm ${mensagem.includes('sucesso') ? 'text-green-500 dark:text-green-300' : 'text-red-500 dark:text-red-300'}`}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}