import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { supabase } from "./lib/supabase.js";
import { gerarTreinoIA } from "./services/geminiService.js";
import { CriarTreinoSchema } from "./schemas/treinoSchema.js"; // Garanta o .js se usar ESM
import { z } from "zod";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cors());

const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: "Sessão inválida ou expirada" });

  req.user = data.user;
  next();
};

// --- ROTAS DE BUSCA ---
app.get("/treinos", authenticate, async (req: any, res) => {
  const personalId = req.user.id;
  try {
    const treinos = await prisma.treino.findMany({
      where: { personalId },
      orderBy: { createdAt: "desc" },
      include: { aluno: true },
    });
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treinos" });
  }
});

app.get("/treino/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const treino = await prisma.treino.findUnique({ where: { id } });
    if (!treino) return res.status(404).json({ error: "Treino não encontrado" });
    return res.json(treino);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// --- ROTA DE GERAÇÃO (IA) ---
app.post("/gerar-sugestao", async (req, res) => {
  try {
    const dadosValidados = CriarTreinoSchema.parse(req.body);
    console.log(`🤖 IA gerando rascunho para: ${dadosValidados.nome}`);
    const sugestaoIA = await gerarTreinoIA(dadosValidados);
    return res.json(sugestaoIA);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Dados do formulário inválidos",
        detalhes: error.issues.map(i => `${i.path.join(".")}: ${i.message}`),
      });
    }
    return res.status(500).json({ error: "Falha ao gerar sugestão" });
  }
});

// --- ROTA DE SALVAMENTO (REVISADA COM ZOD) ---
app.post("/salvar-treino", authenticate, async (req: any, res) => {
  try {
    // 1. Validar a entrada com Zod (Isso resolve o erro 400)
    const dadosValidados = CriarTreinoSchema.parse(req.body);
    const { nome, idade, peso, altura, objetivo, conteudo } = dadosValidados;
    const personalId = req.user.id;

    // 2. Garantir que o Personal existe no banco
    await prisma.user.upsert({
      where: { id: personalId },
      update: {},
      create: {
        id: personalId,
        nome: "Nayra Personal",
        email: req.user.email,
      },
    });

    // 3. Upsert do Aluno (Usando os dados já convertidos pelo Zod)
    const aluno = await prisma.aluno.upsert({
      where: { 
        id: req.body.alunoId && req.body.alunoId !== "temp-id" 
            ? req.body.alunoId 
            : crypto.randomUUID() 
      },
      update: { peso, altura, idade, objetivo },
      create: { 
        nome, 
        idade, 
        peso, 
        altura, 
        objetivo,
        limitacoes: (conteudo as any)?.limitacoes || [] 
      },
    });

    // 4. Salvar o treino vinculado
    const novoTreino = await prisma.treino.create({
      data: {
        personalId,
        alunoId: aluno.id,
        conteudo: conteudo as any,
      },
    });

    return res.json(novoTreino);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error("⚠️ Erro de validação ao salvar:", error.issues);
      return res.status(400).json({
        error: "Dados inválidos para salvamento",
        detalhes: error.issues.map(i => `${i.path.join(".")}: ${i.message}`),
      });
    }
    console.error("❌ Erro ao salvar treino:", error);
    return res.status(500).json({ error: "Erro interno ao salvar o treino." });
  }
});

// --- OUTRAS ROTAS ---
app.delete("/treino/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.treino.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir treino" });
  }
});

app.patch("/treino/:id/arquivar", async (req, res) => {
  try {
    const { id } = req.params;
    const { arquivado } = req.body;
    await prisma.treino.update({ where: { id }, data: { arquivado } });
    return res.json({ message: "Status atualizado" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

const PORT = 3333;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 FitEasy AI Backend rodando em http://localhost:${PORT}`);
});