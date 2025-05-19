import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user`;
  if (tipo) {
    url += `/tipo/${tipo}`;
  }

  const backendRes = await fetch(url);
  const users = await backendRes.json();
  return NextResponse.json(users, { status: backendRes.status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, tipo, nome, sobrenome, documento, endereco, cep, docProfSaude } = body

    // Validate required fields
    if (!email || !password || !tipo) {
      return NextResponse.json(
        { error: 'Email, senha e tipo de conta são obrigatórios.' },
        { status: 400 }
      )
    }

    // Create user in backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        senha: password,
        tipoUsuario: tipo,
        nome,
        sobrenome,
        documento,
        endereco,
        cep,
        docProfSaude
      }),
    })

    // Handle backend responses
    if (backendResponse.status === 406) {
      return NextResponse.json(
        { error: 'O e-mail já está cadastrado!' },
        { status: 409 }
      )
    }

    if (!backendResponse.ok) {
      throw new Error('Erro ao criar usuário no backend')
    }

    // Get user data from backend response
    const userData = await backendResponse.json()
    
    // Remove password from response if it exists
    const { senha: _, ...userWithoutPassword } = userData

    return NextResponse.json(
      { message: 'Usuário criado com sucesso!', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário. Tente novamente.' },
      { status: 500 }
    )
  }
}
