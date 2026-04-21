# 🤝 Contributing Guide - FitEasy AI

Obrigado por contribuir para o FitEasy AI! Este guia explica como colaborar com o projeto.

---

## 📋 Índice

- [Code of Conduct](#code-of-conduct)
- [Como Começar](#como-começar)
- [Processo de Contribuição](#processo-de-contribuição)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

---

## 🛡️ Code of Conduct

- Respeite todos os colaboradores
- Evite linguagem ofensiva ou discriminatória
- Reporte comportamentos inapropriados para o maintainer
- Colabore com boa fé e construtividade

---

## 🚀 Como Começar

### 1. Fork o Repositório
```bash
# Clique em "Fork" no GitHub
git clone https://github.com/seu-usuario/fiteasy-ai.git
cd fiteasy-ai
```

### 2. Criar Branch de Feature
```bash
git checkout -b feature/sua-feature-descritiva
# ou
git checkout -b fix/corrigindo-algo
# ou
git checkout -b docs/melhorando-readme
```

### 3. Desenvolvimento Local
```bash
# Siga as instruções de setup em QUICKSTART.md
npm run dev  # Frontend + Backend
```

### 4. Testar Mudanças
```bash
# Frontend
cd client
npm run build
npm run lint

# Backend
cd server
npm run build
```

---

## 📝 Processo de Contribuição

### Estágios

1. **Create Issue** - Descreva a mudança/bug (se não existir)
2. **Fork** - Clone seu próprio fork
3. **Branch** - Crie branch descritiva
4. **Code** - Implemente com qualidade
5. **Test** - Teste completamente
6. **Commit** - Escreva commits claros
7. **Push** - Envie para seu fork
8. **PR** - Abra Pull Request
9. **Review** - Responda aos comentários
10. **Merge** - Sua contribuição será mergeada!

---

## 💻 Padrões de Código

### Frontend (React + TypeScript)

✅ **Bom:**
```typescript
// 1. Type tudo
interface Usuario {
  id: string;
  nome: string;
  email: string;
}

// 2. Use componentes funcionais com hooks
export function CadastroUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      await api.post("/usuarios", usuario);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Conteúdo */}
    </div>
  );
}

// 3. Use Tailwind para estilização
// ❌ Evite CSS-in-JS ou inline styles
```

❌ **Ruim:**
```typescript
// Componente classe (padrão antigo)
class CadastroUsuario extends React.Component {}

// Sem tipos TypeScript
const [usuario, setUsuario] = useState();

// Inline styles
<div style={{ color: "blue", fontSize: "16px" }}>

// Console.logs desnecessários
console.log("blabla");
```

### Backend (Express + TypeScript)

✅ **Bom:**
```typescript
// 1. Middleware para validação
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  // ... validar token
  next();
};

// 2. Type para request/response
app.post("/treinos", authenticate, async (req: Request, res: Response) => {
  try {
    const { alunoId, conteudo } = req.body;
    // ... operações
    res.json({ success: true, data });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao salvar" });
  }
});

// 3. Error handling apropriado
throw new Error("Mensagem descritiva");
```

❌ **Ruim:**
```typescript
// Sem validação
app.post("/treinos", async (req, res) => {
  // ...
});

// Sem error handling
const data = JSON.parse(req.body); // pode quebrar

// Console.logs em produção
console.log("Isso vai aparecer sempre!");
```

### Geral

```typescript
// ✅ Use const e let (não var)
const nome = "João";
let contador = 0;

// ✅ Destructuring
const { nome, email } = usuario;

// ✅ Arrow functions
const somar = (a: number, b: number) => a + b;

// ✅ Template literals
const msg = `Olá, ${nome}!`;

// ✅ Async/await
const dados = await api.get("/usuarios");

// ❌ Evite
var nome = "João";                    // var é confuso
const somar = function(a, b) {};     // function declaration
const msg = "Olá, " + nome + "!";    // concatenação
```

---

## 📌 Commits

### Formato: `tipo: descrição`

**Tipos:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem mudança lógica)
- `refactor:` - Mejora de código
- `perf:` - Performance
- `test:` - Testes
- `chore:` - Setup/dependências

### Exemplos

```bash
# ✅ Bom
git commit -m "feat: adicionar botão de compartilhamento de treino"
git commit -m "fix: corrigir erro ao buscar treino no mobile"
git commit -m "docs: adicionar instrução de setup Supabase"
git commit -m "refactor: simplificar lógica de geração de treino"

# ❌ Evitar
git commit -m "alterações"
git commit -m "fix"
git commit -m "Updated files"
git commit -m "wip"  # Use em branches locais, não em commits finais
```

---

## 🔄 Pull Requests

### Template PR

```markdown
## 📝 Descrição
Breve descrição do que foi feito.

## 🎯 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Mudança em documentação
- [ ] Outro

## 🧪 Como Testar
1. Passo 1
2. Passo 2
3. Verificar resultado

## ✅ Checklist
- [ ] Código segue padrões do projeto
- [ ] Testei em local
- [ ] Sem console.logs desnecessários
- [ ] Atualizei documentação
- [ ] Commits são claros e descritivos

## 📸 Screenshots (se aplicável)
[Cole prints aqui]
```

### Revisar PR
```bash
# Baixe a branch do PR
git fetch origin pull/ID/head:local-pr-branch
git checkout local-pr-branch

# Teste localmente
npm install
npm run build
npm run dev

# Se tudo ok
git checkout main
git merge local-pr-branch
```

---

## 🗂️ Estrutura de Pastas

```
✅ Bom
src/
├── services/          # Lógica de negócio (IA, APIs)
├── components/        # React components (Frontend)
├── repositories/      # Database queries
└── lib/              # Utilitários (Supabase, Prisma)

❌ Evitar
src/
├── utils.js          # Vago demais
├── helpers/
├── functions/
└── misc/
```

---

## 🧬 Exemplos Práticos

### Adicionando Nova Funcionalidade

**1. Criar Issue descrevendo a feature**
```
Título: Adicionar filtro de treinos por objetivo
Descrição: 
- Usuários precisam filtrar treinos por "Ganho de massa", "Perda de peso", etc
- Deve aparecer na lista de treinos
- Backend: GET /treinos?objetivo=ganho_massa
```

**2. Branch com nome claro**
```bash
git checkout -b feature/adicionar-filtro-treino
```

**3. Código com qualidade**
```typescript
// client/src/components/TreinoFilter.tsx
interface TreinoFilterProps {
  objetivos: string[];
  onSelect: (objetivo: string) => void;
}

export function TreinoFilter({ objetivos, onSelect }: TreinoFilterProps) {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Todos</option>
      {objetivos.map((obj) => (
        <option key={obj} value={obj}>{obj}</option>
      ))}
    </select>
  );
}
```

**4. Atualizar documentação**
```markdown
# Em README.md, adicionar:

### Filtrar Treinos
```bash
GET /treinos?objetivo=ganho_massa
```
```

**5. Commit claro**
```bash
git add .
git commit -m "feat: adicionar filtro de treinos por objetivo"
git push origin feature/adicionar-filtro-treino
```

**6. PR com descrição**
```
## Descrição
Implementei filtro de treinos por objetivo.

## Tipo
- [x] Nova funcionalidade

## Como Testar
1. Abra lista de treinos
2. Selecione um objetivo no filtro
3. Verifique se treinos são filtrados

## Checklist
- [x] Testei em local
- [x] Sem console.logs
- [x] Código segue padrões
```

---

## 🚫 O Que NÃO Fazer

❌ **Não faça:**
- Fazer commits sem testar
- Usar console.log em código de produção
- Modificar .gitignore desnecessariamente
- Fazer PR muito grande (>400 linhas)
- Adicionar dependências sem discutir
- Fazer commits em main branch (sempre use branch)
- Esquecer de atualizar tipos TypeScript
- Deixar console.error sem tratamento claro

---

## 🎓 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Express Guide](https://expressjs.com/guide/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Git Workflow](https://guides.github.com/introduction/flow/)

---

## 📞 Ajuda

Dúvidas? Converse conosco:
- Abra issue no GitHub
- Consulte QUICKSTART.md
- Revise README.md

---

**Obrigado por contribuir! 🙏**

Sua contribuição ajuda a melhorar o FitEasy AI para todos!
