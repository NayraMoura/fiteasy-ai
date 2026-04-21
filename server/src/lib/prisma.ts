import pg from "pg";
const { Pool } = pg;
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. USANDO CONEXÃO DIRETA (Pula o PgBouncer e evita o erro de Tenant)
const pool = new Pool({
  connectionString:
    "postgresql://postgres:projetonayra2026@db.mjmodblrqbwazpludbkt.supabase.co:5432/postgres",

  // CONFIGURAÇÃO CRÍTICA PARA WINDOWS:
  connectionTimeoutMillis: 10000, // Dá mais tempo para o Windows "achar" o caminho
});

// 2. Adaptador
const adapter = new PrismaPg(pool);

// 3. Instância do Prisma
export const prisma = new PrismaClient({ adapter });
