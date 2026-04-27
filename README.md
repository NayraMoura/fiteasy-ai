# FitEasy AI 🦾

**Assistente Inteligente para Personal Trainers com IA Generativa**

FitEasy AI é uma aplicação web fullstack que utiliza inteligência artificial (Google Gemini) para gerar planos de treino personalizados de forma rápida e eficiente. Personal trainers podem criar, revisar e compartilhar treinos com alunos de forma intuitiva.

---

## 📋 Funcionalidades Principais

### Para Personal Trainers

- ✅ **Cadastro e Autenticação** - Login seguro via Supabase Auth
- ✅ **Formulário Inteligente** - Coleta dados completos do aluno (objetivo, equipamentos, limitações)
- ✅ **Geração Automática com IA** - Cria planos de treino personalizados usando Google Gemini
- ✅ **Revisão e Edição** - Edita exercícios, séries, repetições antes de enviar
- ✅ **Compartilhamento** - Gera links para que alunos visualizem seus treinos
- ✅ **Otimizações recentes** - Backend com validação Zod e tratamento de erro melhorado, frontend mais enxuto e cards de treino com visualização detalhada

### Para Alunos

- 👀 **Visualização de Treino** - Acessa treinos através de link seguro
- 🎥 **Como Executar** - Botões para buscar vídeos de como fazer cada exercício no YouTube
- 📱 **Design Responsivo** - Interface otimizada para mobile e desktop

---

## 🛠 Tecnologias Utilizadas

### Frontend

- **React 19** - UI components
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização utilitária
- **Axios** - HTTP client
- **Supabase JS** - Autenticação

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para database
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de schema e erros de formulário mais claros
- **Google Generative AI** - LLM para geração de treinos (modelo Gemini 2.5 Flash)
- **Supabase Auth** - Autenticação

---

## 📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (incluído com Node.js)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (v12+) - [Download](https://www.postgresql.org/) _(ou usar Supabase hosted)_

---

## ⚙️ Configuração do Ambiente Local

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio-url>
cd fiteasy-ai
```

### 2. Configurar Variáveis de Ambiente

#### Backend (`.env` na pasta `server/`)

```bash
cd server
cp .env.example .env  # Se existir, ou criar manualmente
```

Edite `.env`:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/fiteasy_ai"

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_ANON_KEY="sua-chave-anonima"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"

# Google Generative AI (Gemini)
GEMINI_API_KEY="sua-chave-api-google"

# Express Server
PORT=3001
NODE_ENV="development"
```

#### Frontend (`.env` na pasta `client/`)

```bash
cd ../client
cp .env.example .env  # Se existir, ou criar manualmente
```

Edite `.env`:

```env
# Supabase
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anonima"

# API Backend
VITE_API_URL="http://localhost:3001"
```

### 3. Instalar Dependências

```bash
# Na raiz do projeto (workspace)
npm install

# Ou instalar separadamente
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 4. Configurar Banco de Dados

```bash
cd server

# Criar migration inicial do Prisma
npx prisma migrate dev --name init

# Ou atualizar schema existente
npx prisma db push

# (Opcional) Visualizar dados com Prisma Studio
npx prisma studio
```

### 5. Iniciar a Aplicação

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Saída esperada: 🚀 FitEasy AI Backend rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# Acesse: http://localhost:5173
```

---

## 🚀 Como Usar a Aplicação

### Fluxo do Personal Trainer

#### 1. Fazer Login

```typescript
// O Supabase cuida da autenticação automaticamente
// Acesse a página inicial e faça login com email/senha
```

#### 2. Criar Novo Treino

```
1. Clique em "+ Criar Novo Treino"
2. Preencha o formulário com dados do aluno:
   - Nome, Idade, Peso, Altura
   - Objetivo (Ganho de massa, Perda de peso, etc)
   - Equipamentos disponíveis (Halteres, Máquinas, etc)
   - Limitações (Lesões, problemas articulares)
3. Clique em "Gerar com IA"
```

