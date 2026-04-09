// src/pages/EntrantDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EntrantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courrier, setCourrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/courriers/entrants/${id}`);
      setCourrier(res.data);
    } catch (err) {
      setError("Impossible de charger les détails du courrier");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "120px", color: "#777" }}>
        Chargement des détails...
      </div>
    );
  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", padding: "100px" }}>
        {error}
      </div>
    );
  if (!courrier)
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        Courrier non trouvé
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F9FA",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 30,
            cursor: "pointer",
          }}
        >
          ← Retour à la liste
        </button>

        <div
          style={{
            background: "white",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            overflow: "hidden",
            border: "1px solid #F0F0F0",
          }}
        >
          {/* En-tête élégant */}
          <div
            style={{
              background: "linear-gradient(135deg, #E8570A, #FF8A3D)",
              color: "white",
              padding: "40px 50px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>
                  Courrier Entrant
                </p>
                <h1
                  style={{ margin: "8px 0 0", fontSize: 26, fontWeight: 600 }}
                >
                  N° {courrier.numero_ordre}
                </h1>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    padding: "10px 24px",
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: 30,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {courrier.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: "50px" }}>
            <h2 style={{ color: "#333", marginBottom: 24, fontSize: 20 }}>
              Informations Générales
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px 40px",
              }}
            >
              <div>
                <p style={{ color: "#777", margin: "0 0 4px 0", fontSize: 14 }}>
                  Objet
                </p>
                <p style={{ fontSize: 17, color: "#222", fontWeight: 500 }}>
                  {courrier.objet}
                </p>
              </div>

              <div>
                <p style={{ color: "#777", margin: "0 0 4px 0", fontSize: 14 }}>
                  Expéditeur
                </p>
                <p style={{ fontSize: 17, color: "#222" }}>
                  {courrier.expediteur_nom}
                </p>
              </div>

              <div>
                <p style={{ color: "#777", margin: "0 0 4px 0", fontSize: 14 }}>
                  Organisme
                </p>
                <p style={{ fontSize: 17, color: "#222" }}>
                  {courrier.expediteur_organisme || "—"}
                </p>
              </div>

              <div>
                <p style={{ color: "#777", margin: "0 0 4px 0", fontSize: 14 }}>
                  Date de réception
                </p>
                <p style={{ fontSize: 17, color: "#222" }}>
                  {new Date(courrier.date_reception).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              <div>
                <p style={{ color: "#777", margin: "0 0 4px 0", fontSize: 14 }}>
                  Priorité
                </p>
                <br></br>
                <span
                  style={{
                    ...getPrioriteStyle(courrier.priorite),
                    padding: "8px 20px",
                    borderRadius: 30,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {courrier.priorite}
                </span>
              </div>

              <div>
                <p style={{ color: "#777", margin: "0 0 4px 0", fontSize: 14 }}>
                  Statut
                </p>
                <br></br>
                <span
                  style={{
                    ...getStatutStyle(courrier.statut),
                    padding: "8px 20px",
                    borderRadius: 30,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {courrier.statut}
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ marginTop: 50, display: "flex", gap: 16 }}>
              {courrier.statut === "enregistre" && (
                <a
                  href={`/edit/${courrier.id_entrant}`}
                  style={{
                    background: "#F1F1F1",
                  color: "#555",
                    padding: "14px 32px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  ✏️ Modifier ce courrier
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles des badges
const getPrioriteStyle = (p) => {
  if (p === "tres_urgente") return { background: "#fee2e2", color: "#ef4444" };
  if (p === "urgente") return { background: "#fef3c7", color: "#f59e0b" };
  return { background: "#ecfdf5", color: "#10b981" };
};

const getStatutStyle = (s) => {
  if (s === "enregistre") return { background: "#f3f4f6", color: "#6b7280" };
  if (s === "affecte") return { background: "#dbeafe", color: "#3b82f6" };
  if (s === "en_cours") return { background: "#fef3c7", color: "#f59e0b" };
  if (s === "traite") return { background: "#ecfdf5", color: "#10b981" };
  return { background: "#f3f4f6", color: "#6b7280" };
};
