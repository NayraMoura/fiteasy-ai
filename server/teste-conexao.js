import pg from "pg";
const { Client } = pg;

// 1. Usamos o domínio DIRETO (db.mjmod...)
// 2. Usamos o usuário SIMPLES 'postgres' (Sem o ponto e o ID)
// 3. Mantemos a porta 5432
const connectionString =
  "postgresql://postgres:projetonayra2026@db.mjmodblrqbwazpludbkt.supabase.co:5432/postgres";

const client = new Client({ connectionString });

async function testar() {
  try {
    console.log("⏳ Banco acordado! Tentando conexão final...");
    await client.connect();
    console.log("✅ VITÓRIA! CONEXÃO ESTABELECIDA!");

    const res = await client.query("SELECT NOW()");
    console.log("📅 Hora no banco:", res.rows[0].now);

    await client.end();
  } catch (err) {
    console.error("❌ AINDA TEMOS UM DETALHE:", err.message);
  }
}

testar();
