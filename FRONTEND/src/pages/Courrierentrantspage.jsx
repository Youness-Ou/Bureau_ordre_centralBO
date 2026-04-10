// src/pages/CourrierEntrantsPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { C, Btn, Card, Select, inputBase, Modal, Field, Input } from "../components/ui";
import api from "../utils/api";

const STATUT_CFG = {
  enregistre: { label: "Enregistré", bg: C.greyL,   color: C.grey,    dot: C.grey    },
  affecte:    { label: "Affecté",    bg: C.blueL,   color: C.blueD,   dot: C.blue    },
  en_cours:   { label: "En cours",   bg: C.orangeL, color: C.orangeD, dot: C.orange  },
  traite:     { label: "Traité",     bg: C.greenL,  color: C.greenD,  dot: C.green   },
  archive:    { label: "Archivé",    bg: "#F3F4F6", color: "#374151", dot: "#6B7280" },
};

const PRIORITE_CFG = {
  normale:      { label: "Normale",      bg: C.greyL,   color: C.grey    },
  urgente:      { label: "Urgente",      bg: C.orangeL, color: C.orangeD },
  tres_urgente: { label: "Très urgente", bg: C.redL,    color: C.redD    },
};

const StatutBadge = ({ statut }) => {
  const cfg = STATUT_CFG[statut] || STATUT_CFG.enregistre;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px 3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, border: `1px solid ${cfg.dot}25` }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

const PrioriteBadge = ({ priorite }) => {
  const cfg = PRIORITE_CFG[priorite] || PRIORITE_CFG.normale;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "2px 8px", borderRadius: 5, fontSize: 10.5, fontWeight: 600, border: `1px solid ${cfg.color}25` }}>
      {cfg.label}
    </span>
  );
};

const PER_PAGE = 15;

