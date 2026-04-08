import { useState, useEffect, useCallback } from "react";
import { C, shadows, Btn, RoleBadge, StatusBadge, Avatar, Confirm, inputBase, Select, Card } from "../components/ui";
import UserFormModal       from "../components/UserFormModal";
import ResetPasswordModal  from "../components/ResetPasswordModal";
import api from "../utils/api";

const PER_PAGE = 10;

const UsersPage = ({ toast }) => {
  const [users,         setUsers]         = useState([]);
  const [meta,          setMeta]          = useState({ total: 0, last_page: 1 });
  const [page,          setPage]          = useState(1);
  const [search,        setSearch]        = useState("");
  const [filterRole,    setFilterRole]    = useState("");
  const [filterActif,   setFilterActif]   = useState("");
  const [filterService, setFilterService] = useState("");
  const [services,      setServices]      = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [modal,         setModal]         = useState(null);
  const [confirm,       setConfirm]       = useState(null);

  useEffect(() => {
    api.get("/admin/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: PER_PAGE });
      if (search)          params.set("search",     search);
      if (filterRole)      params.set("role_id",    filterRole);
      if (filterService)   params.set("service_id", filterService);
      if (filterActif !== "") params.set("actif",   filterActif);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.data || []);
      setMeta({ total: res.data.total, last_page: res.data.last_page });
    } catch {
      toast("Erreur lors du chargement des utilisateurs.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRole, filterActif, filterService]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetAndSearch = (setter) => (val) => { setter(val); setPage(1); };

  const handleSave = (mode, savedUser) => {
    fetchUsers(); setModal(null);
    toast(mode === "create" ? `Utilisateur ${savedUser.prenom} ${savedUser.nom} créé.` : "Modifications enregistrées.", "success");
  };

  const handleToggle = async (u) => {
    try {
      const res = await api.patch(`/admin/users/${u.id_utilisateur}/toggle-active`);
      fetchUsers();
      toast(res.data.message, res.data.actif ? "success" : "warning");
    } catch { toast("Erreur lors du changement de statut.", "error"); }
    setConfirm(null);
  };

  const handleDelete = async (u) => {
    try {
      await api.delete(`/admin/users/${u.id_utilisateur}`);
      fetchUsers();
      toast(`Utilisateur ${u.prenom} ${u.nom} supprimé.`, "success");
    } catch { toast("Erreur lors de la suppression.", "error"); }
    setConfirm(null);
  };

  const handleResetPwd = () => {
    setModal(null);
    toast("Mot de passe réinitialisé avec succès.", "success");
  };

  const clearFilters = () => { setSearch(""); setFilterRole(""); setFilterActif(""); setFilterService(""); setPage(1); };
  const hasFilters = search || filterRole || filterActif !== "" || filterService;

  return (
    <div style={{ padding: "22px 26px" }}>

      {/* ── Barre de filtres ─────────────────────────────────── */}
      <Card style={{ marginBottom: 16, padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {/* Recherche */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{
              position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
              color: C.grey, fontSize: 13, pointerEvents: "none",
            }}>🔍</span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher par nom, prénom, email…"
              style={{ ...inputBase(), paddingLeft: 34, height: 38, fontSize: 13 }}
              onFocus={(e) => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orange}18`; }}
              onBlur={(e) => { e.target.style.borderColor = C.greyBorder; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <Select value={filterRole} onChange={(e) => resetAndSearch(setFilterRole)(e.target.value)} style={{ width: 155, height: 38, fontSize: 12.5 }}>
            <option value="">Tous les rôles</option>
            <option value="1">★ Administrateur</option>
            <option value="2">◈ Agent B.O.</option>
            <option value="3">◉ Employé</option>
          </Select>

          <Select value={filterService} onChange={(e) => resetAndSearch(setFilterService)(e.target.value)} style={{ width: 185, height: 38, fontSize: 12.5 }}>
            <option value="">Tous les services</option>
            {services.map((s) => <option key={s.id_service} value={s.id_service}>{s.nom}</option>)}
          </Select>

          <Select value={filterActif} onChange={(e) => resetAndSearch(setFilterActif)(e.target.value)} style={{ width: 140, height: 38, fontSize: 12.5 }}>
            <option value="">Tous les statuts</option>
            <option value="1">✓ Actifs</option>
            <option value="0">⊘ Inactifs</option>
          </Select>

          {hasFilters && (
            <Btn variant="ghost" size="sm" onClick={clearFilters} style={{ height: 38, fontSize: 12 }}>
              ✕ Réinitialiser
            </Btn>
          )}

          <Btn variant="primary" onClick={() => setModal({ type: "create" })} style={{ height: 38, marginLeft: "auto", whiteSpace: "nowrap" }}>
            + Nouvel utilisateur
          </Btn>
        </div>
      </Card>

      {/* Compteur */}
      <div style={{ marginBottom: 10, fontSize: 12, color: C.grey, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          background: C.orangeL, color: C.orangeD,
          padding: "2px 9px", borderRadius: 5,
          fontWeight: 600, fontSize: 11,
          border: `1px solid ${C.orange}20`,
        }}>{meta.total}</span>
        utilisateur{meta.total > 1 ? "s" : ""} trouvé{meta.total > 1 ? "s" : ""}
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <Card padding={0} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.greyD }}>
              {["Utilisateur", "Email", "Rôle", "Service", "Statut", "Actions"].map((h, i) => (
                <th key={h} style={{
                  padding: "11px 16px",
                  textAlign: "left",
                  fontSize: 10.5, fontWeight: 700,
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase", letterSpacing: 0.8,
                  borderRight: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 48, textAlign: "center", color: C.grey }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>⏳</div>
                  Chargement…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 52, textAlign: "center", color: C.grey }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>🔍</div>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: C.greyD }}>Aucun utilisateur trouvé</div>
                  <div style={{ fontSize: 12.5 }}>Modifiez vos critères de recherche</div>
                </td>
              </tr>
            ) : users.map((u, i) => (
              <UserRow
                key={u.id_utilisateur}
                u={u} i={i}
                onEdit={() => setModal({ type: "edit", user: u })}
                onReset={() => setModal({ type: "reset", user: u })}
                onToggle={() => setConfirm({ type: "toggle", user: u })}
                onDelete={() => setConfirm({ type: "delete", user: u })}
              />
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{
            padding: "10px 18px",
            borderTop: `1px solid ${C.greyL}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: C.greyXL,
          }}>
            <span style={{ fontSize: 11.5, color: C.grey }}>
              Page {page} / {meta.last_page} — {meta.total} résultats
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: meta.last_page }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{
                  width: 30, height: 30,
                  borderRadius: 7,
                  border: `1px solid ${page === i + 1 ? C.orange : C.greyBorder}`,
                  background: page === i + 1 ? C.orange : C.white,
                  color: page === i + 1 ? C.white : C.grey,
                  cursor: "pointer", fontSize: 12.5,
                  fontWeight: page === i + 1 ? 700 : 400,
                  transition: "all .12s",
                }}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      {modal?.type === "create" && <UserFormModal mode="create" onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.type === "edit"   && <UserFormModal mode="edit" user={modal.user} onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.type === "reset"  && <ResetPasswordModal user={modal.user} onSave={handleResetPwd} onClose={() => setModal(null)} />}

      {confirm?.type === "toggle" && (
        <Confirm
          title={confirm.user.actif ? "Désactiver le compte ?" : "Activer le compte ?"}
          message={`Vous êtes sur le point de ${confirm.user.actif ? "désactiver" : "activer"} le compte de ${confirm.user.prenom} ${confirm.user.nom}.`}
          onConfirm={() => handleToggle(confirm.user)} onCancel={() => setConfirm(null)}
          variant={confirm.user.actif ? "danger" : "primary"}
        />
      )}
      {confirm?.type === "delete" && (
        <Confirm
          title="Supprimer cet utilisateur ?"
          message={`Cette action est irréversible. L'utilisateur ${confirm.user.prenom} ${confirm.user.nom} sera définitivement supprimé.`}
          onConfirm={() => handleDelete(confirm.user)} onCancel={() => setConfirm(null)}
          variant="danger"
        />
      )}
    </div>
  );
};

// ─── Ligne de tableau ─────────────────────────────────────────────
const UserRow = ({ u, i, onEdit, onReset, onToggle, onDelete }) => {
  const [hov, setHov] = useState(false);
  return (
    <tr
      style={{
        borderBottom: `1px solid ${C.greyL}`,
        background: hov ? C.greyXL : i % 2 === 0 ? C.white : "#FAFAFA",
        transition: "background .1s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <td style={{ padding: "11px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar nom={u.nom} prenom={u.prenom} size={34} fontSize={12} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.greyD }}>{u.prenom} {u.nom}</div>
            <div style={{ fontSize: 10.5, color: C.greyM, marginTop: 1 }}>ID #{u.id_utilisateur}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "11px 16px", fontSize: 12.5, color: C.grey }}>{u.email}</td>
      <td style={{ padding: "11px 16px" }}><RoleBadge libelle={u.role?.libelle || "?"} /></td>
      <td style={{ padding: "11px 16px", fontSize: 12.5, color: C.greyD }}>{u.service?.nom || "—"}</td>
      <td style={{ padding: "11px 16px" }}><StatusBadge actif={u.actif} /></td>
      <td style={{ padding: "11px 14px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <Btn size="sm" variant="ghost" onClick={onEdit} style={{ fontSize: 11.5 }}>✏️ Éditer</Btn>
          <Btn size="sm" variant="ghost" onClick={onReset} style={{ fontSize: 11.5, color: C.orange, borderColor: C.orange + "60" }}>
            🔑 Mdp
          </Btn>
          <Btn size="sm" variant={u.actif ? "danger" : "success"} onClick={onToggle} style={{ fontSize: 11.5 }}>
            {u.actif ? "⊘" : "✓"}
          </Btn>
          <Btn size="sm" variant="danger" onClick={onDelete} style={{ fontSize: 11.5 }}>🗑</Btn>
        </div>
      </td>
    </tr>
  );
};

export default UsersPage;