# 📡 API Reference - FitEasy AI

Referência completa de endpoints da API do backend com exemplos práticos.

---

## 📌 Base URL

**Development:** `http://localhost:3001`

**Production:** `https://api.fiteasy.com` *(exemplo)*

---

## 🔐 Autenticação

Todos os endpoints protegidos requerem header:
```
Authorization: Bearer {token_supabase}
```

**Como obter o token:**
```typescript
// Frontend
const { data, error } = await supabase.auth.getSession();
const token = data?.session?.access_token;

// Ou direto do localStorage
const token = localStorage.getItem('sb-access-token');
```

---

## 📚 Endpoints

### 1️⃣ GET `/treinos` - Listar Treinos do Personal
Retorna todos os treinos criados pelo personal autenticado.

```http
GET http://localhost:3001/treinos HTTP/1.1
Authorization: Bearer YOUR_TOKEN_HERE
```

**cURL:**
```bash
curl -X GET http://localhost:3001/treinos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

**JavaScript/Axios:**
```typescript
const treinos = await api.get("/treinos", {
  headers: { Authorization: `Bearer ${token}` },
});
console.log(treinos.data);
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-123",
    "personalId": "user-uuid",
    "alunoId": "aluno-uuid",
    "conteudo": {
      "plano": "Hipertrofia muscular",
      "recomendacoes": "Realize 2 min de descanso...",
      "exercicios": [
        {
          "dia": "Segunda-feira",
          "lista": [
            {
              "nome": "Supino",
              "series": 4,
              "reps": "8-10"
            }
          ]
        }
      ]
    },
    "createdAt": "2026-04-21T10:30:00Z",
    "updatedAt": "2026-04-21T10:30:00Z"
  }
]
```

**Erros Possíveis:**
```json
// 401 Unauthorized
{ "error": "Token não fornecido" }

// 401 Unauthorized
{ "error": "Sessão inválida ou expirada" }

// 500 Internal Server Error
{ "error": "Erro ao buscar treinos" }
```

---

### 2️⃣ GET `/treino/:id` - Buscar Treino Específico
Retorna um treino individual (público, não requer autenticação).

```http
GET http://localhost:3001/treino/uuid-123 HTTP/1.1
```

**cURL:**
```bash
curl -X GET http://localhost:3001/treino/uuid-123 \
  -H "Content-Type: application/json"
```

**JavaScript:**
```typescript
const treino = await api.get(`/treino/${treinoId}`);
```

**Response (200 OK):**
```json
{
  "id": "uuid-123",
  "personalId": "user-uuid",
  "alunoId": "aluno-uuid",
  "conteudo": {
    "plano": "Hipertrofia muscular",
    "recomendacoes": "Realize 2 min de descanso...",
    "exercicios": [...]
  }
}
```

**Erros:**
```json
// 404 Not Found
{ "error": "Treino não encontrado" }

// 500 Internal Server Error
{ "error": "Erro ao buscar treino" }
```

---

### 3️⃣ POST `/gerar-sugestao` - Gerar Treino com IA
Usa Google Gemini para gerar um treino personalizado baseado em dados do aluno.

```http
POST http://localhost:3001/gerar-sugestao HTTP/1.1
Content-Type: application/json

{
  "nome": "João Silva",
  "idade": 28,
  "peso": 80,
  "altura": 1.78,
  "objetivo": "Ganho de massa muscular",
  "equipamentos": "Halteres, Barras, Máquinas",
  "limitacoes": "Problema no ombro esquerdo"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/gerar-sugestao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "idade": 28,
    "peso": 80,
    "altura": 1.78,
    "objetivo": "Ganho de massa muscular",
    "equipamentos": "Halteres, Barras, Máquinas",
    "limitacoes": "Problema no ombro esquerdo"
  }'
```

**JavaScript:**
```typescript
const response = await api.post("/gerar-sugestao", {
  nome: "João Silva",
  idade: 28,
  peso: 80,
  altura: 1.78,
  objetivo: "Ganho de massa muscular",
  equipamentos: "Halteres, Barras, Máquinas",
  limitacoes: "Problema no ombro esquerdo"
});

console.log(response.data);
```

**Response (200 OK):**
```json
{
  "plano": "Hipertrofia muscular com foco em segurança articular dado seu problema no ombro...",
  "recomendacoes": "Evite supino inclinado excessivo. Use máquinas quando possível. Mantenha 2-3 min de descanso entre séries.",
  "exercicios": [
    {
      "dia": "Segunda-feira (Peito e Tríceps)",
      "lista": [
        {
          "nome": "Máquina Smith - Supino",
          "series": 4,
          "reps": "8-10",
          "descanso": "2-3 minutos"
        },
        {
          "nome": "Crossover de cabo",
          "series": 3,
          "reps": "10-12",
          "descanso": "2 minutos"
        },
        {
          "nome": "Tríceps na máquina",
          "series": 3,
          "reps": "10-12",
          "descanso": "1.5 minutos"
        }
      ]
    },
    {
      "dia": "Terça-feira (Costas)",
      "lista": [
        {
          "nome": "Lat pulldown",
          "series": 4,
          "reps": "8-10",
          "descanso": "2-3 minutos"
        }
      ]
    }
  ]
}
```

**Possíveis Erros:**
```json
// 400 Bad Request
{ "error": "Dados do aluno incompletos" }

