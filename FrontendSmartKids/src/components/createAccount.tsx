'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAccountForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tipo: 1,
    nome: '',
    sobrenome: '',
    documento: '',
    endereco: '',
    cep: '',
    docProfSaude: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 9) return numbers;
    return `${numbers.slice(0, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cep') {
      formattedValue = formatCEP(value);
    } else if (name === 'documento') {
      formattedValue = formatCPF(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const createAccount = async () => {
    const { email, password, tipo, nome, sobrenome, documento, endereco, cep, docProfSaude } = formData;

    if (!email || !password || !nome || !sobrenome || !documento || !endereco || !cep) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    if (tipo === 2 && !docProfSaude) {
      setMessage('Documento profissional é obrigatório para profissionais de saúde.');
      return;
    }

    setLoading(true);
    setMessage('Criando conta...');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          tipo,
          nome,
          sobrenome,
          documento: documento.replace(/\D/g, ''),
          endereco,
          cep: cep.replace(/\D/g, ''),
          docProfSaude: docProfSaude ? docProfSaude.replace(/\D/g, '') : undefined
        }),
      });

      if (res.status === 200 || res.status === 201) {
        setMessage('Conta criada com sucesso!');
        // Clear form
        setFormData({
          email: '',
          password: '',
          tipo: 1,
          nome: '',
          sobrenome: '',
          documento: '',
          endereco: '',
          cep: '',
          docProfSaude: ''
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }


      else if (res.status === 409) {
        throw new Error('Usuário já existe.');
      }

      else if (res.status === 400) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
      }

      else if (res.status === 500) {
        throw new Error('Erro interno do servidor.');
      }

      else {
        throw new Error('Erro desconhecido.');
      }
      
      
    } catch (err: unknown) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-700">
          Crie sua conta no <span className="text-green-600">SmartKids</span>
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleInputChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        <input
          type="text"
          name="sobrenome"
          placeholder="Sobrenome"
          value={formData.sobrenome}
          onChange={handleInputChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        <input
          type="text"
          name="documento"
          placeholder="CPF (apenas números)"
          value={formData.documento}
          onChange={handleInputChange}
          maxLength={12}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={formData.endereco}
          onChange={handleInputChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        <input
          type="text"
          name="cep"
          placeholder="CEP (apenas números)"
          value={formData.cep}
          onChange={handleInputChange}
          maxLength={9}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
        />

        {formData.tipo === 2 && (
          <input
            type="text"
            name="docProfSaude"
            placeholder="Documento Profissional (apenas números)"
            value={formData.docProfSaude}
            onChange={handleInputChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder-gray-500"
          />
        )}

        <div className="w-full flex justify-center gap-8 mt-2">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input
              type="radio"
              name="tipo"
              value="1"
              checked={formData.tipo === 1}
              onChange={() => setFormData(prev => ({ ...prev, tipo: 1 }))}
              className="form-radio text-green-500"
            />
            Paciente
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input
              type="radio"
              name="tipo"
              value="2"
              checked={formData.tipo === 2}
              onChange={() => setFormData(prev => ({ ...prev, tipo: 2 }))}
              className="form-radio text-green-500"
            />
            Profissional
          </label>
        </div>



        <button
          onClick={createAccount}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-md mt-4"
        >
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>

        {message && (
          <p className={`mt-2 text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
  );
}
