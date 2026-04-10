import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar           from "./components/Sidebar";
import { Topbar, ToastContainer, C } from "./components/ui";
import LoginPage         from "./pages/LoginPage";
import DashboardPage     from "./pages/DashboardPage";
import UsersPage         from "./pages/UsersPage";
import ServicesPage      from "./pages/ServicesPage";
import ProfilePage       from "./pages/ProfilePage";
import CourrierEntrantsPage  from "./pages/Courrierentrantspage";
import ProtectedRoute    from "./components/ProtectedRoute";
import useToast          from "./hooks/useToast";

// ─── Métadonnées des pages ───────────────────────────────────────
const PAGE_META = {
  dashboard:          { title: "Tableau de bord",           subtitle: "Vue d'ensemble de votre espace" },
  courriers_entrants: { title: "Courriers entrants",        subtitle: "EP-01 · Enregistrement et suivi des courriers reçus" },
  courriers_sortants: { title: "Courriers sortants",        subtitle: "EP-01 · Création et suivi des courriers envoyés" },
  users:              { title: "Gestion des utilisateurs",  subtitle: "EP-02 · Création, édition, désactivation" },
  services:           { title: "Gestion des services",      subtitle: "EP-02 · Structure organisationnelle" },
  profile:            { title: "Mon profil",                subtitle: "Informations personnelles et sécurité" },
};

// ─── Layout principal (après connexion) ─────────────────────────
const AppLayout = ({ toast }) => {
  const [page, setPage] = useState("dashboard");
  const meta = PAGE_META[page] || { title: "Page" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.greyXL }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <div style={{ flex: 1, overflowY: "auto" }}>

          {page === "dashboard" && <DashboardPage />}

          {/* ── EP-01 : Espace Agent BO uniquement ── */}
          {page === "courriers_entrants" && (
            <ProtectedRoute roles={["agent_bo"]}>
              <CourrierEntrantsPage toast={toast} />
            </ProtectedRoute>
          )}
          {page === "courriers_sortants" && (
            <ProtectedRoute roles={["agent_bo"]}>
              <CourrierSortantsPage toast={toast} />
            </ProtectedRoute>
          )}

          {/* ── EP-02 : Espace Admin uniquement ── */}
          {page === "users" && (
            <ProtectedRoute roles={["admin"]}>
              <UsersPage toast={toast} />
            </ProtectedRoute>
          )}
          {page === "services" && (
            <ProtectedRoute roles={["admin"]}>
              <ServicesPage toast={toast} />
            </ProtectedRoute>
          )}

          {page === "profile" && <ProfilePage toast={toast} />}
        </div>
      </div>
    </div>
  );
};

// ─── Root ────────────────────────────────────────────────────────
const Root = () => {
  const { user, loading } = useAuth();
  const { items: toasts, push: toast, pop } = useToast();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#1a1a1a" }}>
        <div style={{ color: C.white, fontSize: 14 }}>Chargement…</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes modalIn  { from { opacity:0; transform:scale(.96) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes fadeIn   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin     { to   { transform:rotate(360deg) } }
        @keyframes toastIn  { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        body { font-family:'Segoe UI', system-ui, -apple-system, sans-serif }
        button, input, select, textarea { font-family:inherit }
        ::-webkit-scrollbar { width:5px; height:5px }
        ::-webkit-scrollbar-track { background:#f0f0f0 }
        ::-webkit-scrollbar-thumb { background:#ccc; border-radius:3px }
        ::-webkit-scrollbar-thumb:hover { background:#aaa }
      `}</style>

      {!user
        ? <LoginPage onLoginSuccess={() => toast("Connexion réussie !", "success")} />
        : <AppLayout toast={toast} />
      }

      <ToastContainer items={toasts} pop={pop} />
    </>
  );
};

// ─── Export principal avec AuthProvider ──────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}