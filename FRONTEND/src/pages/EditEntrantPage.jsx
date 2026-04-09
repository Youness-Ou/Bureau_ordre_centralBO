// src/pages/EditEntrantPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditEntrantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    objet: "",
    expediteur_nom: "",
    expediteur_organisme: "",
    date_reception: "",
    priorite: "normale",
    id_service_dest: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [numeroOrdre, setNumeroOrdre] = useState("");

  useEffect(() => {
    fetchCourrier();
  }, [id]);

  const fetchCourrier = async () => {
    try {
      const res = await api.get(`/courriers/entrants/${id}`);
      const c = res.data;

      if (c.statut !== "enregistre") {
        alert("Ce courrier ne peut plus être modifié.");
        navigate(`/detail/${id}`);
        return;
      }

      setNumeroOrdre(c.numero_ordre);
      setFormData({
        objet: c.objet,
        expediteur_nom: c.expediteur_nom,
        expediteur_organisme: c.expediteur_organisme || "",
        date_reception: c.date_reception,
        priorite: c.priorite,
        id_service_dest: c.id_service_dest || "",
      });
    } catch (err) {
      setError("Impossible de charger les données du courrier");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/courriers/entrants/${id}`, formData);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/detail/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "120px" }}>Chargement...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", padding: "40px 20px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

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

        <div style={{
          background: "white",
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>

          {/* En-tête */}
          <div style={{
            background: "linear-gradient(135deg, #E8570A, #FF8A3D)",
            color: "white",
            padding: "40px 50px",
          }}>
            <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>Modification du courrier</p>
            <h1 style={{ margin: "8px 0 0", fontSize: 26, fontWeight: 600 }}>
              N° {numeroOrdre}
            </h1>
          </div>

          <div style={{ padding: "50px" }}>

            {success && (
              <div style={{ padding: "16px", background: "#EAF3DE", color: "#3B6D11", borderRadius: 12, marginBottom: 30 }}>
                Modifications enregistrées avec succès !
              </div>
            )}

            {error && (
              <div style={{ padding: "16px", background: "#FCEBEB", color: "#A32D2D", borderRadius: 12, marginBottom: 30 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>

              {/* Objet */}
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500, color: "#555" }}>
                  Objet du courrier *
                </label>
                <input
                  type="text"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    border: "1.5px solid #ddd",
                    borderRadius: 12,
                    fontSize: 16,
                  }}
                />
              </div>

              {/* Expéditeur + Organisme - avec plus d'espace */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 58 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500, color: "#555" }}>
                    Nom de l'expéditeur *
                  </label>
                  <input
                    type="text"
                    name="expediteur_nom"
                    value={formData.expediteur_nom}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1.5px solid #ddd",
                      borderRadius: 12,
                      fontSize: 16,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500, color: "#555" }}>
                    Organisme
                  </label>
                  <input
                    type="text"
                    name="expediteur_organisme"
                    value={formData.expediteur_organisme}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1.5px solid #ddd",
                      borderRadius: 12,
                      fontSize: 16,
                    }}
                  />
                </div>
              </div>

              {/* Date + Priorité - avec plus d'espace */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 58 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500, color: "#555" }}>
                    Date de réception *
                  </label>
                  <input
                    type="date"
                    name="date_reception"
                    value={formData.date_reception}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1.5px solid #ddd",
                      borderRadius: 12,
                      fontSize: 16,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500, color: "#555" }}>
                    Priorité *
                  </label>
                  <select
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1.5px solid #ddd",
                      borderRadius: 12,
                      fontSize: 16,
                      background: "white",
                    }}
                  >
                    <option value="normale">Normale</option>
                    <option value="urgente">Urgente</option>
                    <option value="tres_urgente">Très Urgente</option>
                  </select>
                </div>
              </div>

              {/* Service Destinataire */}
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500, color: "#555" }}>
                  Service destinataire
                </label>
                <select
                  name="id_service_dest"
                  value={formData.id_service_dest}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    border: "1.5px solid #ddd",
                    borderRadius: 12,
                    fontSize: 16,
                    background: "white",
                  }}
                >
                  <option value="">Choisir un service (optionnel)</option>
                  <option value="1">Direction Générale</option>
                  <option value="2">Service Technique</option>
                  <option value="3">Service Financier</option>
                </select>
              </div>

              {/* Boutons */}
              <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: saving ? "#ccc" : "#E8570A",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Enregistrement en cours..." : "Enregistrer les modifications"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: "#F1F1F1",
                    color: "#555",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}