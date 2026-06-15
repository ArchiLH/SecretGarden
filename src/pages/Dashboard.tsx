import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Plant = {
  id: number;
  humidity: number;
  temperature: number;
  status: string;
  user_id: string;
};

export default function Dashboard() {
  const [totalPlants, setTotalPlants] = useState(0);
  const [avgHumidity, setAvgHumidity] = useState(0);
  const [avgTemperature, setAvgTemperature] = useState(0);
  const [healthyPlants, setHealthyPlants] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
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

    const plants = (data as Plant[]) || [];

    // 📊 TOTAL
    setTotalPlants(plants.length);

    if (plants.length > 0) {
      // 💧 HUMEDAD PROMEDIO
      const humidity =
        plants.reduce((acc, plant) => acc + plant.humidity, 0) /
        plants.length;

      // 🌡️ TEMPERATURA PROMEDIO
      const temperature =
        plants.reduce((acc, plant) => acc + plant.temperature, 0) /
        plants.length;

      // 🌱 SALUDABLES
      const healthy = plants.filter(
        (plant) => plant.status === "Healthy"
      ).length;

      setAvgHumidity(Math.round(humidity));
      setAvgTemperature(Math.round(temperature));
      setHealthyPlants(healthy);
    } else {
      setAvgHumidity(0);
      setAvgTemperature(0);
      setHealthyPlants(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5 pb-24">
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6">
        🌱 Secret Garden
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400">Total Plantas</p>
          <h2 className="text-3xl font-bold">
            {totalPlants}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400">Humedad Prom.</p>
          <h2 className="text-3xl font-bold">
            {avgHumidity}%
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400">Temp. Prom.</p>
          <h2 className="text-3xl font-bold">
            {avgTemperature}°C
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400">Saludables</p>
          <h2 className="text-3xl font-bold text-green-400">
            {healthyPlants}
          </h2>
        </div>
      </div>
    </div>
  );
}