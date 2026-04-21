# FitEasy AI - Servidor Backend

Sistema de geração de treinos personalizados usando IA Gemini.

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env` e configure:
- `DATABASE_URL`: URL do banco PostgreSQL (Supabase)
- `GEMINI_API_KEY`: Chave da API Google Gemini

### 3. Configurar o banco de dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Criar e aplicar migrações
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### 4. Executar o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📋 Endpoints

### POST /testar-treino
Testa a integração com banco de dados.

**Exemplo de request:**
```json
{
  "nome": "João Silva",
  "idade": 25,
  "objetivo": "Perda de peso"
}
```

## 🛠️ Tecnologias

- **Node.js** com TypeScript
- **Express** para API REST
- **Prisma** ORM para PostgreSQL
- **Google Gemini AI** para geração de treinos
- **Zod** para validação

## 📁 Estrutura do projeto

```
server/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── lib/            # Configurações (Prisma, etc.)
│   ├── repositories/   # Camada de dados
│   ├── schemas/        # Validações Zod
│   ├── services/       # Serviços externos (Gemini)
│   └── server.ts       # Ponto de entrada
├── prisma/
│   └── schema.prisma   # Schema do banco
└── package.json
```

## 🔧 Scripts disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Executa versão compilada
- `npx prisma studio` - Interface gráfica do banco
- `npx prisma migrate dev` - Criar migrações

## 🐛 Troubleshooting

### Erro: "PrismaClientInitializationError"
- Verifique se `DATABASE_URL` está definida no `.env`
- Execute `npx prisma generate`

### Erro: "Cannot find module"
- Execute `npm install`
- Verifique se está no diretório correto

### Erro na API Gemini
- Verifique se `GEMINI_API_KEY` é válida
- Confirme que o modelo "gemini-1.5-flash" está disponível