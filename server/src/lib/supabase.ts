import { createClient } from "@supabase/supabase-js";

// Essas variáveis devem estar no seu arquivo .env na pasta server
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Faltam variáveis de ambiente do Supabase no servidor.");
}

// Criamos o cliente com a Service Role Key (Chave Mestra)
// Ela ignora as regras de RLS, por isso só deve existir aqui no BACKEND.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
