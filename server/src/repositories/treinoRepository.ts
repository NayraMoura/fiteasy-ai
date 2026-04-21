import { prisma } from "../lib/prisma.js";

// Definimos uma interface para o conteúdo do treino para ter mais segurança
interface ConteudoTreino {
  plano: string;
  exercicios?: any[]; // Depois podemos detalhar isso mais
  observacoes?: string;
  dadosOriginais?: any;
}
