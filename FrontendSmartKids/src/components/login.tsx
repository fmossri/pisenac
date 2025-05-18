'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push('/agendamentos');
    } else {
      alert('Login falhou');
    }
  };

  return (
    <main className="min-h-197 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md text-center">
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
        </form>
      </div>
    </main>
  );
}
