import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { C, shadows, Avatar, RoleBadge, StatusBadge, Modal, Field, Input, Btn, Card } from "../components/ui";

const ProfilePage = ({ toast }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ old_password: "", password: "", password_confirmation: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePwd = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.old_password) { setErr("Ancien mot de passe requis."); return; }
    if (form.password.length < 8) { setErr("Nouveau mot de passe : minimum 8 caractères."); return; }
    if (form.password !== form.password_confirmation) { setErr("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    try {
      // MOCK — remplacer par api.patch("/auth/change-password", {...})
      await new Promise(r => setTimeout(r, 600));
      if (form.old_password !== "password") {
        setErr("Ancien mot de passe incorrect."); return;
      }
      toast("Mot de passe modifié avec succès.", "success");
      setShowModal(false);
      setForm({ old_password: "", password: "", password_confirmation: "" });
    } catch { setErr("Erreur serveur."); }
    finally { setLoading(false); }
  };

  const infoRows = [
    { label: "Email",   value: user?.email,           icon: "✉" },
    { label: "Service", value: user?.service?.nom,     icon: "🏢" },
    { label: "Rôle",    value: null, badge: <RoleBadge libelle={user?.role?.libelle} />, icon: "🛡" },
    { label: "Statut",  value: null, badge: <StatusBadge actif={user?.actif} />,         icon: "◉" },
  ];

  return (
    <div style={{ padding: "22px 26px", maxWidth: 560 }}>
      <Card padding={0} style={{ overflow: "hidden" }}>
        {/* En-tête profil */}
        <div style={{
          background: C.greyD,
          padding: "24px 24px",
          display: "flex", alignItems: "center", gap: 18,
          position: "relative", overflow: "hidden",
        }}>
          {/* Déco */}
          <div style={{
            position: "absolute", right: -20, top: -20,
            width: 150, height: 150, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,119,34,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <Avatar nom={user?.nom || ""} prenom={user?.prenom || ""} size={58} fontSize={20} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ color: C.white, fontSize: 19, fontWeight: 700 }}>
              {user?.prenom} {user?.nom}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 3 }}>{user?.email}</div>
            <div style={{ marginTop: 8 }}>
              <RoleBadge libelle={user?.role?.libelle} />
            </div>
          </div>
        </div>

        {/* Informations */}
        <div style={{ padding: "4px 0" }}>
          {infoRows.map(({ label, value, badge, icon }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 24px",
              borderBottom: `1px solid ${C.greyL}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: C.greyXL,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                }}>{icon}</span>
                <span style={{ fontSize: 13, color: C.grey, fontWeight: 500 }}>{label}</span>
              </div>
              {badge || <span style={{ fontSize: 13, color: C.greyD, fontWeight: 500 }}>{value || "—"}</span>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: "16px 24px", background: C.greyXL, borderTop: `1px solid ${C.greyL}` }}>
          <Btn
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            🔑 Changer mon mot de passe
          </Btn>
        </div>
      </Card>

      {/* Modal mot de passe */}
      {showModal && (
        <Modal
          title="Changer mon mot de passe"
          icon="🔑"
          onClose={() => { setShowModal(false); setErr(""); setForm({ old_password: "", password: "", password_confirmation: "" }); }}
          width={440}
        >
          <form onSubmit={handleChangePwd}>
            {err && (
              <div style={{
                background: C.redL, color: C.redD,
                padding: "10px 13px", borderRadius: 8,
                marginBottom: 14, fontSize: 12.5,
                display: "flex", gap: 7, alignItems: "center",
                border: `1px solid ${C.red}20`,
              }}>
                <span>⚠</span>{err}
              </div>
            )}

            <Field label="Ancien mot de passe" required>
              <Input
                type="password"
                value={form.old_password}
                onChange={(e) => setForm({ ...form, old_password: e.target.value })}
                placeholder="Votre mot de passe actuel"
              />
            </Field>
            <Field label="Nouveau mot de passe" required hint="Minimum 8 caractères">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 caractères"
              />
            </Field>
            <Field label="Confirmer le nouveau mot de passe" required>
              <Input
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                placeholder="Confirmez le nouveau mot de passe"
              />
            </Field>

            <div style={{
              display: "flex", gap: 10, justifyContent: "flex-end",
              marginTop: 8, paddingTop: 14,
              borderTop: `1px solid ${C.greyL}`,
            }}>
              <Btn
                variant="ghost"
                onClick={() => { setShowModal(false); setErr(""); }}
                disabled={loading}
              >Annuler</Btn>
              <Btn variant="primary" type="submit" disabled={loading}>
                {loading ? "⏳ Modification..." : "Modifier"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;