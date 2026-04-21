import { useState } from "react";

interface FormularioProps {
  onGerar: (dados: any) => void;
  loading: boolean;
}

export function FormularioTreino({ onGerar, loading }: FormularioProps) {
  const [formData, setFormData] = useState({
    nome: "",
    objetivo: "emagrecimento",
    equipamentos: "",
    limitacoes: "",
    alunoId: "id-aluno-joao", // Temporário até termos login
    personalId: "id-personal-nayra",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transformamos as strings separadas por vírgula em arrays
    const dadosFormatados = {
      ...formData,
      equipamentos: formData.equipamentos.split(",").map((i) => i.trim()),
      limitacoes: formData.limitacoes.split(",").map((i) => i.trim()),
    };
    onGerar(dadosFormatados);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4"
    >
      <h2 className="text-xl font-bold text-cyan-400 mb-4">
        Novo Planejamento
      </h2>

      <div>
        <label className="block text-sm font-medium text-slate-400">
          Nome do Aluno
        </label>
        <input
          type="text"
          required
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400">
            Objetivo
          </label>
          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            onChange={(e) =>
              setFormData({ ...formData, objetivo: e.target.value })
            }
          >
            <option value="emagrecimento">Emagrecimento</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="condicionamento">Condicionamento</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400">
            Equipamentos (separados por vírgula)
          </label>
          <input
            type="text"
            placeholder="Ex: Halteres, Elástico"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            onChange={(e) =>
              setFormData({ ...formData, equipamentos: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400">
          Limitações / Dores
        </label>
        <input
          type="text"
          placeholder="Ex: Dor no joelho, Lombar"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
          onChange={(e) =>
            setFormData({ ...formData, limitacoes: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all"
      >
        {loading
          ? "🤖 Inteligência Artificial pensando..."
          : "Gerar Sugestão de Treino"}
      </button>
    </form>
  );
}
