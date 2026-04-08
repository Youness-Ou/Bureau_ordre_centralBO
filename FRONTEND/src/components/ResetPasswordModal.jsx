import { useState } from "react";
import { Modal, Field, Input, Btn, C } from "./ui";
import api from "../utils/api";

/**
 * ResetPasswordModal — US-09 T-09.1
 * PATCH /api/admin/users/{id}/reset-password
 */
const ResetPasswordModal = ({ user: targetUser, onSave, onClose }) => {
  const [form,    setForm]    = useState({ password: "", confirm: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Minimum 8 caractères requis"); return; }
    if (form.password !== form.confirm) { setError("Les mots de passe ne correspondent pas"); return; }

    setLoading(true);
    try {
      await api.patch(`/admin/users/${targetUser.id_utilisateur}/reset-password`, {
        password:              form.password,
        password_confirmation: form.confirm,
      });
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réinitialisation");
    } finally { setLoading(false); }
  };

  return (
    <Modal
      title="Réinitialiser le mot de passe"
      subtitle={`${targetUser.prenom} ${targetUser.nom}`}
      onClose={onClose} icon="🔑" width={440}
    >
      {/* Avertissement */}
      <div style={{
        background: C.orangeL,
        border: `1px solid ${C.orange}30`,
        borderRadius: 9,
        padding: "11px 14px",
        marginBottom: 20,
        fontSize: 12.5,
        color: C.orangeD,
        display: "flex", gap: 9, alignItems: "flex-start",
      }}>
        <span style={{ flexShrink: 0 }}>ℹ️</span>
        <span>Le nouveau mot de passe remplacera l'ancien immédiatement. Tous les tokens actifs de l'utilisateur seront révoqués.</span>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: C.redL, color: C.redD,
            padding: "10px 13px", borderRadius: 8,
            marginBottom: 14, fontSize: 12.5,
            display: "flex", gap: 7, alignItems: "center",
            border: `1px solid ${C.red}20`,
          }}>
            <span>⚠</span>{error}
          </div>
        )}

        <Field label="Nouveau mot de passe" required hint="Minimum 8 caractères">
          <Input
            type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••" error={!!error}
          />
        </Field>
        <Field label="Confirmer le mot de passe" required>
          <Input
            type="password" value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="••••••••" error={!!error}
          />
        </Field>

        <div style={{
          display: "flex", gap: 10, justifyContent: "flex-end",
          paddingTop: 12, borderTop: `1px solid ${C.greyL}`,
        }}>
          <Btn variant="ghost" onClick={onClose} disabled={loading}>Annuler</Btn>
          <Btn variant="primary" type="submit" disabled={loading}>
            {loading ? "⏳ Réinitialisation..." : "🔑 Réinitialiser"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;