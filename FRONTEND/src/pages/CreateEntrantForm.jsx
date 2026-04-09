// src/pages/CreateEntrantForm.jsx
import { useState } from "react";
import api from "../services/api";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  orange: "#E8570A",
  orangeLight: "#FFF1EB",
  orangeMid: "#F97316",
  gray50: "#F9F9F8",
  gray100: "#EBEBEA",
  gray300: "#C4C3BE",
  gray500: "#7A7975",
  gray700: "#3A3A38",
  white: "#FFFFFF",
  green50: "#EAF3DE",
  green700: "#3B6D11",
  red50: "#FCEBEB",
  red700: "#A32D2D",
};

function Label({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: C.gray500,
        marginBottom: 6,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}
    >
      {children}
      {required && <span style={{ color: C.orange, marginLeft: 3 }}>*</span>}
    </label>
  );
}

function Field({ style, ...props }) {
  const base = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    fontSize: 15,
    color: C.gray700,
    background: C.white,
    border: `1.5px solid ${C.gray100}`,
    borderRadius: 10,
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
    ...style,
  };
  return (
    <input
      {...props}
      style={base}
      onFocus={(e) => (e.target.style.borderColor = C.orange)}
      onBlur={(e) => (e.target.style.borderColor = C.gray100)}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 14px",
        fontSize: 15,
        color: C.gray700,
        background: C.white,
        border: `1.5px solid ${C.gray100}`,
        borderRadius: 10,
        outline: "none",
        fontFamily: "inherit",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7975' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
      onFocus={(e) => (e.target.style.borderColor = C.orange)}
      onBlur={(e) => (e.target.style.borderColor = C.gray100)}
    >
      {children}
    </select>
  );
}

const EMPTY = {
  objet: "",
  expediteur_nom: "",
  expediteur_organisme: "",
  date_reception: "",
  priorite: "",
  id_service_dest: "",
};

export default function CreateEntrantForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [numeroOrdre, setNumeroOrdre] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      console.log("Envoi des données :", formData);

      const res = await api.post("/courriers/entrants", formData);

      console.log("Réponse réussie :", res.data);

      setNumeroOrdre(res.data.courrier?.numero_ordre || "N/A");
      setSuccess(true);

      setFormData(EMPTY); // Réinitialiser
    } catch (err) {
      console.error("Erreur :", err);
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        setErrorMessage(
          "Erreurs de validation :\n" +
            Object.entries(errors)
              .map(([k, v]) => `• ${k} : ${v[0]}`)
              .join("\n"),
        );
      } else {
        setErrorMessage(
          err.response?.data?.message || "Erreur lors de l'enregistrement.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: C.gray50, padding: "48px 16px" }}
    >
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: C.gray700,
              }}
            >
              Nouveau Courrier Entrant
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: C.gray500 }}>
              Bureau d'Ordre Centrale
            </p>
          </div>
        </div>

        <div
          style={{
            background: C.white,
            borderRadius: 16,
            border: `1px solid ${C.gray100}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, ${C.orange} 0%, ${C.orangeMid} 100%)`,
            }}
          />

          <div style={{ padding: "28px 32px 32px" }}>
            {success && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "14px 18px",
                  background: C.green50,
                  border: `1px solid #C0DD97`,
                  borderRadius: 10,
                }}
              >
                <p style={{ margin: 0, fontWeight: 600, color: C.green700 }}>
                  Courrier enregistré avec succès
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 13, color: C.green700 }}
                >
                  Référence : <strong>{numeroOrdre}</strong>
                </p>
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "14px 18px",
                  background: C.red50,
                  border: `1px solid #F7C1C1`,
                  borderRadius: 10,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: C.red700,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <Label required>Objet du courrier</Label>
                <Field
                  type="text"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Label required>Nom de l'expéditeur</Label>
                  <Field
                    type="text"
                    name="expediteur_nom"
                    value={formData.expediteur_nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label>Organisme</Label>
                  <Field
                    type="text"
                    name="expediteur_organisme"
                    value={formData.expediteur_organisme}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Label required>Date de réception</Label>
                  <Field
                    type="date"
                    name="date_reception"
                    value={formData.date_reception}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label>Priorité</Label>
                  <Select
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleChange}
                  >
                    <option value="normale">Normale</option>
                    <option value="urgente">Urgente</option>
                    <option value="tres_urgente">Très urgente</option>
                  </Select>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <Label>Service destinataire</Label>
                <Select
                  name="id_service_dest"
                  value={formData.id_service_dest}
                  onChange={handleChange}
                >
                  <option value="1">Direction Générale</option>
                  <option value="2">Service Technique</option>
                  <option value="3">Service Financier</option>
                </Select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  background: loading ? C.gray300 : C.orange,
                  color: C.white,
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Enregistrement…" : "Enregistrer le courrier"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