#### 3. Revisar e Editar Treino

```typescript
// A IA retorna um plano estruturado
{
  "plano": "Hipertrofia muscular focada em peito e costas",
  "recomendacoes": "Realize 2-3 minutos de descanso entre séries...",
  "exercicios": [
    {
      "dia": "Segunda-feira (Peito e Tríceps)",
      "lista": [
        { "nome": "Supino", "series": 4, "reps": "8-10" },
        { "nome": "Crucifixo", "series": 3, "reps": "10-12" }
      ]
    }
  ]
}

// Edite qualquer campo conforme necessário
// Vídeos do YouTube estão disponíveis para cada exercício
```

#### 4. Compartilhar com Aluno

```
1. Clique em "🚀 ENVIAR PARA ALUNO"
2. Clique no botão "🔗 Link" na lista de treinos
3. O link é copiado automaticamente
4. Compartilhe com o aluno via WhatsApp, email, etc

Link formato: http://localhost:5173?view=treino-id-uuid
```

### Fluxo do Aluno

```
1. Acesse o link enviado pelo personal
2. Visualize seu treino semanal completo
3. Clique em "▶ Ver Execução" para cada exercício
4. Assista vídeos no YouTube mostrando como fazer corretamente
5. Imprima ou guarde o link para consulta durante os treinos
```

---

## 📁 Estrutura do Projeto

```
fiteasy-ai/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormularioTreino.tsx    # Formulário de dados do aluno
│   │   │   ├── CadastroPersonal.tsx    # Autenticação
│   │   │   └── ExercicioCard.tsx       # Card de exercício
│   │   ├── services/
│   │   │   └── api.ts                  # Axios client
│   │   ├── lib/
│   │   │   └── supabase.ts             # Config Supabase
│   │   ├── App.tsx                     # Componente principal
│   │   └── main.tsx                    # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── index.html
│
├── server/                          # Backend Express
│   ├── src/
│   │   ├── services/
│   │   │   └── geminiService.ts        # Integração Google Gemini
│   │   ├── lib/
│   │   │   ├── prisma.ts               # Cliente Prisma
│   │   │   └── supabase.ts             # Config Supabase
│   │   ├── repositories/
│   │   │   └── treinoRepository.ts     # Queries database
│   │   ├── schemas/
│   │   │   └── treinoSchema.ts         # Validação Zod
│   │   └── server.ts                   # Express setup & rotas
│   ├── prisma/
│   │   └── schema.prisma               # Definição database
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                            # Variáveis ambiente
│
├── package.json                     # Root workspace
└── README.md                        # Este arquivo
```

---

## 🔌 Endpoints da API

### Autenticação

```http
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Treinos (Requer token Bearer)

```http
GET    /treinos                 # Listar treinos do personal
GET    /treino/:id             # Buscar treino específico (público)
POST   /salvar-treino          # Criar/atualizar treino
POST   /gerar-sugestao         # Gerar treino com IA
```

### Exemplo de Requisição

```bash
# Gerar treino com IA
curl -X POST http://localhost:3001/gerar-sugestao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "idade": 28,
    "peso": 80,
    "altura": 1.78,
    "objetivo": "Ganho de massa muscular",
    "equipamentos": "Halteres, Barras",
    "limitacoes": "Problema no ombro esquerdo"
  }'
```

**Resposta:**

```json
{
  "plano": "Hipertrofia muscular com foco em segurança articular",
  "recomendacoes": "Evite supino, priorize máquinas...",
  "exercicios": [
    {
      "dia": "Segunda-feira (Peito e Tríceps)",
      "lista": [
        {
          "nome": "Máquina Smith - Supino inclinado",
          "series": 4,
          "reps": "8-10"
        }
      ]
    }
  ]
}
```

---

## 🔐 Variáveis de Ambiente Necessárias

### Backend

| Variável                    | Descrição                      | Exemplo                                    |
| --------------------------- | ------------------------------ | ------------------------------------------ |
| `DATABASE_URL`              | Connection string PostgreSQL   | `postgresql://user:pass@localhost/fiteasy` |
| `GEMINI_API_KEY`            | Chave API Google Generative AI | `AIzaSyD...`                               |
| `SUPABASE_ANON_KEY`         | Chave pública Supabase         | `eyJ...`                                   |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave privada Supabase         | `eyJ...`                                   |
| `PORT`                      | Porta do servidor              | `3001`                                     |
| `NODE_ENV`                  | Ambiente                       | `development` ou `production`              |

