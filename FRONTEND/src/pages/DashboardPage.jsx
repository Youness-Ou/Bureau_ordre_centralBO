import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { C, shadows, StatCard, RoleBadge, StatusBadge, Avatar, Card } from "../components/ui";
import api from "../utils/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ users: [], services: [] });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role?.libelle === "admin";

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    Promise.all([
      api.get("/admin/users?per_page=100"),
      api.get("/admin/services"),
    ])
      .then(([usersRes, servicesRes]) => setStats({
        users:    usersRes.data.data   || [],
        services: servicesRes.data     || [],
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const actifs   = stats.users.filter((u) => u.actif).length;
  const inactifs = stats.users.filter((u) => !u.actif).length;

  return (
    <div style={{ padding: "22px 26px" }}>

      {/* ── Bannière de bienvenue ─────────────────────────────── */}
      <div style={{
        background: C.greyD,
        borderRadius: 14,
        padding: "22px 26px",
        marginBottom: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        overflow: "hidden", position: "relative",
        border: `1px solid rgba(255,255,255,0.05)`,
      }}>
        {/* Déco */}
        <div style={{
          position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)",
          width: 220, height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,119,34,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ color: C.orange, fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            Bureau d'Ordre Centrale
          </div>
          <div style={{ color: C.white, fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            Bonjour, {user?.prenom} 👋
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, display: "flex", alignItems: "center", gap: 8 }}>
            <span>{user?.service?.nom}</span>
            {user?.service?.nom && <span style={{ opacity: 0.4 }}>·</span>}
            <RoleBadge libelle={user?.role?.libelle || "?"} />
          </div>
        </div>
        {/* Logo TGR mini */}
        <div style={{
          width: 54, height: 54,
          background: C.white,
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: shadows.lg,
          overflow: "hidden",
          flexShrink: 0,
          position: "relative", zIndex: 1,
        }}>
          <img
            src="/logo-tgr.png"
            alt="TGR"
            style={{ width: "86%", height: "86%", objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML = '<span style="font-size:24px">🏛</span>';
            }}
          />
        </div>
      </div>

      {/* ── Stats Admin ──────────────────────────────────────── */}
      {isAdmin && !loading && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            <StatCard icon="👥" label="Utilisateurs actifs"  value={actifs}               color={C.orange} sub={`${stats.users.length} au total`} />
            <StatCard icon="🔒" label="Comptes inactifs"     value={inactifs}             color={C.red}    sub="Accès bloqué" />
            <StatCard icon="🏢" label="Services"             value={stats.services.length} color={C.blue}   sub="Organisationnels" />
            <StatCard icon="🛡️" label="Rôles"               value={3}                    color={C.purple} sub="Niveaux d'accès" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
            {/* Utilisateurs récents */}
            <Card padding={0} style={{ overflow: "hidden" }}>
              <div style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${C.greyL}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.greyD }}>Utilisateurs récents</div>
                <span style={{
                  background: C.orangeL, color: C.orangeD,
                  padding: "3px 10px", borderRadius: 6,
                  fontSize: 11, fontWeight: 600,
                  border: `1px solid ${C.orange}20`,
                }}>
                  {stats.users.length} total
                </span>
              </div>
              {stats.users.slice(0, 6).map((u, i) => (
                <div key={u.id_utilisateur} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 18px",
                  borderBottom: i < 5 ? `1px solid ${C.greyXL}` : "none",
                  transition: "background .1s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.greyXL}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Avatar nom={u.nom} prenom={u.prenom} size={34} fontSize={12} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.greyD }}>{u.prenom} {u.nom}</div>
                    <div style={{ fontSize: 11.5, color: C.grey, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <RoleBadge libelle={u.role?.libelle || "?"} />
                    <StatusBadge actif={u.actif} />
                  </div>
                </div>
              ))}
            </Card>

            {/* Services */}
            <Card padding={0} style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.greyL}` }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.greyD }}>Services organisationnels</div>
              </div>
              {stats.services.map((s, i) => (
                <div key={s.id_service} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 18px",
                  borderBottom: i < stats.services.length - 1 ? `1px solid ${C.greyXL}` : "none",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.greyXL}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: C.orangeL,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, flexShrink: 0,
                    border: `1px solid ${C.orange}18`,
                  }}>🏢</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5, color: C.greyD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nom}</div>
                    <div style={{ fontSize: 11, color: C.grey }}>{s.chef_service || "—"}</div>
                  </div>
                  <span style={{
                    background: C.orangeL, color: C.orangeD,
                    padding: "3px 9px", borderRadius: 6,
                    fontSize: 11, fontWeight: 600, flexShrink: 0,
                    border: `1px solid ${C.orange}20`,
                  }}>
                    {s.utilisateurs_count ?? 0}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}

      {/* ── Vue employé / agent ───────────────────────────────── */}
      {!isAdmin && (
        <Card style={{ textAlign: "center", padding: "48px 28px" }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: 16,
            background: C.orangeL,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
            border: `1px solid ${C.orange}20`,
          }}>📬</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.greyD, marginBottom: 8 }}>Espace de travail</div>
          <div style={{ fontSize: 13.5, color: C.grey, maxWidth: 380, margin: "0 auto" }}>
            Les modules de gestion du courrier seront disponibles dans les prochains sprints.
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;