// 500 Internal Server Error
{ "error": "Erro ao gerar sugestão. Tente novamente." }
```

---

### 4️⃣ POST `/salvar-treino` - Salvar/Publicar Treino
Salva um treino no banco de dados e o torna disponível para o aluno.

```http
POST http://localhost:3001/salvar-treino HTTP/1.1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "alunoId": "id-aluno-joao",
  "conteudo": {
    "plano": "Hipertrofia muscular",
    "recomendacoes": "...",
    "exercicios": [...]
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/salvar-treino \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "alunoId": "id-aluno-joao",
    "conteudo": {
      "plano": "Hipertrofia muscular",
      "recomendacoes": "Realize 2 min de descanso...",
      "exercicios": [
        {
          "dia": "Segunda-feira",
          "lista": [
            {
              "nome": "Supino",
              "series": 4,
              "reps": "8-10"
            }
          ]
        }
      ]
    }
  }'
```

**JavaScript:**
```typescript
const token = await supabase.auth.session()?.access_token;

const response = await api.post(
  "/salvar-treino",
  {
    alunoId: "id-aluno-joao",
    conteudo: trascunhoTreino  // Do estado da IA
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log("Treino salvo:", response.data);
```

**Response (200 OK):**
```json
{
  "id": "uuid-123",
  "personalId": "user-uuid",
  "alunoId": "id-aluno-joao",
  "conteudo": {
    "plano": "Hipertrofia muscular",
    "recomendacoes": "...",
    "exercicios": [...]
  },
  "createdAt": "2026-04-21T10:30:00Z"
}
```

**Erros:**
```json
// 401 Unauthorized
{ "error": "Sessão inválida ou expirada" }

// 400 Bad Request
{ "error": "alunoId e conteudo são obrigatórios" }

// 500 Internal Server Error
{ "error": "Erro ao salvar treino" }
```

---

## 🔄 Fluxo Completo de Exemplo

### Passo 1: Gerar Sugestão de Treino
```bash
curl -X POST http://localhost:3001/gerar-sugestao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria",
    "idade": 25,
    "peso": 65,
    "altura": 1.65,
    "objetivo": "Perda de peso",
    "equipamentos": "Esteira, Halteres",
    "limitacoes": "Nenhuma"
  }'
```

**Resultado:** Treino gerado pela IA

### Passo 2: Revisar e Editar (no Frontend)
- Usuário edita os exercícios conforme necessário
- Clica em "ENVIAR PARA ALUNO"

### Passo 3: Salvar Treino
```bash
curl -X POST http://localhost:3001/salvar-treino \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "alunoId": "aluno-maria-123",
    "conteudo": {
      "plano": "...",
      "recomendacoes": "...",
      "exercicios": [...]
    }
  }'
```

**Resultado:** Treino salvo no banco, ID retornado

### Passo 4: Gerar Link para Aluno
```
http://localhost:5173?view=treino-uuid-123
```

### Passo 5: Aluno Acessa Treino
```bash
curl -X GET http://localhost:3001/treino/treino-uuid-123
```

---

## 🧪 Testando com Insomnia/Postman

### Importar Collection

1. Abra **Insomnia** ou **Postman**
2. Clique em **Import**
3. Cole este cURL ou configure manualmente

### Variáveis de Ambiente

Configure em **Manage Environments:**
```json
{
  "base_url": "http://localhost:3001",
  "token": "seu_token_aqui"
}
```

Use nas requisições:
```
GET {{base_url}}/treinos
Authorization: Bearer {{token}}
```

---

## ⚡ Status Codes

| Code | Significado |
|------|------------|
| `200` | OK - Sucesso |
| `201` | Created - Recurso criado |
| `400` | Bad Request - Dados inválidos |
| `401` | Unauthorized - Sem autenticação |
| `403` | Forbidden - Sem permissão |
| `404` | Not Found - Recurso não existe |
| `500` | Server Error - Erro no servidor |

---

## 🛡️ Dicas de Segurança

✅ **Bom:**
```bash
# Token em header
curl -H "Authorization: Bearer token"

# HTTPS em produção
https://api.fiteasy.com/treinos

# Validar dados no backend
if (!body.alunoId) return res.status(400)
```

❌ **Evitar:**
```bash
# Token na URL
GET http://localhost:3001/treinos?token=xxx

# HTTP em produção
http://api.fiteasy.com/treinos

# Expor dados sensíveis
{ password: "123456" }
```

---

## 📝 Comandos Rápidos

```bash
# Listar todos os treinos
curl -H "Authorization: Bearer TOKEN" http://localhost:3001/treinos

# Buscar um treino
curl http://localhost:3001/treino/uuid-123

# Gerar treino rápido
curl -X POST http://localhost:3001/gerar-sugestao -H "Content-Type: application/json" \
  -d '{"nome":"João","idade":30,"peso":80,"altura":1.80,"objetivo":"Ganho de massa","equipamentos":"Halteres","limitacoes":"Nenhuma"}'

# Salvar treino
curl -X POST http://localhost:3001/salvar-treino \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alunoId":"aluno-1","conteudo":{...}}'
```

---

**Última atualização:** Abril 2026  
**Versão API:** v1.0
