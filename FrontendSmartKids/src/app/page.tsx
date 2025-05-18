'use client';

import Image from "next/image";
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center pt-12 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-4xl w-full text-center">
        {/* Header principal */}
        <Image
          src="/images/logo.webp"
          alt="SmartKids Logo"
          width={180}
          height={180}
          className="rounded-full shadow-md"
          priority
        />
        <h1 className="text-4xl font-extrabold text-green-900">
          Bem-vindo à SmartKids
        </h1>
        <p className="text-green-700 text-lg max-w-xl mx-auto">
          Especialistas em cuidados para crianças com necessidades especiais.<br />
          Cuidamos com carinho, profissionalismo e atenção personalizada.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md"
        >
          Agende uma Consulta
        </button>
      </div>

      {/* Sobre nós */}
      <section className="mt-20 max-w-4xl w-full text-center px-6">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Sobre a SmartKids</h2>
        <p className="text-green-700 text-lg max-w-3xl mx-auto">
          Fundada por profissionais dedicados, a SmartKids oferece um ambiente acolhedor e especializado para crianças com necessidades especiais. Nosso objetivo é promover o desenvolvimento integral com amor e expertise.
        </p>
      </section>

      {/* Serviços */}
      <section className="mt-20 max-w-4xl w-full px-6">
        <h2 className="text-3xl font-bold text-green-800 mb-10 text-center">Nossos Serviços</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <ServiceCard
            title="Terapia Ocupacional"
            description="Ajudamos as crianças a desenvolver habilidades motoras, cognitivas e sociais para uma vida mais independente."
            icon="🧸"
          />
          <ServiceCard
            title="Fonoaudiologia"
            description="Tratamentos personalizados para melhorar a comunicação e a linguagem infantil."
            icon="🗣️"
          />
          <ServiceCard
            title="Psicologia Infantil"
            description="Suporte emocional e psicológico para crianças e famílias, promovendo bem-estar."
            icon="💙"
          />
          <ServiceCard
            title="Acompanhamento Multidisciplinar"
            description="Equipe integrada para atender todas as necessidades de forma completa e humanizada."
            icon="👩‍⚕️👨‍⚕️"
          />
        </div>
      </section>

      {/* Depoimentos */}
      <section className="mt-20 max-w-4xl w-full px-6 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-10">O que dizem nossos clientes</h2>
        <div className="space-y-8">
          <Testimonial
            quote="A SmartKids mudou a vida da minha filha. A equipe é maravilhosa e super dedicada!"
            author="Maria S."
          />
          <Testimonial
            quote="Atendimento excepcional e muito carinho com as crianças. Recomendo de olhos fechados!"
            author="Carlos M."
          />
        </div>
      </section>

      <footer className="mt-20 w-full bg-green-900 text-green-100 py-8 text-center">
        <p>SmartKids Clínica | Rua das Flores, 123 - São Paulo, SP</p>
        <p>Email: contato@smartkids.com | Telefone: (11) 99999-9999</p>
        <p className="mt-2 text-sm">© 2025 SmartKids. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

function ServiceCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-default">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-green-900 mb-2">{title}</h3>
      <p className="text-green-700">{description}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <blockquote className="bg-white rounded-xl shadow-md p-6 mx-auto max-w-xl italic text-green-800">
      <p>“{quote}”</p>
      <footer className="mt-4 font-semibold text-green-900">- {author}</footer>
    </blockquote>
  );
}
