import './globals.css'
import { Inter } from 'next/font/google'
import {ClientProviders} from '@/components/clientProviders'
import {Header} from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <ClientProviders>
          <div className={`${inter.className} flex flex-col min-h-screen`}>
            <Header />
            {children}
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}