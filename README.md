# Lumind - Plataforma Educacional

Uma plataforma educacional interativa desenvolvida com FastAPI e interface web moderna, focada em personalização de aprendizado e acessibilidade.

## 🚀 Funcionalidades

- **Sistema de Autenticação Completo**: Registro e login de usuários
- **Questionário de Preferências**: Coleta informações sobre estilos de aprendizado
- **Recomendações Personalizadas**: Sugestões baseadas nas preferências do usuário
- **Painel de Progresso**: Acompanhamento do desenvolvimento do aluno
- **Painel do Responsável**: Visão para pais/responsáveis acompanharem o progresso
- **Acessibilidade**: Recursos para diferentes necessidades de aprendizado
- **Interface Responsiva**: Design moderno com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **PostgreSQL/SQLite** - Banco de dados
- **JWT** - Autenticação com tokens
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

### Frontend
- **HTML5** - Estrutura da página
- **Tailwind CSS** - Framework CSS utilitário
- **JavaScript** - Interatividade
- **Font Awesome** - Ícones

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 📋 Pré-requisitos

- Python 3.11+
- Docker e Docker Compose (opcional)
- Git

## 🚀 Como Executar o Projeto

### Opção 1: Execução Local (Recomendado para desenvolvimento)

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd Lumind
   ```

2. **Configure o Backend**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   .\venv\Scripts\Activate.ps1
   
   # Linux/Mac
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Configure o PostgreSQL**
   - Certifique-se que o PostgreSQL está rodando na porta 5433
   - Crie o banco de dados `lumind_db`
   - Crie o arquivo `.env` (veja seção de Variáveis de Ambiente abaixo)

4. **Execute as Migrations**
   ```bash
   # Criar migration inicial (se necessário)
   alembic revision --autogenerate -m "Initial migration"
   
   # Aplicar migrations
   alembic upgrade head
   ```

5. **Inicie o Backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Acesse o Frontend**
   - Abra `frontend/index.html` no seu navegador
   - Ou use um servidor local (ex: Live Server no VS Code)

### Opção 2: Execução com Docker

1. **Certifique-se que o Docker Desktop está rodando**

2. **Execute o projeto**
   ```bash
   docker-compose up --build
   ```

3. **Acesse as aplicações**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Perfil do usuário atual

### Geral
- `GET /` - Mensagem de boas-vindas
- `GET /health` - Health check da API

## 🗄️ Estrutura do Banco de Dados

### Tabela Users
- `id` - Identificador único
- `full_name` - Nome completo
- `email` - Email (único)
- `hashed_password` - Senha criptografada
- `birth_date` - Data de nascimento
- `guardian_name` - Nome do responsável
- `guardian_email` - Email do responsável
- `learning_preferences` - Preferências de aprendizado (JSON)
- `interests` - Interesses do usuário (JSON)
- `distractions` - Distrações identificadas
- `is_active` - Status da conta
- `created_at` - Data de criação
- `updated_at` - Data de atualização

## 🎯 Como Usar

1. **Cadastro**: Crie uma conta fornecendo suas informações pessoais
2. **Questionário**: Responda sobre suas preferências de aprendizado
3. **Exploração**: Receba recomendações personalizadas de conteúdo
4. **Acompanhamento**: Monitore seu progresso na plataforma
5. **Responsável**: Pais/responsáveis podem acompanhar o desenvolvimento

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
Crie um arquivo `.env` na pasta `backend` com:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:admin@localhost:5433/lumind_db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
APP_NAME=Lumind
DEBUG=True
```

**Nota**: Ajuste `postgres:admin` para seu usuário e senha do PostgreSQL.

### Estrutura do Projeto
```
Lumind/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routers/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── index.html
├── docker-compose.yml
└── README.md
```

## 🐛 Solução de Problemas

### Erro "ModuleNotFoundError: No module named 'app'"
- Certifique-se de executar o uvicorn do diretório `backend/`
- Ative o ambiente virtual antes de executar

### Docker não inicia
- Verifique se o Docker Desktop está rodando
- Execute `docker-compose down` e `docker-compose up --build`

### Porta 8000 ocupada
- Pare outros serviços na porta 8000
- Ou mude a porta no comando: `--port 8001`

## 📝 Status do Projeto

✅ **Backend (FastAPI) - FUNCIONANDO**
- Servidor rodando em: `http://localhost:8000`
- API endpoints funcionais
- Banco de dados configurado

✅ **Frontend - FUNCIONANDO**
- Interface HTML completa
- Design responsivo
- Múltiplas telas implementadas

✅ **Banco de Dados - CONFIGURADO**
- PostgreSQL (porta 5433)
- Migrations com Alembic
- Tabelas criadas via migrations

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do painel "Falar com Especialista" na aplicação ou abra uma issue no repositório.

---

**Lumind** - Transformando a educação através da personalização! 🎓✨