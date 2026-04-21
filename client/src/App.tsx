import { useState, useEffect } from "react";
import { api } from "./services/api";
import { FormularioTreino } from "./components/FormularioTreino";
import { supabase } from "./lib/supabase";
import { CadastroPersonal } from "./components/CadastroPersonal";

export default function App() {
  const [etapa, setEtapa] = useState<
    "lista" | "form" | "revisao" | "view_aluno"
  >("lista");
  const [loading, setLoading] = useState(false);
  const [treinos, setTreinos] = useState<any[]>([]);
  const [rascunho, setRascunho] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [visiveis, setVisiveis] = useState<Record<string, boolean>>({});

  const toggleVisibilidade = (id: string) => {
    setVisiveis((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const params = new URLSearchParams(window.location.search);
  const treinoIdParaVisualizar = params.get("view");

  // 1. MONITOR DE AUTENTICAÇÃO
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (event === "PASSWORD_RECOVERY") {
        const novaSenha = prompt("Digite sua nova senha:");
        if (novaSenha) {
          const { error } = await supabase.auth.updateUser({
            password: novaSenha,
          });
          if (error) alert("Erro: " + error.message);
          else alert("Senha atualizada!");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. BUSCAR TREINO ÚNICO (VISÃO DO ALUNO)
  useEffect(() => {
    if (treinoIdParaVisualizar) {
      api
        .get(`/treino/${treinoIdParaVisualizar}`)
        .then((res) => {
          setRascunho(res.data.conteudo);
          setEtapa("view_aluno");
        })
        .catch(() => alert("Treino não encontrado."));
    }
  }, [treinoIdParaVisualizar]);

  // 3. BUSCAR LISTA DE TREINOS (VISÃO DO PERSONAL)
  useEffect(() => {
    const buscarTreinos = async () => {
      if (
        etapa === "lista" &&
        !treinoIdParaVisualizar &&
        session?.access_token
      ) {
        try {
          const res = await api.get("/treinos", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          setTreinos(res.data);
        } catch (err) {
          console.error("Erro ao carregar lista", err);
        }
      }
    };
    buscarTreinos();
  }, [etapa, treinoIdParaVisualizar, session]);

  const gerarSugestaoIA = async (dadosDoFormulario: any) => {
    setLoading(true);
    try {
      const respostaIA = await api.post("/gerar-sugestao", dadosDoFormulario);

      setRascunho({
        ...dadosDoFormulario,
        ...respostaIA.data,
      });

      setEtapa("revisao");
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar treino com IA.");
    } finally {
      setLoading(false);
    }
  };

  const publicarTreino = async () => {
    const token = session?.access_token;
    if (!token) return alert("Sessão expirada.");

    // Validar se temos os dados necessários no rascunho
    if (!rascunho || !rascunho.nome) {
      return alert("Dados do treino incompletos.");
    }

    try {
      await api.post(
        "/salvar-treino",
        {
          // Envia os dados do aluno para o servidor criar/atualizar o registro
          alunoId: rascunho.alunoId || "temp-id", // Caso ainda use IDs temporários
          nome: rascunho.nome,
          idade: rascunho.idade,
          peso: rascunho.peso,
          altura: rascunho.altura,
          objetivo: rascunho.objetivo,
          conteudo: rascunho,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(`Treino de ${rascunho.nome} publicado com sucesso! 🎉`);
      setEtapa("lista");
      setRascunho(null);
    } catch (error: any) {
      console.error(error);
      alert(
        "Erro ao publicar: " + (error.response?.data?.error || error.message),
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      {!session && etapa !== "view_aluno" ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            FitEasy AI 🦾
          </h1>
          <CadastroPersonal />
        </div>
      ) : (
        <>
          <header className="max-w-5xl mx-auto flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FitEasy AI 🦾
              </h1>
              <p className="text-slate-500 text-sm">
                Assistente Inteligente para Personal Trainers
              </p>
            </div>
            {session && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="no-print text-xs text-slate-500 hover:text-red-400 border border-slate-700 px-3 py-1 rounded-lg"
              >
                Sair
              </button>
            )}
            {etapa === "lista" && !treinoIdParaVisualizar && (
              <button
                onClick={() => setEtapa("form")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
              >
                + Criar Novo Treino
              </button>
            )}
          </header>

          <main className="max-w-5xl mx-auto">
            {etapa === "view_aluno" && rascunho && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {rascunho.plano}
                  </h3>
                  <p className="text-slate-400 mb-8">
                    {rascunho.recomendacoes}
                  </p>
                  <div className="space-y-8">
                    {rascunho.exercicios?.map((dia: any, dIdx: number) => (
                      <div key={dIdx} className="space-y-4">
                        <h4 className="text-lg font-bold text-cyan-400 border-b border-slate-700 pb-2">
                          {dia.dia}
                        </h4>
                        <div className="grid gap-4">
                          {dia.lista?.map((ex: any, exIdx: number) => (
                            <div
                              key={exIdx}
                              className="bg-slate-900/50 p-4 rounded-xl flex justify-between items-center border border-slate-800"
                            >
                              <div>
                                <p className="font-bold text-white">
                                  {ex.nome}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {ex.series} séries de {ex.reps}
                                </p>
                              </div>
                              <a
                                href={`https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(ex.nome)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                              >
                                <span>▶</span> Ver Execução
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {etapa === "form" && (
              <div className="animate-in slide-in-from-bottom-4">
                <button
                  onClick={() => setEtapa("lista")}
                  className="text-slate-500 mb-4"
                >
                  ← Voltar
                </button>
                <FormularioTreino onGerar={gerarSugestaoIA} loading={loading} />
              </div>
            )}

            {/* ETAPA 2: REVISÃO EDITÁVEL */}
            {etapa === "revisao" && rascunho && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-sm">
                    IA
                  </span>
                  Revisão do Profissional
                </h2>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6 shadow-2xl">
                  {/* Resumo do Plano */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Objetivo e Recomendações
                    </label>
                    <textarea
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                      rows={3}
                      value={rascunho.plano}
                      onChange={(e) =>
                        setRascunho({ ...rascunho, plano: e.target.value })
                      }
                    />
                  </div>

                  {/* Lista de Exercícios */}
                  <div className="space-y-6">
                    {rascunho.exercicios?.map((dia: any, diaIdx: number) => (
                      <div
                        key={diaIdx}
                        className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-inner"
                      >
                        <input
                          className="bg-transparent text-cyan-400 font-black text-xl mb-6 w-full border-b border-slate-800 focus:border-cyan-500 outline-none pb-2"
                          value={dia.dia}
                          onChange={(e) => {
                            const novos = [...rascunho.exercicios];
                            novos[diaIdx].dia = e.target.value;
                            setRascunho({ ...rascunho, exercicios: novos });
                          }}
                        />

                        <div className="space-y-4">
                          {dia.lista?.map((ex: any, exIdx: number) => (
                            <div
                              key={exIdx}
                              className="flex flex-col md:flex-row gap-3 bg-slate-800/80 p-4 rounded-xl items-center border border-slate-700/50"
                            >
                              {/* Nome do Exercício */}
                              <input
                                className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-sm text-white font-medium"
                                value={ex.nome}
                                onChange={(e) => {
                                  const novos = [...rascunho.exercicios];
                                  novos[diaIdx].lista[exIdx].nome =
                                    e.target.value;
                                  setRascunho({
                                    ...rascunho,
                                    exercicios: novos,
                                  });
                                }}
                              />

                              {/* Séries e Reps */}
                              <div className="flex gap-2 w-full md:w-auto">
                                <input
                                  className="w-16 bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-sm text-white text-center"
                                  value={ex.series}
                                  onChange={(e) => {
                                    const novos = [...rascunho.exercicios];
                                    novos[diaIdx].lista[exIdx].series =
                                      e.target.value;
                                    setRascunho({
                                      ...rascunho,
                                      exercicios: novos,
                                    });
                                  }}
                                />
                                <input
                                  className="w-24 bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-sm text-white text-center"
                                  value={ex.reps}
                                  onChange={(e) => {
                                    const novos = [...rascunho.exercicios];
                                    novos[diaIdx].lista[exIdx].reps =
                                      e.target.value;
                                    setRascunho({
                                      ...rascunho,
                                      exercicios: novos,
                                    });
                                  }}
                                />
                              </div>

                              {/* BOTÃO DE VÍDEO - FORÇADO A APARECER */}
                              <a
                                href={`https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(ex.nome)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 text-cyan-400 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-cyan-500/20"
                              >
                                <span>▶</span> VÍDEO
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botões de Finalização */}
                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <button
                      onClick={() => setEtapa("form")}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                      Descartar e Voltar
                    </button>
                    <button
                      onClick={publicarTreino}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      🚀 ENVIAR PARA ALUNO
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: LISTA DE TREINOS */}
            {etapa === "lista" && (
              <div className="grid gap-8">
                {treinos.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-white">
                      {t.conteudo.plano}
                    </h3>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}?view=${t.id}`;
                          navigator.clipboard.writeText(link);
                          alert("Link copiado!");
                        }}
                        className="bg-slate-700 px-3 py-2 rounded-lg text-xs"
                      >
                        🔗 Link
                      </button>
                    </div>
                  </div>
                ))}
                {treinos.length === 0 && (
                  <p className="text-center text-slate-600 py-20">
                    Nenhum treino gerado.
                  </p>
                )}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
