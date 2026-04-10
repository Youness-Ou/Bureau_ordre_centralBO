import { useState } from "react";
import { C, shadows, RoleBadge, Avatar, TGRLogo } from "./ui";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = {
  main: [
    { id: "dashboard", icon: "⊞", label: "Tableau de bord" },
  ],
  agentbo: [
    { id: "courriers_entrants", icon: "📥", label: "Courriers entrants" },
    { id: "courriers_sortants", icon: "📤", label: "Courriers sortants" },
  ],
  admin: [
    { id: "users",    icon: "👥", label: "Utilisateurs" },
    { id: "services", icon: "🏢", label: "Services" },
  ],
  account: [
    { id: "profile", icon: "👤", label: "Mon profil" },
  ],
};

const NavGroup = ({ title, items, page, setPage }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{
      padding: "10px 18px 5px",
      color: "rgba(255,255,255,0.22)",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1.8,
      textTransform: "uppercase",
    }}>
      {title}
    </div>
    {items.map((item) => (
      <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
    ))}
  </div>
);

const NavItem = ({ item, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 16px 9px 18px",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        background: active
          ? "rgba(232,119,34,0.15)"
          : hov ? "rgba(255,255,255,0.05)" : "transparent",
        color: active ? C.white : hov ? "rgba(255,255,255,0.8)" : C.sidebarText,
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        borderLeft: `3px solid ${active ? C.orange : "transparent"}`,
        transition: "all .12s ease",
        fontFamily: "inherit",
        borderRadius: "0 6px 6px 0",
        marginRight: 10,
      }}
    >
      <span style={{ fontSize: 15, opacity: active ? 1 : 0.65, transition: "opacity .12s" }}>
        {item.icon}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {active && (
        <div style={{
          width: 5, height: 5,
          borderRadius: "50%",
          background: C.orange,
          opacity: 0.9,
        }} />
      )}
    </button>
  );
};

const Sidebar = ({ page, setPage }) => {
  const { user, logout } = useAuth();
  const isAdmin   = user?.role?.libelle === "admin";
  // agent_bo uniquement — l'admin n'a PAS accès aux courriers
  const isAgentBO = user?.role?.libelle === "agent_bo";

  return (
    <div style={{
      width: 232,
      minHeight: "100vh",
      background: C.sidebarBg,
      display: "flex",
      flexDirection: "column",
      position: "fixed", left: 0, top: 0, bottom: 0,
      zIndex: 100,
      borderRight: `1px solid ${C.sidebarBorder}`,
    }}>
      {/* Logo Header */}
      <div style={{ padding: "18px 16px", borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <TGRLogo size={38} showText={true} />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "10px 0 8px", overflowY: "auto" }}>
        <NavGroup title="Principal" items={NAV_ITEMS.main} page={page} setPage={setPage} />

        {/* Section Courriers : agent_bo UNIQUEMENT, pas l'admin */}
        {isAgentBO && (
          <NavGroup title="Courriers" items={NAV_ITEMS.agentbo} page={page} setPage={setPage} />
        )}

        {/* Section Administration : admin UNIQUEMENT */}
        {isAdmin && (
          <NavGroup title="Administration" items={NAV_ITEMS.admin} page={page} setPage={setPage} />
        )}

        <NavGroup title="Compte" items={NAV_ITEMS.account} page={page} setPage={setPage} />
      </nav>

      {/* User Footer */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.sidebarBorder}` }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid rgba(255,255,255,0.06)`,
            marginBottom: 8,
            cursor: "pointer",
          }}
          onClick={() => setPage("profile")}
        >
          <Avatar nom={user?.nom || ""} prenom={user?.prenom || ""} size={30} fontSize={11} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: C.white, fontSize: 12, fontWeight: 600,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.prenom} {user?.nom}
            </div>
            <div style={{ marginTop: 3 }}>
              <RoleBadge libelle={user?.role?.libelle || "??"} />
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: "100%",
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.2)",
            color: "rgba(252,165,165,0.9)",
            padding: "7px",
            borderRadius: 7,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6,
            fontFamily: "inherit",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(220,38,38,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(220,38,38,0.1)"}
        >
          ⎋ Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;