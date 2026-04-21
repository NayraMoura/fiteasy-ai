# 🚀 Quick Start - FitEasy AI

Guia rápido para começar a desenvolver em 5 minutos.

---

## **Pré-requisitos** (instale antes)
- Node.js v18+ https://nodejs.org/
- Git https://git-scm.com/
- Uma conta Supabase (gratuita) https://supabase.com/
- Uma chave Google Gemini (gratuita) https://aistudio.google.com/apikey

---

## **1️⃣ Setup Inicial**

```bash
# Clone o projeto
git clone <seu-repositorio-url>
cd fiteasy-ai

# Instale dependências
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

---

## **2️⃣ Configurar Credenciais**

### Backend (server/.env)
```bash
cd server
cp .env.example .env
```

Edite `server/.env` e preencha:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fiteasy_ai"
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-publica"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-privada"
GEMINI_API_KEY="sua-chave-google"
PORT=3001
NODE_ENV=development
```

### Frontend (client/.env.local)
```bash
cd ../client
cp .env.example .env.local
```

Edite `client/.env.local`:
```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-publica"
VITE_API_URL="http://localhost:3001"
```

---

## **3️⃣ Preparar Banco de Dados**

```bash
cd server

# Criar/atualizar banco (Prisma)
npx prisma db push

# (Opcional) Ver dados com interface gráfica
npx prisma studio
```

---

## **4️⃣ Iniciar Desenvolvimento**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Esperado: 🚀 FitEasy AI Backend rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Acesse: http://localhost:5173
```

---

## **5️⃣ Testar a Aplicação**

### Login
1. Abra http://localhost:5173
2. Faça cadastro com email/senha
3. Clique "+ Criar Novo Treino"

### Gerar Treino com IA
```bash
curl -X POST http://localhost:3001/gerar-sugestao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João",
    "idade": 30,
    "peso": 80,
    "altura": 1.80,
    "objetivo": "Ganho de massa",
    "equipamentos": "Halteres",
    "limitacoes": "Sem limitações"
  }'
```

---

## **🎯 Próximos Passos**

- [ ] Ler [README.md](./README.md) completo
- [ ] Explorar a estrutura em [Estrutura do Projeto](./README.md#-estrutura-do-projeto)
- [ ] Entender os [Endpoints da API](./README.md#-endpoints-da-api)
- [ ] Fazer seu primeiro commit

---

## **❓ Problemas?**

| Erro | Solução |
|------|---------|
| `PORT 3001 in use` | `kill -9 $(lsof -t -i:3001)` |
| `GEMINI_API_KEY is required` | Confirme `.env` existe e tem a chave |
| `Connection refused` (DB) | Instale PostgreSQL ou use Supabase hosted |
| `CORS Error` | Verifique `VITE_API_URL` no `.env.local` |

---

## **Comandos Úteis**

```bash
# Frontend
npm run dev         # Start dev server
npm run build       # Produção build
npm run lint        # Check erros

# Backend
npm run dev         # Start dev server com hot reload
npm run build       # Compilar
npm start           # Executar versão compilada

# Banco de dados
npx prisma migrate dev --name "descricao"  # Nova migration
npx prisma studio                          # Interface visual
npx prisma db push                         # Atualizar schema
```

---

## **Estrutura Mínima Entendida**

```
fiteasy-ai/
├── client/          # React + Vite + Tailwind
├── server/          # Express + Prisma + Gemini
├── README.md        # Documentação completa
└── .git/            # Controle de versão
```

---

**Pronto para começar!** 🎉

Se tiver dúvidas, consulte [README.md](./README.md) ou crie uma issue.
