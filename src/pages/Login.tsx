import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🧠 VALIDACIÓN
  const validate = () => {
    if (!email.trim() || !password.trim()) {
      alert("Completa todos los campos");
      return false;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Correo inválido");
      return false;
    }

    return true;
  };

  // 🟢 REGISTRO
  const signUp = async () => {
    if (!validate()) return;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Usuario registrado ✔");
  };

  // 🔵 LOGIN
  const signIn = async () => {
    if (!validate()) return;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Sesión iniciada ✔");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-slate-900 p-6 rounded-2xl shadow-lg">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          🔐 Iniciar Sesión
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-slate-800 outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-5 rounded-xl bg-slate-800 outline-none"
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={signIn}
          className="bg-emerald-500 w-full py-3 rounded-xl mb-3 font-semibold hover:bg-emerald-400 transition"
        >
          Iniciar Sesión
        </button>

        {/* REGISTER BUTTON */}
        <button
          onClick={signUp}
          className="bg-blue-500 w-full py-3 rounded-xl font-semibold hover:bg-blue-400 transition"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}