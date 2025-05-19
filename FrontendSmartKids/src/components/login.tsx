'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou senha inválidos');
        setPassword('');
      } else {
        console.log('Login bem sucedido, session:', session);
        console.log('Tipo de usuário:', session?.user?.tipo);
        // Wait a moment for the session to be set
        setTimeout(() => {
          router.push('/agendamentos');
        }, 100);
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro ao fazer login');
      setPassword('');
    }
  };

  // Debug log whenever session changes
  console.log('Sessão atual:', session);
  console.log('Tipo de usuário da sessão:', session?.user?.tipo);

  return (
    
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md text-center">
        <div className="text-2xl text-green-700 font-bold">
          <h1>Bem-vindo ao <span className="text-green-600">SmartKids</span></h1>
          <h2 className="text-base font-normal text-gray-600 mt-1">
            Sua página médica especializada!
          </h2>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <Link
            href="/createAccount"
            className="text-sm text-green-600 hover:underline text-right"
          >
            Não tem cadastro?
          </Link>

          <button
            type="submit"
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md"
          >
            Entrar
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
  );
}
