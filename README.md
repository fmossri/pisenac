# SmartKids - Sistema de Agendamento Entre Pacientes e Profissionais da Saúde

## Requisitos
- Node.js (v18 ou superior)
- MySQL (8.0 ou superior)
- npm ou yarn

## Configuração do Ambiente

### 1. Clone o Repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
cd pisenac
```

### 2. Configuração do MySQL
1. Instale o MySQL no WSL2 (Ubuntu):
```bash
sudo apt update
sudo apt install mysql-server
```

2. Inicie o serviço MySQL:
```bash
sudo service mysql start
```

3. Configure o MySQL:
```bash
sudo mysql
```
No prompt do MySQL, execute:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
exit;
```

4. Inicialize o banco de dados (isso também configurará o timezone para São Paulo):
```bash
cd BackendSmartKids/Backend
node database/init.js
```

### 3. Configuração do Backend

1. Navegue até a pasta do backend:
```bash
cd BackendSmartKids/Backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=smartkids
DB_PORT=3306" > .env
```

4. Inicialize o banco de dados:
```bash
node database/init.js
```

### 4. Configuração do Frontend

1. Navegue até a pasta do frontend:
```bash
cd FrontendSmartKids
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
```

## Executando a Aplicação

### 1. Inicie o Backend
```bash
cd BackendSmartKids/Backend
npm start
```
O servidor backend estará disponível em `http://localhost:3001`

### 2. Inicie o Frontend
```bash
cd FrontendSmartKids
npm run dev
```
A aplicação frontend estará disponível em `http://localhost:3000`

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas:
- `usuarios`: Informações de autenticação
- `cadastros`: Dados cadastrais dos usuários
- `historicos`: Registro de agendamentos e consultas

## Solução de Problemas

### MySQL não inicia
```bash
sudo service mysql status  # Verifica status
sudo service mysql start   # Inicia o serviço
```

### Erro de conexão com o banco
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Verifique se a porta 3306 está disponível

### Erro no frontend
1. Verifique se o backend está rodando
2. Confirme se `NEXT_PUBLIC_API_URL` está configurado corretamente
3. Verifique os logs do console do navegador
