import { useState } from "react";

interface FormularioProps {
  onGerar: (dados: any) => void;
  loading: boolean;
}

export function FormularioTreino({ onGerar, loading }: FormularioProps) {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    objetivo: "emagrecimento",
    equipamentos: "",
    limitacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosFormatados = {
      ...formData,
      // Garantimos que números sejam enviados como números
      idade: Number(formData.idade),
      peso: Number(formData.peso),
      altura: Number(formData.altura),
      equipamentos: formData.equipamentos
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
      limitacoes: formData.limitacoes
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
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
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Nome do Aluno
        </label>
        <input
          type="text"
          required
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Idade
          </label>
          <input
            type="number"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.idade}
            onChange={(e) =>
              setFormData({ ...formData, idade: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            step="0.1"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.altura}
            onChange={(e) =>
              setFormData({ ...formData, altura: e.target.value })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Objetivo
          </label>
          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.objetivo}
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
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Equipamentos
          </label>
          <input
            type="text"
            placeholder="Halteres, Elástico..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.equipamentos}
            onChange={(e) =>
              setFormData({ ...formData, equipamentos: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Limitações / Dores
        </label>
        <input
          type="text"
          placeholder="Ex: Dor no joelho"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          value={formData.limitacoes}
          onChange={(e) =>
            setFormData({ ...formData, limitacoes: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
      >
        {loading ? "🤖 IA Analisando Perfil..." : "Gerar Sugestão de Treino 🚀"}
      </button>
    </form>
  );
}
