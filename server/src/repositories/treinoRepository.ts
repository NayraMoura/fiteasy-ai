import { prisma } from "../lib/prisma.js";

// Definimos uma interface para o conteúdo do treino para ter mais segurança
interface ConteudoTreino {
  plano: string;
  exercicios?: any[]; // Depois podemos detalhar isso mais
  observacoes?: string;
  dadosOriginais?: any;
}

export async function salvarNoBanco(
  alunoId: string,
  personalId: string,
  conteudo: ConteudoTreino, // Usando a interface aqui
) {
  try {
    // 1. Verificações de existência (Mantenha, pois evita erros de chave estrangeira)
    const [alunoExiste, personalExiste] = await Promise.all([
      prisma.aluno.findUnique({ where: { id: alunoId } }),
      prisma.user.findUnique({ where: { id: personalId } }),
    ]);

    if (!alunoExiste) {
      throw new Error(`Aluno com ID ${alunoId} não encontrado.`);
    }

    if (!personalExiste) {
      throw new Error(`Personal com ID ${personalId} não encontrado.`);
    }

    // 2. Criação do treino com o retorno tipado
    const treinoCriado = await prisma.treino.create({
      data: {
        alunoId,
        personalId,
        // O Prisma aceita o Record<string, any> como Json
        conteudo: conteudo as any, 
      },
    });

    console.log(`✅ Treino salvo com sucesso para o aluno: ${alunoId}`);
    return treinoCriado;

  } catch (error) {
    // Tratamento de erro mais elegante
    if (error instanceof Error) {
      console.error("❌ Erro no Repositório de Treino:", error.message);
    }
    throw error;
  }
}