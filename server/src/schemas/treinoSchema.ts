import { z } from "zod";

export const CriarTreinoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  idade: z.coerce.number().int().positive("Idade deve ser um número positivo"),
  peso: z.coerce.number().positive("Peso deve ser positivo"),
  altura: z.coerce.number().positive("Altura deve ser positiva"),
  objetivo: z.string(),
  limitacoes: z.array(z.string()).optional(),
  equipamentos: z.array(z.string()).optional(),
  conteudo: z.any(),
});
