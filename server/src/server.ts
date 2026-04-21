import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { supabase } from "./lib/supabase.js";
import { salvarNoBanco } from "./repositories/treinoRepository.js";
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

// --- ROTAS ---

// 3. USO NA ROTA DE SALVAR (Observe o 'authenticate' entre o caminho e a função)
app.post("/salvar-treino", authenticate, async (req: any, res: any) => {
  try {
    const { alunoId, conteudo } = req.body;

    // IMPORTANTE: O personalId não vem mais do body (perigoso),
    // ele vem direto do token autenticado pelo middleware!
    const personalId = req.user.id;

    if (!alunoId || !conteudo) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const treinoFinal = await salvarNoBanco(alunoId, personalId, conteudo);
    return res.status(201).json(treinoFinal);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao salvar" });
  }
});

// --- ROTA 1: LISTAR TODOS OS TREINOS (Visão do Personal) ---
app.get("/treinos", async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(treinos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar treinos" });
  }
});

// --- ROTA 2: BUSCAR UM TREINO ÚNICO (Link do Aluno) ---
// É esta rota que o React vai chamar quando houver um "?view=ID" na URL
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

// --- ROTA 3: GERAR SUGESTÃO (Apenas IA - Rascunho) ---
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

// --- ROTA 4: SALVAR DEFINITIVO (Pós-Revisão da Personal) ---
app.post("/salvar-treino", async (req, res) => {
  try {
    const { alunoId, personalId, conteudo } = req.body;

    if (!alunoId || !personalId || !conteudo) {
      return res
        .status(400)
        .json({ error: "Dados incompletos para salvamento." });
    }

    console.log("💾 Personal validou! Gravando treino definitivo...");
    const treinoFinal = await salvarNoBanco(alunoId, personalId, conteudo);

    return res.status(201).json({
      message: "Treino validado e enviado ao aluno! 🔥",
      dados: treinoFinal,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao persistir treino final" });
  }
});

// --- ROTA PARA DELETAR TREINO ---
app.delete("/treino/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.treino.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir treino" });
  }
});

// --- ROTA PARA OCULTAR/ARQUIVAR TREINO ---
// Usaremos um campo chamado "arquivado" (precisaremos ajustar o Prisma depois)
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
