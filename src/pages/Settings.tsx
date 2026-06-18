import { supabase } from "../lib/supabase";

export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-5">
      <h1 className="text-3xl font-bold mb-5">
        ⚙️ Configuración
      </h1>

      <button
        onClick={() => supabase.auth.signOut()}
        className="bg-red-500 px-5 py-3 rounded-xl"
      >
        Cerrar sesión
      </button>
    </div>
  );
} 