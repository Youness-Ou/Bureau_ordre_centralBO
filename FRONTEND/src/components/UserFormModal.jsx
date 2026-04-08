import { useState, useEffect } from "react";
import { Modal, Field, Input, Select, Btn, C, getRoleCfg } from "./ui";
import api from "../utils/api";

const UserFormModal = ({ mode, user: editUser, onSave, onClose }) => {
  const [form, setForm] = useState({
    nom:         editUser?.nom      || "",
    prenom:      editUser?.prenom   || "",
    email:       editUser?.email    || "",
    password:    "",
    confirm_pwd: "",
    id_role:     String(editUser?.id_role    || 3),
    id_service:  String(editUser?.id_service || 1),
    actif:       editUser?.actif !== false,
  });

  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [roles,    setRoles]    = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/admin/services").then((r) => setServices(r.data)).catch(() => {});
    setRoles([
      { id_role: 1, libelle: "admin" },
      { id_role: 2, libelle: "agent_bo" },
      { id_role: 3, libelle: "employe" },
    ]);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Prénom requis";
    if (!form.nom.trim())    e.nom    = "Nom requis";
    if (!form.email.trim())  e.email  = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format invalide";
    if (mode === "create") {
      if (!form.password)             e.password = "Mot de passe requis";
      else if (form.password.length < 8) e.password = "Minimum 8 caractères";
    }
    if (form.password && form.password !== form.confirm_pwd)
      e.confirm_pwd = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      nom: form.nom.trim(), prenom: form.prenom.trim(), email: form.email.trim(),
      id_role: parseInt(form.id_role), id_service: parseInt(form.id_service), actif: form.actif,
    };
    if (form.password) {
      payload.password              = form.password;
      payload.password_confirmation = form.confirm_pwd;
    }

    try {
      const res = mode === "create"
        ? await api.post("/admin/users", payload)
        : await api.put(`/admin/users/${editUser.id_utilisateur}`, payload);
      onSave(mode, res.data);
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      const mapped = {};
      if (serverErrors.email)    mapped.email    = serverErrors.email[0];
      if (serverErrors.password) mapped.password = serverErrors.password[0];
      if (Object.keys(mapped).length) setErrors(mapped);
      else setErrors({ general: err.response?.data?.message || "Erreur serveur" });
    } finally { setLoading(false); }
  };

  return (
    <Modal
      title={mode === "create" ? "Créer un utilisateur" : "Modifier l'utilisateur"}
      subtitle={mode === "edit" ? `${editUser.prenom} ${editUser.nom}` : undefined}
      onClose={onClose} width={580}
      icon={mode === "create" ? "+" : "✏️"}
    >
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div style={{
            background: C.redL, color: C.redD,
            padding: "10px 13px", borderRadius: 8,
            marginBottom: 14, fontSize: 12.5,
            display: "flex", gap: 7, alignItems: "center",
            border: `1px solid ${C.red}20`,
          }}>
            ⚠ {errors.general}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Prénom" required error={errors.prenom}>
            <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom" error={!!errors.prenom} />
          </Field>
          <Field label="Nom" required error={errors.nom}>
            <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom de famille" error={!!errors.nom} />
          </Field>
        </div>

        <Field label="Adresse email" required error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@tgr.ma" error={!!errors.email} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field
            label={mode === "create" ? "Mot de passe" : "Nouveau mot de passe"}
            required={mode === "create"} error={errors.password}
            hint={mode === "edit" ? "Laisser vide pour ne pas modifier" : ""}
          >
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 caractères" error={!!errors.password} />
          </Field>
          <Field label="Confirmer le mot de passe" error={errors.confirm_pwd}>
            <Input type="password" value={form.confirm_pwd} onChange={(e) => setForm({ ...form, confirm_pwd: e.target.value })} placeholder="Répéter" error={!!errors.confirm_pwd} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Rôle" required>
            <Select value={form.id_role} onChange={(e) => setForm({ ...form, id_role: e.target.value })}>
              {roles.map((r) => (
                <option key={r.id_role} value={r.id_role}>
                  {getRoleCfg(r.libelle).icon} {getRoleCfg(r.libelle).label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Service" required>
            <Select value={form.id_service} onChange={(e) => setForm({ ...form, id_service: e.target.value })}>
              {services.map((s) => (
                <option key={s.id_service} value={s.id_service}>{s.nom}</option>
              ))}
            </Select>
          </Field>
        </div>

        {mode === "edit" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 18, padding: "12px 14px",
            background: C.greyXL,
            borderRadius: 9,
            border: `1px solid ${C.greyBorder}`,
          }}>
            <div
              onClick={() => setForm({ ...form, actif: !form.actif })}
              style={{
                width: 42, height: 23, borderRadius: 12,
                background: form.actif ? C.green : "rgba(0,0,0,0.18)",
                transition: "background .25s",
                position: "relative", cursor: "pointer", flexShrink: 0,
              }}
            >
              <div style={{
                width: 17, height: 17, borderRadius: "50%",
                background: C.white,
                position: "absolute", top: 3,
                left: form.actif ? 22 : 3,
                transition: "left .25s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.greyD }}>
                Compte {form.actif ? "actif" : "inactif"}
              </div>
              <div style={{ fontSize: 11.5, color: C.grey, marginTop: 1 }}>
                {form.actif ? "L'utilisateur peut se connecter" : "Accès bloqué à l'application"}
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: "flex", gap: 10, justifyContent: "flex-end",
          paddingTop: 12, borderTop: `1px solid ${C.greyL}`,
          marginTop: 4,
        }}>
          <Btn variant="ghost" onClick={onClose} disabled={loading}>Annuler</Btn>
          <Btn variant="primary" type="submit" disabled={loading}>
            {loading ? "⏳ Enregistrement..." : mode === "create" ? "+ Créer l'utilisateur" : "✓ Enregistrer"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;