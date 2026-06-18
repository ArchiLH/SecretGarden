import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AddPlant() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [humidity, setHumidity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const savePlant = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("Usuario actual:", user);

    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    let photo_url = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from("plants")
          .upload(fileName, image);

      console.log("UPLOAD DATA:", uploadData);
      console.log("UPLOAD ERROR:", uploadError);

      if (uploadError) {
        alert(JSON.stringify(uploadError, null, 2));
        return;
      }

      const { data } = supabase.storage
        .from("plants")
        .getPublicUrl(fileName);

      photo_url = data.publicUrl;
    }

    const { error } = await supabase
      .from("plants")
      .insert({
        name,
        humidity: Number(humidity),
        temperature: Number(temperature),
        status: "Healthy",
        photo_url,
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

      {/* BOTÓN IMAGEN */}
      <label className="flex flex-col items-center justify-center w-full h-36 mb-5 rounded-xl border-2 border-dashed border-green-500 bg-slate-800 cursor-pointer hover:bg-slate-700 transition">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            className="h-full w-full object-cover rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-4xl">📷</span>
            <span className="text-sm mt-2">Agregar foto o imagen</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </label>

      <button
        onClick={savePlant}
        className="bg-emerald-500 px-5 py-3 rounded-xl w-full"
      >
        Guardar
      </button>
    </div>
  );
}