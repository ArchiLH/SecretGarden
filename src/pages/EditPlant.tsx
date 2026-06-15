import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function EditPlant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [humidity, setHumidity] = useState("");
  const [temperature, setTemperature] = useState("");

  useEffect(() => {
    loadPlant();
  }, []);

  const loadPlant = async () => {
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setName(data.name);
    setHumidity(data.humidity.toString());
    setTemperature(data.temperature.toString());
  };

  const updatePlant = async () => {
    const { error } = await supabase
      .from("plants")
      .update({
        name,
        humidity: Number(humidity),
        temperature: Number(temperature),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Planta actualizada");
    navigate("/plants");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5">
      <h1 className="text-3xl font-bold mb-5">
        ✏️ Editar Planta
      </h1>

      <input
        className="w-full p-3 mb-3 rounded-xl bg-slate-800"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-3 mb-3 rounded-xl bg-slate-800"
        value={humidity}
        onChange={(e) => setHumidity(e.target.value)}
      />

      <input
        className="w-full p-3 mb-3 rounded-xl bg-slate-800"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
      />

      <button
        onClick={updatePlant}
        className="bg-blue-500 px-5 py-3 rounded-xl w-full"
      >
        Guardar Cambios
      </button>
    </div>
  );
}