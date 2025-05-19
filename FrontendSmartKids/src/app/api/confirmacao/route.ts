import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/historico`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    console.log('API Route - Backend response status:', response.status);
    
    if (response.ok) {
      return NextResponse.json({ message: 'Consulta confirmada com sucesso.' }, { status: 200 });
    } else {
      const errorText = await response.text();
      console.error('API Route - Backend error:', errorText);
      return NextResponse.json({ error: 'Erro ao confirmar consulta.' }, { status: response.status });
    }
  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json({ error: 'Erro ao confirmar consulta.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idHistorico = searchParams.get('idHistorico');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/historico/${idHistorico}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Consulta cancelada com sucesso.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Erro ao cancelar consulta.' }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cancelar consulta.' }, { status: 500 });
  }
}