import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { supabase } from "./lib/supabase.js";
import { gerarTreinoIA } from "./services/geminiService.js";

const app = express();
app.use(express.json());
app.use(cors());

// 2. O MIDDLEWARE (Fica aqui, antes das rotas começarem)
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Valida o token com o Supabase Auth
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Sessão inválida ou expirada" });
  }

  // Salva os dados do usuário na requisição para as rotas usarem
  req.user = data.user;
  next();
};

app.get("/treinos", authenticate, async (req: any, res) => {
  const personalId = req.user.id;

  try {
    const treinos = await prisma.treino.findMany({
      where: { personalId },
      orderBy: { createdAt: "desc" },
      include: {
        aluno: true, // Isso traz os dados do aluno (nome, peso, etc) junto com o treino
      },
    });
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treinos" });
  }
});

app.get("/treino/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const treino = await prisma.treino.findUnique({
      where: { id: id },
    });

    if (!treino) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }

    return res.json(treino);
  } catch (error) {
    console.error("❌ Erro ao buscar treino individual:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.post("/gerar-sugestao", async (req, res) => {
  try {
    const dadosAluno = req.body;
    console.log(`🤖 IA gerando rascunho para: ${dadosAluno.nome}`);

    const sugestaoIA = await gerarTreinoIA(dadosAluno);
    return res.json(sugestaoIA);
  } catch (error: any) {
    console.error("❌ Erro ao gerar rascunho:", error);
    return res.status(500).json({ error: "Falha ao gerar sugestão da IA" });
  }
});

app.post("/salvar-treino", authenticate, async (req: any, res) => {
  const { nome, idade, peso, altura, objetivo, conteudo } = req.body;

  const personalId = req.user.id;

  try {
    await prisma.user.upsert({
      where: { id: personalId },
      update: {},
      create: {
        id: personalId,
        nome: "Nayra Personal",
        email: req.user.email,
      },
    });

    const aluno = await prisma.aluno.upsert({
      where: {
        id: req.body.alunoId || crypto.randomUUID(),
      },
      update: {
        peso: Number(peso),
        altura: Number(altura),
        idade: Number(idade),
        objetivo: objetivo,
      },
      create: {
        nome: nome,
        idade: Number(idade),
        peso: Number(peso),
        altura: Number(altura),
        objetivo: objetivo,
        limitacoes: conteudo.limitacoes || [],
      },
    });

    const novoTreino = await prisma.treino.create({
      data: {
        personalId: personalId,
        alunoId: aluno.id,
        conteudo: conteudo, 
      },
    });

    res.json(novoTreino);
  } catch (error) {
    console.error("Erro ao salvar treino:", error);
    res.status(500).json({ error: "Erro interno ao salvar o treino." });
  }
});

// --- ROTA PARA DELETAR TREINO --- implementação pendente
app.delete("/treino/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.treino.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir treino" });
  }
});

// --- ROTA PARA OCULTAR/ARQUIVAR TREINO --- implementação pendente
app.patch("/treino/:id/arquivar", async (req, res) => {
  try {
    const { id } = req.params;
    const { arquivado } = req.body;

    await prisma.treino.update({
      where: { id },
      data: { arquivado },
    });

    return res.json({ message: "Status atualizado" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

const PORT = 3333;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 FitEasy AI Backend rodando em http://localhost:${PORT}`);
});
