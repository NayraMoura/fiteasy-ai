import { z } from "zod";

export const CriarTreinoSchema = z.object({
  nomeAluno: z.string().min(3, "Nome muito curto"),
  idade: z.number().int().positive(),
  objetivo: z.enum(['hipertrofia', 'emagrecimento', 'condicionamento']),
  limitacoes: z.array(z.string()).optional(),
  equipamentos: z.array(z.string())
});