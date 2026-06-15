import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Dashboard from "./pages/Dashboard";
import Plants from "./pages/Plants";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import AddPlant from "./pages/AddPlant";
import EditPlant from "./pages/EditPlant";
import Login from "./pages/Login";

import BottomNav from "./components/BottomNav";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add-plant" element={<AddPlant />} />
        <Route path="/edit-plant/:id" element={<EditPlant />} />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  );
}

export default App;