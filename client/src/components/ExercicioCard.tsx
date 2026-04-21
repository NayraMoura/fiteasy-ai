interface ExercicioProps {
  nome: string;
  series: number;
  reps: string;
  descanso: string;
}

export function ExercicioCard({
  nome,
  series,
  reps,
  descanso,
}: ExercicioProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors shadow-sm">
      <p className="font-bold text-cyan-50 text-lg mb-2">{nome}</p>
      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span className="bg-slate-900 px-2 py-1 rounded">
          Séries: <b className="text-cyan-400">{series}</b>
        </span>
        <span className="bg-slate-900 px-2 py-1 rounded">
          Reps: <b className="text-cyan-400">{reps}</b>
        </span>
        <span className="bg-slate-900 px-2 py-1 rounded">
          Descanso: <b className="text-cyan-400">{descanso}</b>
        </span>
      </div>
    </div>
  );
}