const CourrierEntrantsPage = ({ toast }) => {
  const { user } = useAuth();
  const isAdmin = user?.role?.libelle === "admin";

  const [courriers, setCourriers] = useState([]);
  const [meta,      setMeta]      = useState({ total: 0, last_page: 1 });
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [search,         setSearch]         = useState("");
  const [filterStatut,   setFilterStatut]   = useState("");
  const [filterPriorite, setFilterPriorite] = useState("");
  const [filterService,  setFilterService]  = useState("");
  const [services,       setServices]       = useState([]);
  const [modal,   setModal]   = useState(null);

  // ✅ FIX : Chargement des services via la route /courriers/services (accessible agent_bo + admin)
  useEffect(() => {
    api.get("/courriers/services")
      .then((r) => setServices(r.data))
      .catch(() => {
        // Fallback sur la route admin si l'utilisateur est admin
        if (isAdmin) {
          api.get("/admin/services").then((r) => setServices(r.data)).catch(() => {});
        }
      });
  }, [isAdmin]);

  const fetchCourriers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: PER_PAGE });
      if (search)         params.set("search",     search);
      if (filterStatut)   params.set("statut",     filterStatut);
      if (filterPriorite) params.set("priorite",   filterPriorite);
      if (filterService)  params.set("service_id", filterService);
      const res = await api.get(`/courriers/entrants?${params}`);
      setCourriers(res.data.data || []);
      setMeta({ total: res.data.total || 0, last_page: res.data.last_page || 1 });
    } catch {
      toast("Erreur lors du chargement des courriers.", "error");
    } finally { setLoading(false); }
  }, [page, search, filterStatut, filterPriorite, filterService]);

  useEffect(() => { fetchCourriers(); }, [fetchCourriers]);

  const resetPage = (setter) => (val) => { setter(val); setPage(1); };
  const clearFilters = () => { setSearch(""); setFilterStatut(""); setFilterPriorite(""); setFilterService(""); setPage(1); };
  const hasFilters = search || filterStatut || filterPriorite || filterService;

  return (
    <div style={{ padding: "22px 26px" }}>
      {!isAdmin && (
        <div style={{ background: `linear-gradient(135deg, ${C.teal}15, ${C.tealL})`, border: `1px solid ${C.teal}30`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.tealD }}>
          <span style={{ fontSize: 16 }}>📥</span>
          <span>Vous visualisez uniquement <strong>vos courriers enregistrés</strong>.</span>
        </div>
      )}

      {/* Filtres */}
      <Card style={{ marginBottom: 16, padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.grey, fontSize: 13, pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Numéro, objet, expéditeur…"
              style={{ ...inputBase(), paddingLeft: 34, height: 38, fontSize: 13 }}
              onFocus={(e) => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orange}18`; }}
              onBlur={(e)  => { e.target.style.borderColor = C.greyBorder; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <Select value={filterStatut}   onChange={(e) => resetPage(setFilterStatut)(e.target.value)}   style={{ width: 150, height: 38, fontSize: 12.5 }}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUT_CFG).map(([k, v])   => <option key={k} value={k}>{v.label}</option>)}
          </Select>
          <Select value={filterPriorite} onChange={(e) => resetPage(setFilterPriorite)(e.target.value)} style={{ width: 155, height: 38, fontSize: 12.5 }}>
            <option value="">Toutes priorités</option>
            {Object.entries(PRIORITE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </Select>
          {services.length > 0 && (
            <Select value={filterService} onChange={(e) => resetPage(setFilterService)(e.target.value)} style={{ width: 175, height: 38, fontSize: 12.5 }}>
              <option value="">Tous les services</option>
              {services.map((s) => <option key={s.id_service} value={s.id_service}>{s.nom}</option>)}
            </Select>
          )}
          {hasFilters && <Btn variant="ghost" size="sm" onClick={clearFilters} style={{ height: 38, fontSize: 12 }}>✕ Réinitialiser</Btn>}
          <Btn variant="primary" onClick={() => setModal({ type: "create" })} style={{ height: 38, marginLeft: "auto", whiteSpace: "nowrap" }}>+ Nouveau courrier</Btn>
        </div>
      </Card>

      {/* Compteur */}
      <div style={{ marginBottom: 10, fontSize: 12, color: C.grey, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ background: C.orangeL, color: C.orangeD, padding: "2px 9px", borderRadius: 5, fontWeight: 600, fontSize: 11, border: `1px solid ${C.orange}20` }}>{meta.total}</span>
        courrier{meta.total > 1 ? "s" : ""} trouvé{meta.total > 1 ? "s" : ""}
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.greyD }}>
              {["Numéro", "Objet", "Expéditeur / Organisme", "Service dest.", "Priorité", "Statut", "Date réception", "Actions"].map((h, i) => (
                <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.8, borderRight: i < 7 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: C.grey }}><div style={{ fontSize: 22, marginBottom: 8 }}>⏳</div>Chargement…</td></tr>
            ) : courriers.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 52, textAlign: "center", color: C.grey }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>📭</div>
                <div style={{ fontWeight: 600, marginBottom: 4, color: C.greyD }}>Aucun courrier trouvé</div>
                <div style={{ fontSize: 12.5 }}>Créez votre premier courrier ou modifiez vos filtres</div>
              </td></tr>
            ) : courriers.map((c, i) => (
              <CourrierRow
                key={c.id_entrant} c={c} i={i}
                onDetail={() => setModal({ type: "detail", courrier: c })}
                onEdit={() => setModal({ type: "edit", courrier: c })}
              />
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{ padding: "10px 18px", borderTop: `1px solid ${C.greyL}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.greyXL }}>
            <span style={{ fontSize: 11.5, color: C.grey }}>Page {page} / {meta.last_page} — {meta.total} résultats</span>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: meta.last_page }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${page === i + 1 ? C.orange : C.greyBorder}`, background: page === i + 1 ? C.orange : C.white, color: page === i + 1 ? C.white : C.grey, cursor: "pointer", fontSize: 12.5, fontWeight: page === i + 1 ? 700 : 400, transition: "all .12s" }}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      {modal?.type === "create" && (
        <CourrierFormModal mode="create" services={services} onSave={() => { fetchCourriers(); setModal(null); toast("Courrier enregistré.", "success"); }} onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (
        <CourrierFormModal mode="edit" courrier={modal.courrier} services={services} onSave={() => { fetchCourriers(); setModal(null); toast("Courrier modifié.", "success"); }} onClose={() => setModal(null)} />
      )}
      {modal?.type === "detail" && (
        <CourrierDetailModal courrier={modal.courrier} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

// ─── Ligne tableau ────────────────────────────────────────────────
const CourrierRow = ({ c, i, onDetail, onEdit }) => {
  const [hov, setHov] = useState(false);
  return (
    <tr style={{ borderBottom: `1px solid ${C.greyL}`, background: hov ? C.greyXL : i % 2 === 0 ? C.white : "#FAFAFA", transition: "background .1s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <td style={{ padding: "11px 14px" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11.5, background: C.orangeL, color: C.orangeD, padding: "3px 8px", borderRadius: 5, border: `1px solid ${C.orange}20`, fontWeight: 600 }}>{c.numero_ordre}</span>
      </td>
      <td style={{ padding: "11px 14px", maxWidth: 200 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: C.greyD, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.objet}</div>
      </td>
      <td style={{ padding: "11px 14px" }}>
        <div style={{ fontSize: 13, color: C.greyD, fontWeight: 500 }}>{c.expediteur_nom || "—"}</div>
        {c.organisme && <div style={{ fontSize: 11, color: C.grey, marginTop: 2 }}>{c.organisme}</div>}
      </td>
      <td style={{ padding: "11px 14px", fontSize: 12.5, color: C.greyD }}>{c.service_dest?.nom || <span style={{ color: C.greyM, fontStyle: "italic" }}>—</span>}</td>
      <td style={{ padding: "11px 14px" }}>
        {(() => { const cfg = (PRIORITE_CFG[c.priorite] || PRIORITE_CFG.normale); return <span style={{ background: cfg.bg, color: cfg.color, padding: "2px 8px", borderRadius: 5, fontSize: 10.5, fontWeight: 600 }}>{cfg.label}</span>; })()}
      </td>
      <td style={{ padding: "11px 14px" }}><StatutBadge statut={c.statut} /></td>
      <td style={{ padding: "11px 14px", fontSize: 12.5, color: C.grey, whiteSpace: "nowrap" }}>{c.date_reception ? new Date(c.date_reception).toLocaleDateString("fr-FR") : "—"}</td>
      <td style={{ padding: "11px 12px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <Btn size="sm" variant="ghost" onClick={onDetail} style={{ fontSize: 11 }}>👁 Détail</Btn>
          {/* Modifier seulement si statut = enregistre */}
          {c.statut === "enregistre" && (
            <Btn size="sm" variant="ghost" onClick={onEdit} style={{ fontSize: 11 }}>✏️</Btn>
          )}
        </div>
      </td>
    </tr>
  );
};

// ─── Modal formulaire ─────────────────────────────────────────────
const CourrierFormModal = ({ mode, courrier, services, onSave, onClose }) => {
  const [form, setForm] = useState({
    objet:           courrier?.objet                         || "",
    expediteur_nom:  courrier?.expediteur_nom                || "",
    organisme:       courrier?.organisme                     || "",
    date_reception:  courrier?.date_reception?.split("T")[0] || new Date().toISOString().split("T")[0],
    id_service_dest: String(courrier?.id_service_dest        || ""),
    priorite:        courrier?.priorite                      || "normale",
    commentaire:     "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.objet.trim())          e.objet          = "L'objet est requis";
    if (!form.expediteur_nom.trim()) e.expediteur_nom = "L'expéditeur est requis";
    if (!form.date_reception)        e.date_reception = "La date est requise";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, id_service_dest: form.id_service_dest ? parseInt(form.id_service_dest) : null };
      mode === "create" ? await api.post("/courriers/entrants", payload) : await api.put(`/courriers/entrants/${courrier.id_entrant}`, payload);
      onSave();
    } catch (err) {
      const se = err.response?.data?.errors || {};
      if (Object.keys(se).length) { const m = {}; Object.keys(se).forEach((k) => { m[k] = se[k][0]; }); setErrors(m); }
      else setErrors({ general: err.response?.data?.message || "Erreur serveur" });
    } finally { setLoading(false); }
  };

  return (
    <Modal title={mode === "create" ? "Enregistrer un courrier entrant" : "Modifier le courrier"} subtitle={mode === "edit" ? courrier?.numero_ordre : undefined} onClose={onClose} icon="📥" width={600}>
      <form onSubmit={handleSubmit}>
        {errors.general && <div style={{ background: C.redL, color: C.redD, padding: "10px 13px", borderRadius: 8, marginBottom: 14, fontSize: 12.5, display: "flex", gap: 7, alignItems: "center", border: `1px solid ${C.red}20` }}><span>⚠</span>{errors.general}</div>}
        <Field label="Objet du courrier" required error={errors.objet}>
          <Input value={form.objet} onChange={(e) => setForm({ ...form, objet: e.target.value })} placeholder="Objet du courrier reçu" error={!!errors.objet} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Expéditeur" required error={errors.expediteur_nom}>
            <Input value={form.expediteur_nom} onChange={(e) => setForm({ ...form, expediteur_nom: e.target.value })} placeholder="Nom de l'expéditeur" error={!!errors.expediteur_nom} />
          </Field>
          <Field label="Organisme / Structure">
            <Input value={form.organisme} onChange={(e) => setForm({ ...form, organisme: e.target.value })} placeholder="Organisme ou structure" />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Date de réception" required error={errors.date_reception}>
            <Input type="date" value={form.date_reception} onChange={(e) => setForm({ ...form, date_reception: e.target.value })} error={!!errors.date_reception} />
          </Field>
          <Field label="Priorité" required>
            <Select value={form.priorite} onChange={(e) => setForm({ ...form, priorite: e.target.value })}>
              <option value="normale">Normale</option>
              <option value="urgente">Urgente</option>
              <option value="tres_urgente">Très urgente</option>
            </Select>
          </Field>
        </div>
        <Field label="Service destinataire">
          <Select value={form.id_service_dest} onChange={(e) => setForm({ ...form, id_service_dest: e.target.value })}>
            <option value="">— Sélectionner un service —</option>
            {services.map((s) => <option key={s.id_service} value={s.id_service}>{s.nom}</option>)}
          </Select>
        </Field>
        {mode === "create" && (
          <Field label="Commentaire initial" hint="Optionnel">
            <textarea value={form.commentaire} onChange={(e) => setForm({ ...form, commentaire: e.target.value })} placeholder="Remarques à la réception…" rows={3}
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.greyBorder}`, borderRadius: 8, fontSize: 13, color: C.greyD, background: C.white, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orange}18`; }}
              onBlur={(e)  => { e.target.style.borderColor = C.greyBorder; e.target.style.boxShadow = "none"; }}
            />
          </Field>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 12, borderTop: `1px solid ${C.greyL}` }}>
          <Btn variant="ghost" onClick={onClose} disabled={loading}>Annuler</Btn>
          <Btn variant="primary" type="submit" disabled={loading}>{loading ? "⏳ Enregistrement..." : mode === "create" ? "📥 Enregistrer" : "✓ Modifier"}</Btn>
        </div>
      </form>
    </Modal>
  );
};

// ─── Modal détail ─────────────────────────────────────────────────
const CourrierDetailModal = ({ courrier: c, onClose }) => {
  const date = c.date_reception ? new Date(c.date_reception).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const rows = [
    { icon: "🔢", label: "Numéro d'ordre",       value: c.numero_ordre },
    { icon: "📋", label: "Objet",                value: c.objet },
    { icon: "👤", label: "Expéditeur",           value: c.expediteur_nom },
    { icon: "🏛",  label: "Organisme",            value: c.organisme || "—" },
    { icon: "📅", label: "Date de réception",    value: date },
    { icon: "🏢", label: "Service destinataire", value: c.service_dest?.nom || "Non défini" },
    { icon: "⚡", label: "Priorité",             value: PRIORITE_CFG[c.priorite]?.label || c.priorite },
    { icon: "📌", label: "Enregistré par",       value: c.enregistreur ? `${c.enregistreur.prenom} ${c.enregistreur.nom}` : "—" },
  ];
  return (
    <Modal title="Détail du courrier" subtitle={c.numero_ordre} onClose={onClose} icon="📥" width={520}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><StatutBadge statut={c.statut} /></div>
      <div style={{ border: `1px solid ${C.greyL}`, borderRadius: 10, overflow: "hidden" }}>
        {rows.map(({ icon, label, value }, i) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: i < rows.length - 1 ? `1px solid ${C.greyL}` : "none", background: i % 2 === 0 ? C.white : C.greyXL }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 26, height: 26, borderRadius: 6, background: C.orangeL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 12.5, color: C.grey, fontWeight: 500 }}>{label}</span>
            </div>
            <span style={{ fontSize: 13, color: C.greyD, fontWeight: 600, textAlign: "right", maxWidth: 220 }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16 }}><Btn variant="ghost" onClick={onClose}>Fermer</Btn></div>
    </Modal>
  );
};

export default CourrierEntrantsPage;