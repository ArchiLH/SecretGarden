import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AddPlant() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [humidity, setHumidity] = useState("");
  const [temperature, setTemperature] = useState("");

  const savePlant = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Debes iniciar sesión");
    return;
  }

  const { error } = await supabase
    .from("plants")
    .insert({
      name,
      humidity: Number(humidity),
      temperature: Number(temperature),
      status: "Healthy",
      user_id: user.id,
    });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Planta guardada");
  navigate("/plants");
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5">
      <h1 className="text-3xl font-bold mb-5">
        ➕ Nueva Planta
      </h1>

      <input
        className="w-full p-3 mb-3 rounded-xl bg-slate-800"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-3 mb-3 rounded-xl bg-slate-800"
        placeholder="Humedad"
        type="number"
        value={humidity}
        onChange={(e) => setHumidity(e.target.value)}
      />

      <input
        className="w-full p-3 mb-3 rounded-xl bg-slate-800"
        placeholder="Temperatura"
        type="number"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
      />

      <button
        onClick={savePlant}
        className="bg-emerald-500 px-5 py-3 rounded-xl w-full"
      >
        Guardar
      </button>
    </div>
  );
}