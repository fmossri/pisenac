# Seções

## Instalação e Preparação do Ambiente ?
Verificar a duração máxima do vídeo; se for curto, não devem esperar pela instalação

## Criação de usuários
- Clicar em entrar ou agendar consulta
- Clicar em não possui um cadastro
- Criar usuário tipo paciente
- (após o redirect, retornar para a página de não possui cadastro)
- Criar usuário tipo profissional

## Agendamento
- Logar como usuario tipo paciente
- Navegar para `Consultas`
- Selecionar um usuário tipo profissional
- selecionar data e hora. **Esses campos vão verificar a disponibilidade daquele profissional naquele datetime ao nível do minuto
- Agendar um horário
- Tentar agendar o mesmo horário uma segunda vez na sequência, para garantir que não é possível
- Agendar mais três horários diferentes

## Histórico (paciente)
- Navegar para a `Histórico` e verificar que existem quatro entradas com status `Aguardando confiramção` associadas ao nome do profissional escolhido
- Clicar em Sair para deslogar

## Confirmação e Finalização de atendimento
- Logar como usuário tipo profissional
- Navegar para a página `Histórico` e verificar que existem quatro entradas com status `Aguardando confirmação` associadas ao nome do paciente que solicitou atendimento
- Nevagar para Consultas
- Clicar em Confirmar em duas consulta
- Clicar em Cancelar em uma consulta
- Navegar para Histórico e verificar que existem três entradas: duas com status `Confirmada` e uma com status `Aguardando Confirmação`
- Navegar para `Consultas` e clicar `Preencher Histórico` em uma consulta
- Inserir texto à gosto
- Navegar para `Histórico` e verificar que existem três entradas: uma com status `Confirmada`, uma com status `Aguardando Confirmação` e uma com status `Finalizada`

## Verificação final
- Clicar em `Sair` e deslogar
- Logar com o usuário tipo paciente usado anteriormente
- Navegar para a página principal clicando em `SmartKids`
- Clicar em `Agendar uma Consulta`
- (Opcional) Marcar uma nova consulta
- Navegar para `Histórico` e verificar que existem três (ou quatro) entradas, com status `Confirmada`, `Aguardando Confirmação` e `Finalizada`