### Frontend

| Variável                 | Descrição               | Exemplo                   |
| ------------------------ | ----------------------- | ------------------------- |
| `VITE_SUPABASE_URL`      | URL do projeto Supabase | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública Supabase  | `eyJ...`                  |
| `VITE_API_URL`           | URL da API backend      | `http://localhost:3001`   |

---

## 📊 Obtendo Credenciais

### Google Gemini API Key

1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
2. Clique em "Create API key"
3. Copie a chave gerada
4. Cole em `server/.env` como `GEMINI_API_KEY`

### Supabase Credentials

1. Crie conta em [Supabase](https://supabase.com)
2. Crie novo projeto
3. Em **Settings > API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon (public)` → `VITE_SUPABASE_ANON_KEY`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### PostgreSQL Local (Opcional)

```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Debian/Ubuntu)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Criar banco de dados
createdb fiteasy_ai
```

---

## 🧪 Build & Produção

### Frontend Build

```bash
cd client
npm run build
# Gera pasta dist/ pronta para deploy
```

### Backend Build

```bash
cd server
npm run build
npm start
# Executa versão compilada
```

### Deploy (Exemplo)

```bash
# Frontend para Vercel
npm install -g vercel
vercel

# Backend para Railway/Heroku
# Configure conforme documentação do serviço
```

---

## 🐛 Troubleshooting

### Erro: "PORT 3001 já está em uso"

```bash
# Encontre o processo usando a porta
lsof -i :3001

# Mate o processo (macOS/Linux)
kill -9 <PID>

# Ou altere a porta no .env
PORT=3002
```

### Erro: "GEMINI_API_KEY is required"

- Verifique que `.env` existe na pasta `server/`
- Confirme que a chave foi colada corretamente
- Remova espaços em branco antes/depois da chave

### Erro: "Connection refused" ao banco de dados

```bash
# Teste a conexão
psql $DATABASE_URL

# Ou reinicie Supabase/PostgreSQL
# macOS
brew services restart postgresql
```

### Erro: "CORS Policy"

- Frontend está em `http://localhost:5173`
- Backend está configurado com CORS correto em `server.ts`
- Verifique `VITE_API_URL` no frontend `.env`

---

## 📝 Scripts Disponíveis

### Backend

```bash
npm run dev      # Desenvolvimento com hot reload
npm run build    # Compilar TypeScript
npm start        # Executar versão compilada
```

### Frontend

```bash
npm run dev      # Vite dev server
npm run build    # Produção build
npm run preview  # Preview do build
npm run lint     # ESLint check
```

---

## 🤝 Fluxo de Desenvolvimento

1. Criar branch: `git checkout -b feature/sua-feature`
2. Fazer changes
3. Testar localmente
4. Commit: `git commit -m "feat: descrição"`
5. Push: `git push origin feature/sua-feature`
6. Abrir Pull Request

---

## 📞 Suporte

Para dúvidas, erros ou sugestões:

- 📧 Abra uma issue no repositório
- 💬 Consulte a documentação das dependências:
  - [Prisma Docs](https://www.prisma.io/docs/)
  - [React Docs](https://react.dev)
  - [Express Docs](https://expressjs.com/)
  - [Supabase Docs](https://supabase.com/docs)

---

## 📄 Licença

MIT License - Veja arquivo LICENSE para detalhes

---

**Desenvolvido com ❤️ para Personal Trainers Modernos**

_Last Updated: Abril 2026_
