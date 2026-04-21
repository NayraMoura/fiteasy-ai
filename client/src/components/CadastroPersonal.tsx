import { useState } from "react";
import { supabase } from "../lib/supabase";

export function CadastroPersonal() {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isReset) {
        // LÓGICA DE RECUPERAÇÃO DE SENHA
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`, // Para onde ele volta após clicar no e-mail
        });
        if (error) throw error;
        alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        setIsReset(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Verifique seu e-mail para confirmar o cadastro!");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Se estiver em modo de recuperação, renderiza uma versão simplificada
  if (isReset) {
    return (
      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Recuperar Senha
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Enviaremos um link para o seu e-mail.
        </p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 py-3 rounded-xl font-bold"
          >
            {loading ? "Enviando..." : "Enviar Link de Recuperação"}
          </button>
        </form>
        <button
          onClick={() => setIsReset(false)}
          className="w-full mt-4 text-sm text-slate-500 hover:text-white transition-colors"
        >
          ← Voltar para o login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isLogin ? "Bem-vindo(a) de volta!" : "Criar sua conta profissional"}
      </h2>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">
            E-mail
          </label>
          <input
            type="email"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mt-1 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">
            Senha
          </label>
          <input
            type="password"
            required={!isReset}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mt-1 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsReset(true)}
              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 py-3 rounded-xl font-bold"
        >
          {loading
            ? "Processando..."
            : isLogin
              ? "Entrar"
              : "Finalizar Cadastro"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-cyan-400 hover:underline"
        >
          {isLogin
            ? "Não tem uma conta? Cadastre-se agora"
            : "Já possui uma conta? Faça login"}
        </button>
      </div>
    </div>
  );
}
