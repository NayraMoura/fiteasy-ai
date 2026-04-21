import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// O "!" garante ao TS que a chave existe no .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Usamos o modelo Flash por ser mais rápido e barato (grátis no tier base)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }, // Força a resposta em JSON
});

export async function gerarTreinoIA(dadosAluno: any) {
  const prompt = `
    Você é um Personal Trainer sênior focado em segurança e resultados.
    Analise os dados do aluno: ${JSON.stringify(dadosAluno)}
    
    Crie um cronograma de treino semanal. 
    REGRAS OBRIGATÓRIAS:
    1. Se o aluno tiver limitações como "${dadosAluno.limitacoes}", adapte ou substitua exercícios que sobrecarreguem essa área.
    2. Use apenas os equipamentos: ${dadosAluno.equipamentos}.
    3. O foco é o objetivo: ${dadosAluno.objetivo}.

    Retorne EXATAMENTE este formato JSON:
    {
      "plano": "Um resumo motivador e técnico do foco do treino semanal",
      "recomendacoes": "Orientações sobre postura, hidratação e cuidados com as limitações",
      "exercicios": [
        {
          "dia": "ex: Segunda-feira (Peito e Tríceps)",
          "lista": [
            { "nome": "string", "series": number, "reps": "string", "descanso": "string" }
          ]
        }
      ]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Esse log vai nos mostrar exatamente o que a IA respondeu antes de dar erro
    console.log("RESPOSTA DA IA:", text);

    // Limpa o texto caso a IA envie marcações de código (```json)
    const cleanText = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanText);
  } catch (error: any) {
    console.error("DETALHE DO ERRO:", error); // Isso vai imprimir o erro real no terminal
    throw new Error("Falha ao gerar treino");
  }
}
