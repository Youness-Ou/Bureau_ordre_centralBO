import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { C, shadows, StatCard, RoleBadge, StatusBadge, Avatar, Card } from "../components/ui";
import api from "../utils/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin   = user?.role?.libelle === "admin";
  const isAgentBO = user?.role?.libelle === "agent_bo";

  const [stats,      setStats]      = useState({ users: [], services: [] });
  const [agentStats, setAgentStats] = useState({ entrants: 0, sortants: 0, enCours: 0, traites: 0, recentEntrants: [] });
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (isAdmin) {
      Promise.all([
        api.get("/admin/users?per_page=100"),
        api.get("/admin/services"),
      ])
        .then(([usersRes, servicesRes]) => setStats({
          users:    usersRes.data.data || [],
          services: servicesRes.data   || [],
        }))
        .catch(() => {})
        .finally(() => setLoading(false));

    } else if (isAgentBO) {
      // ── Chargement robuste : on ne bloque pas si sortants n'existe pas encore ──
      const fetchEntrants = api.get("/courriers/entrants?per_page=5").catch(() => ({ data: { data: [], total: 0 } }));
      const fetchSortants = api.get("/courriers/sortants?per_page=1").catch(() => ({ data: { total: 0 } }));

      Promise.all([fetchEntrants, fetchSortants])
        .then(([entrantsRes, sortantsRes]) => {
          const entrants = entrantsRes.data.data  || [];
          const totalEnt = entrantsRes.data.total || 0;
          const totalSor = sortantsRes.data.total || 0;

          // enCours et traites calculés sur TOUS les entrants (pas seulement les 5 derniers)
          // → on refait un appel sans per_page pour avoir les vrais totaux par statut
          api.get("/courriers/entrants?per_page=1000")
            .then((allRes) => {
              const all = allRes.data.data || [];
              setAgentStats({
                entrants:       totalEnt,
                sortants:       totalSor,
                enCours:        all.filter((c) => c.statut === "en_cours").length,
                traites:        all.filter((c) => c.statut === "traite").length,
                recentEntrants: entrants,
              });
            })
            .catch(() => {
              setAgentStats({
                entrants:       totalEnt,
                sortants:       totalSor,
                enCours:        entrants.filter((c) => c.statut === "en_cours").length,
                traites:        entrants.filter((c) => c.statut === "traite").length,
                recentEntrants: entrants,
              });
            });
        })
        .finally(() => setLoading(false));

    } else {
      setLoading(false);
    }
  }, [user]);

  const actifs   = stats.users.filter((u) => u.actif).length;
  const inactifs = stats.users.filter((u) => !u.actif).length;

  const STATUT_COLOR = {
    enregistre: C.grey,
    affecte:    C.blue,
    en_cours:   C.orange,
    traite:     C.green,
    archive:    "#6B7280",
  };
  const STATUT_LABEL = {
    enregistre: "Enregistré",
    affecte:    "Affecté",
    en_cours:   "En cours",
    traite:     "Traité",
    archive:    "Archivé",
  };

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

      {/* ── Vue ADMIN ─────────────────────────────────────────── */}
      {isAdmin && !loading && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            <StatCard icon="👥" label="Utilisateurs actifs"  value={actifs}                color={C.orange} sub={`${stats.users.length} au total`} />
            <StatCard icon="🔒" label="Comptes inactifs"     value={inactifs}              color={C.red}    sub="Accès bloqué" />
            <StatCard icon="🏢" label="Services"             value={stats.services.length} color={C.blue}   sub="Organisationnels" />
            <StatCard icon="🛡️" label="Rôles"               value={3}                     color={C.purple} sub="Niveaux d'accès" />
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

      {/* ── Vue AGENT BO ──────────────────────────────────────── */}
      {isAgentBO && !loading && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            <StatCard icon="📥" label="Courriers entrants" value={agentStats.entrants} color={C.teal}   sub="Enregistrés par vous" />
            <StatCard icon="📤" label="Courriers sortants" value={agentStats.sortants} color={C.blue}   sub="Créés par vous" />
            <StatCard icon="⏳" label="En cours"           value={agentStats.enCours}  color={C.orange} sub="À traiter" />
            <StatCard icon="✅" label="Traités"            value={agentStats.traites}  color={C.green}  sub="Clôturés" />
          </div>

          <Card padding={0} style={{ overflow: "hidden" }}>
            <div style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${C.greyL}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: C.greyD }}>Mes derniers courriers entrants</div>
              <span style={{
                background: C.tealL, color: C.tealD,
                padding: "3px 10px", borderRadius: 6,
                fontSize: 11, fontWeight: 600,
                border: `1px solid ${C.teal}20`,
              }}>
                {agentStats.entrants} total
              </span>
            </div>

            {agentStats.recentEntrants.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: C.grey }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
                <div style={{ fontWeight: 600, color: C.greyD, marginBottom: 4 }}>Aucun courrier enregistré</div>
                <div style={{ fontSize: 12.5 }}>Utilisez "Courriers entrants" pour commencer</div>
              </div>
            ) : agentStats.recentEntrants.map((c, i) => (
              <div key={c.id_entrant} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 18px",
                borderBottom: i < agentStats.recentEntrants.length - 1 ? `1px solid ${C.greyXL}` : "none",
                transition: "background .1s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = C.greyXL}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: `${STATUT_COLOR[c.statut] || C.grey}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                  border: `1px solid ${STATUT_COLOR[c.statut] || C.grey}20`,
                }}>📥</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.greyD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.objet}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.grey, marginTop: 1 }}>
                    {c.expediteur_nom}
                    {c.organisme ? <span style={{ opacity: 0.6 }}> — {c.organisme}</span> : ""}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: 11,
                    background: C.orangeL, color: C.orangeD,
                    padding: "2px 7px", borderRadius: 4,
                    fontWeight: 700,
                  }}>
                    {c.numero_ordre}
                  </span>
                  <span style={{
                    background: `${STATUT_COLOR[c.statut] || C.grey}18`,
                    color: STATUT_COLOR[c.statut] || C.grey,
                    padding: "2px 7px", borderRadius: 4,
                    fontSize: 10.5, fontWeight: 600,
                  }}>
                    {STATUT_LABEL[c.statut] || c.statut}
                  </span>
                </div>

                <div style={{ fontSize: 11.5, color: C.greyM, flexShrink: 0, minWidth: 70, textAlign: "right" }}>
                  {c.date_reception ? new Date(c.date_reception).toLocaleDateString("fr-FR") : "—"}
                </div>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* ── Vue EMPLOYÉ ───────────────────────────────────────── */}
      {!isAdmin && !isAgentBO && (
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