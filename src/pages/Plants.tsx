import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

type Plant = {
  id: number;
  name: string;
  humidity: number;
  temperature: number;
  status: string;
  photo_url: string | null;
};

export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    fetchPlants();

    // ⚡ REALTIME
    const channel = supabase
      .channel("plants-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "plants" },
        () => fetchPlants()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 📦 GET PLANTS (por usuario)
  const fetchPlants = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setPlants(data as Plant[]);
  };

  // 🗑️ DELETE
  const deletePlant = async (id: number) => {
    const confirmDelete = window.confirm("¿Eliminar planta?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("id", id);

    if (error) console.error(error);
  };

  // ✏️ UPDATE SIMPLE
  const updatePlant = async (id: number) => {
    const newName = prompt("Nuevo nombre:");
    if (!newName) return;

    const { error } = await supabase
      .from("plants")
      .update({ name: newName })
      .eq("id", id);

    if (error) console.error(error);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "text-green-400";
      case "Warning":
        return "text-yellow-400";
      case "Danger":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">🌱 Secret Garden</h1>

      {/* BOTÓN NUEVA PLANTA (FUERA DEL MAP) */}
      <Link
        to="/add-plant"
        className="bg-green-600 px-4 py-2 rounded-xl inline-block mb-6 hover:bg-green-500 transition"
      >
        ➕ Nueva Planta
      </Link>

      {/* GRID */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* IMAGE */}
            <div className="h-40 bg-slate-800">
              {plant.photo_url ? (
                <img
                  src={plant.photo_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-4">
              <h2 className="text-xl font-bold">{plant.name}</h2>

              <p className={`font-semibold ${getStatusColor(plant.status)}`}>
                {plant.status}
              </p>

              <p className="text-sm text-gray-300 mt-2">
                💧 {plant.humidity}% | 🌡️ {plant.temperature}°C
              </p>

              {/* BOTONES */}
              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => updatePlant(plant.id)}
                  className="text-xs bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-500"
                >
                  Editar
                </button>

                <button
                  onClick={() => deletePlant(plant.id)}
                  className="text-xs bg-red-600 px-3 py-1 rounded-full hover:bg-red-500"
                >
                  Eliminar
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}