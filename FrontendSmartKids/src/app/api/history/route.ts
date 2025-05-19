import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idUsuario = searchParams.get('idUsuario');

  if (!idUsuario) {
    return NextResponse.json({ error: 'idUsuario é obrigatório.' }, { status: 400 });
  }

  try {
    // Call your backend
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/historico/usuario/${idUsuario}`);
    if (!backendRes.ok) {
      throw new Error('Erro ao buscar histórico no backend');
    }
    const historicos = await backendRes.json();
    return NextResponse.json(historicos);
  } catch (error) {
    console.error('Erro na API de histórico:', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar o histórico. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

