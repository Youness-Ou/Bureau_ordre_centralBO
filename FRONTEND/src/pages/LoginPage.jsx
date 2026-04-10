import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { C, shadows } from "../components/ui";

const DEMO_ACCOUNTS = [
  { role: "Administrateur", email: "admin@boc.ma",   pwd: "password", color: "#7C3AED", light: "#EDE9FE" },
  { role: "Agent B.O.",     email: "agent@boc.ma",   pwd: "password", color: "#0D9488", light: "#CCFBF1" },
  { role: "Employé",        email: "employe@boc.ma", pwd: "password", color: "#2563EB", light: "#DBEAFE" },
];

const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [form,          setForm]          = useState({ email: "", password: "" });
  const [errors,        setErrors]        = useState({});
  const [loading,       setLoading]       = useState(false);
  const [showPwd,       setShowPwd]       = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "L'adresse email est requise";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email invalide";
    if (!form.password) e.password = "Le mot de passe est requis";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      if (onLoginSuccess) onLoginSuccess(res.data.user);
    } catch (err) {
      setLoginAttempts((p) => p + 1);
      const status = err.response?.status;
      if (status === 403) setErrors({ email: err.response.data.message });
      else setErrors({ password: err.response?.data?.message || "Identifiants incorrects." });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#111827",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background texture subtile */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 20% 40%, rgba(232,119,34,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 70%, rgba(124,58,237,0.06) 0%, transparent 60%)
        `,
        pointerEvents: "none",
      }} />

      {/* ── PANNEAU GAUCHE – Branding ─────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px",
        position: "relative", zIndex: 1,
      }}>
        {/* Logo TGR réel */}
        <div style={{
          display: "flex", alignItems: "center", gap: 18, marginBottom: 52,
        }}>
          <div style={{
            width: 80, height: 80,
            background: C.white,
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}>
            <img
              src="/logo.png"
              alt="TGR"
              style={{ width: "88%", height: "88%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML = '<span style="font-size:36px">🏛</span>';
              }}
            />
          </div>
          <div>
            <div style={{ color: C.white, fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>
              Trésorerie Générale du Royaume
            </div>
            <div style={{ color: C.orange, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginTop: 3 }}>
              Bureau d'Ordre Centrale
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ color: C.white, fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, maxWidth: 420 }}>
          Gestion{" "}
          <span style={{ color: C.orange }}>digitale</span>
          <br />du courrier
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, maxWidth: 380, marginBottom: 44 }}>
          Plateforme centralisée pour l'enregistrement, le suivi et l'archivage des courriers entrants et sortants.
        </div>

        {/* Comptes démo */}
        <div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10.5, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
            Accès de démonstration
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEMO_ACCOUNTS.map((d) => (
              <button
                key={d.role}
                onClick={() => fillDemo(d.email, d.pwd)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 9, padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: "pointer", textAlign: "left",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: d.color + "25",
                  border: `1px solid ${d.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color }} />
                </div>
                <div>
                  <div style={{ color: C.white, fontSize: 12.5, fontWeight: 600 }}>{d.role}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 1 }}>
                    {d.email} · {d.pwd}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div style={{ width: 1, background: "rgba(255,255,255,0.06)", margin: "48px 0" }} />

      {/* ── PANNEAU DROIT – Formulaire ────────────────────────── */}
      <div style={{
        width: 460,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 48px",
        position: "relative", zIndex: 1,
      }}>
        {/* Card formulaire */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "32px 32px 28px",
          backdropFilter: "blur(12px)",
        }}>
          {/* Titre form */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ color: C.orange, fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              Connexion sécurisée
            </div>
            <div style={{ color: C.white, fontSize: 24, fontWeight: 800 }}>Bienvenue</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
              Connectez-vous pour accéder à votre espace
            </div>
          </div>

          {/* Avertissement tentatives */}
          {loginAttempts >= 3 && (
            <div style={{
              background: "rgba(220,38,38,0.12)",
              border: "1px solid rgba(220,38,38,0.25)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20,
              fontSize: 12.5, color: "#FCA5A5",
              display: "flex", gap: 8, alignItems: "flex-start",
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>Plusieurs tentatives échouées. Utilisez les comptes de démonstration si besoin.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.55)",
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: 0.8, marginBottom: 7,
              }}>Adresse email</label>
              <DarkInput
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.ma"
                icon="✉"
                error={!!errors.email}
              />
              {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.55)",
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: 0.8, marginBottom: 7,
              }}>Mot de passe</label>
              <DarkInput
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                icon="🔒"
                error={!!errors.password}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{
                      background: "none", border: "none",
                      color: "rgba(255,255,255,0.35)",
                      cursor: "pointer", fontSize: 14, padding: 0,
                    }}
                  >{showPwd ? "🙈" : "👁"}</button>
                }
              />
              {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
                border: "none", borderRadius: 9,
                color: C.white, fontSize: 14, fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: loading ? "none" : shadows.orange,
                letterSpacing: 0.3, fontFamily: "inherit",
                transition: "all .15s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderTopColor: C.white,
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                  }} />
                  Connexion...
                </>
              ) : "Se connecter →"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 20, textAlign: "center",
          color: "rgba(255,255,255,0.18)", fontSize: 11,
        }}>
          Système sécurisé — Trésorerie Générale du Royaume · 2026
        </div>
      </div>
    </div>
  );
};

// Composant input sombre pour le formulaire de login
const DarkInput = ({ icon, rightEl, error, ...p }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
        color: focused ? "rgba(232,119,34,0.7)" : "rgba(255,255,255,0.25)",
        fontSize: 14, pointerEvents: "none",
        transition: "color .15s",
      }}>{icon}</span>
      <input
        {...p}
        onFocus={(e) => { setFocused(true); p.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); p.onBlur?.(e); }}
        style={{
          width: "100%",
          padding: "11px 40px 11px 38px",
          background: "rgba(255,255,255,0.07)",
          border: `1.5px solid ${error ? "rgba(220,38,38,0.6)" : focused ? C.orange : "rgba(255,255,255,0.12)"}`,
          borderRadius: 9,
          color: C.white, fontSize: 13.5, outline: "none",
          boxSizing: "border-box", fontFamily: "inherit",
          boxShadow: focused ? `0 0 0 3px ${C.orange}20` : "none",
          transition: "all .15s",
        }}
      />
      {rightEl && (
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
          {rightEl}
        </span>
      )}
    </div>
  );
};

const ErrorMsg = ({ children }) => (
  <div style={{ color: "#FCA5A5", fontSize: 11.5, marginTop: 5, display: "flex", gap: 4, alignItems: "center" }}>
    <span>⚠</span>{children}
  </div>
);

export default LoginPage;