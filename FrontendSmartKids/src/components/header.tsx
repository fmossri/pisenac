'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex px-2 py-4 bg-green-600 text-white dark:bg-green-800 transition-colors">
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
        <div className="font-bold text-lg">
          <Link href="/">SmartKids</Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-white border-white hover:bg-green-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="fill-current h-5 w-5" viewBox="0 0 20 20"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center justify-center gap-4">
            {status === 'authenticated' && session?.user?.email ? (
              <>
                <li>
                  <Link href="/agendamentos" className="hover:underline">Consultas</Link>
                </li>
                <li>
                  <Link href="/history" className="hover:underline">Histórico</Link>
                </li>
                <li>
                  <button onClick={() => signOut()} className="hover:underline text-red-200">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => signIn()} className="hover:underline">
                  Entrar
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden absolute top-16 left-0 w-full bg-green-700 z-50 shadow-lg animate-fade-in">
          <ul className="flex flex-col items-center gap-4 py-4">
            {status === 'authenticated' && session?.user?.email ? (
              <>
                <li>
                  <Link href="/agendamentos" className="hover:underline" onClick={() => setMenuOpen(false)}>Consultas</Link>
                </li>
                <li>
                  <Link href="/history" className="hover:underline" onClick={() => setMenuOpen(false)}>Histórico</Link>
                </li>
                <li>
                  <button onClick={() => { signOut(); setMenuOpen(false); }} className="hover:underline text-red-200">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => { signIn(); setMenuOpen(false); }} className="hover:underline">
                  Entrar
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}