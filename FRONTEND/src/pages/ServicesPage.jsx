import { useState, useEffect, useCallback } from "react";
import { C, shadows, Btn, Modal, Field, Input, Confirm, Card } from "../components/ui";
import api from "../utils/api";

const ServicesPage = ({ toast }) => {
  const [services,     setServices]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [modal,        setModal]        = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [showInline,   setShowInline]   = useState(false);
  const [inlineForm,   setInlineForm]   = useState({ nom: "", description: "", chef_service: "" });
  const [inlineErrors, setInlineErrors] = useState({});
  const [saving,       setSaving]       = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/services");
      setServices(res.data);
    } catch { toast("Erreur lors du chargement des services.", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleCreate = async () => {
    if (!inlineForm.nom.trim()) { setInlineErrors({ nom: "Le nom est requis" }); return; }
    setSaving(true);
    try {
      await api.post("/admin/services", inlineForm);
      fetchServices();
      setInlineForm({ nom: "", description: "", chef_service: "" });
      setInlineErrors({});
      setShowInline(false);
      toast("Service créé avec succès.", "success");
    } catch (err) {
      const msg = err.response?.data?.errors?.nom?.[0] || err.response?.data?.message || "Erreur serveur";
      setInlineErrors({ nom: msg });
    } finally { setSaving(false); }
  };

  const handleEdit = async (svc, form) => {
    try {
      await api.put(`/admin/services/${svc.id_service}`, form);
      fetchServices(); setModal(null);
      toast("Service modifié avec succès.", "success");
    } catch (err) {
      toast(err.response?.data?.errors?.nom?.[0] || "Erreur serveur", "error");
    }
  };

  const handleDelete = async (svc) => {
    try {
      await api.delete(`/admin/services/${svc.id_service}`);
      fetchServices();
      toast("Service supprimé avec succès.", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Erreur lors de la suppression.", "error");
    }
    setConfirm(null);
  };

  return (
    <div style={{ padding: "22px 26px" }}>

      {/* ── Barre d'actions ───────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn
          variant={showInline ? "ghost" : "primary"}
          onClick={() => { setShowInline(!showInline); setInlineErrors({}); setInlineForm({ nom: "", description: "", chef_service: "" }); }}
        >
          {showInline ? "✕ Annuler" : "+ Nouveau service"}
        </Btn>
      </div>

      {/* ── Formulaire inline ─────────────────────────────────── */}
      {showInline && (
        <div style={{
          background: C.orangeXL,
          border: `1.5px dashed ${C.orange}60`,
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 16,
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.orangeD, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span>+</span> Nouveau service
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr auto", gap: 12, alignItems: "end" }}>
            <Field label="Nom *" error={inlineErrors.nom} style={{ marginBottom: 0 }}>
              <Input
                value={inlineForm.nom}
                onChange={(e) => { setInlineForm({ ...inlineForm, nom: e.target.value }); setInlineErrors({}); }}
                placeholder="Nom du service"
                error={!!inlineErrors.nom}
              />
            </Field>
            <Field label="Description" style={{ marginBottom: 0 }}>
              <Input
                value={inlineForm.description}
                onChange={(e) => setInlineForm({ ...inlineForm, description: e.target.value })}
                placeholder="Description courte"
              />
            </Field>
            <Field label="Chef de service" style={{ marginBottom: 0 }}>
              <Input
                value={inlineForm.chef_service}
                onChange={(e) => setInlineForm({ ...inlineForm, chef_service: e.target.value })}
                placeholder="Responsable"
              />
            </Field>
            <Btn variant="primary" onClick={handleCreate} disabled={saving} style={{ height: 40, marginBottom: 0 }}>
              {saving ? "⏳" : "Créer →"}
            </Btn>
          </div>
        </div>
      )}

      {/* ── Table des services ───────────────────────────────── */}
      <Card padding={0} style={{ overflow: "hidden" }}>
        {/* Header table */}
        <div style={{
          padding: "13px 18px",
          background: C.greyD,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 13.5 }}>Services organisationnels</div>
          <span style={{
            background: "rgba(255,255,255,0.12)",
            color: C.white,
            padding: "3px 11px", borderRadius: 5,
            fontSize: 11, fontWeight: 600,
          }}>{services.length} services</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.greyXL }}>
              {["Service", "Description", "Chef de service", "Utilisateurs", "Actions"].map((h) => (
                <th key={h} style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 10.5, fontWeight: 700,
                  color: C.grey,
                  textTransform: "uppercase", letterSpacing: 0.7,
                  borderBottom: `1px solid ${C.greyL}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 48, textAlign: "center", color: C.grey }}>⏳ Chargement…</td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 52, textAlign: "center", color: C.grey }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>🏢</div>
                  <div style={{ fontWeight: 600, color: C.greyD, marginBottom: 4 }}>Aucun service</div>
                  <div style={{ fontSize: 12.5 }}>Créez le premier service organisationnel</div>
                </td>
              </tr>
            ) : services.map((s, i) => (
              <ServiceRow
                key={s.id_service}
                s={s} i={i}
                onEdit={() => setModal({ type: "edit", service: s })}
                onDelete={() => setConfirm(s)}
              />
            ))}
          </tbody>
        </table>
      </Card>

      {modal?.type === "edit" && (
        <ServiceEditModal
          service={modal.service}
          onSave={(form) => handleEdit(modal.service, form)}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <Confirm
          title="Supprimer ce service ?"
          message={`Supprimer définitivement "${confirm.nom}" ? Cette action est irréversible.`}
          onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)}
          variant="danger"
        />
      )}
    </div>
  );
};

// ─── Ligne service ────────────────────────────────────────────────
const ServiceRow = ({ s, i, onEdit, onDelete }) => {
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
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: C.orangeL,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
            border: `1px solid ${C.orange}18`,
          }}>🏢</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: C.greyD }}>{s.nom}</div>
        </div>
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12.5, color: C.grey, maxWidth: 200 }}>
        {s.description || <span style={{ color: C.greyM, fontStyle: "italic" }}>—</span>}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12.5, color: C.greyD }}>
        {s.chef_service || <span style={{ color: C.greyM, fontStyle: "italic" }}>Non défini</span>}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          background: s.utilisateurs_count > 0 ? C.orangeL : C.greyL,
          color: s.utilisateurs_count > 0 ? C.orangeD : C.grey,
          padding: "3px 11px", borderRadius: 6,
          fontSize: 11.5, fontWeight: 600,
          border: `1px solid ${s.utilisateurs_count > 0 ? C.orange + "20" : C.greyBorder}`,
        }}>
          {s.utilisateurs_count ?? 0} utilisateur{s.utilisateurs_count > 1 ? "s" : ""}
        </span>
      </td>
      <td style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn size="sm" variant="ghost" onClick={onEdit} style={{ fontSize: 11.5 }}>✏️ Modifier</Btn>
          <Btn size="sm" variant="danger" onClick={onDelete} style={{ fontSize: 11.5 }}>🗑 Supprimer</Btn>
        </div>
      </td>
    </tr>
  );
};

// ─── Modal édition service ────────────────────────────────────────
const ServiceEditModal = ({ service, onSave, onClose }) => {
  const [form,   setForm]   = useState({ nom: service.nom, description: service.description || "", chef_service: service.chef_service || "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim()) { setErrors({ nom: "Nom requis" }); return; }
    onSave({ ...form, nom: form.nom.trim() });
  };

  return (
    <Modal title="Modifier le service" subtitle={service.nom} onClose={onClose} icon="✏️" width={460}>
      <form onSubmit={handleSubmit}>
        <Field label="Nom du service" required error={errors.nom}>
          <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} error={!!errors.nom} />
        </Field>
        <Field label="Description">
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description courte" />
        </Field>
        <Field label="Chef de service">
          <Input value={form.chef_service} onChange={(e) => setForm({ ...form, chef_service: e.target.value })} placeholder="Nom et prénom du responsable" />
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${C.greyL}` }}>
          <Btn variant="ghost" onClick={onClose}>Annuler</Btn>
          <Btn variant="primary" type="submit">✓ Enregistrer</Btn>
        </div>
      </form>
    </Modal>
  );
};

export default ServicesPage;