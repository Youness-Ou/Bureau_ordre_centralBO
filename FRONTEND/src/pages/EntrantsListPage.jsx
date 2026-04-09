// src/pages/EntrantsListPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

export default function EntrantsListPage() {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriorite, setFilterPriorite] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = plus récent en premier

  useEffect(() => {
    loadCourriers();
  }, []);

  const loadCourriers = async () => {
    try {
      const res = await api.get("/courriers/entrants");
      setCourriers(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage + Tri
  const filteredAndSortedCourriers = courriers
    .filter((c) => {
      const matchSearch =
        c.numero_ordre?.toLowerCase().includes(search.toLowerCase()) ||
        c.objet?.toLowerCase().includes(search.toLowerCase()) ||
        c.expediteur_nom?.toLowerCase().includes(search.toLowerCase());

      const matchPriorite = !filterPriorite || c.priorite === filterPriorite;

      const matchDate =
        (!dateDebut || c.date_reception >= dateDebut) &&
        (!dateFin || c.date_reception <= dateFin);

      return matchSearch && matchPriorite && matchDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date_reception);
      const dateB = new Date(b.date_reception);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#7A7975" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F9F8",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#3A3A38",
                margin: 0,
              }}
            >
              Courriers Entrants
            </h1>
            <p style={{ color: "#7A7975", marginTop: 6 }}>
              Gestion des courriers reçus
            </p>
          </div>

          <a
            href="/create"
            style={{
              background: "#E8570A",
              color: "white",
              padding: "12px 28px",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            + Nouveau courrier
          </a>
        </div>

        {/* Filtres */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <input
            type="text"
            placeholder="Rechercher par numéro, objet ou expéditeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "280px",
              padding: "14px 20px",
              border: "1.5px solid #EBEBEA",
              borderRadius: 12,
              fontSize: 15,
              outline: "none",
            }}
          />

          <select
            value={filterPriorite}
            onChange={(e) => setFilterPriorite(e.target.value)}
            style={{
              padding: "14px 20px",
              border: "1.5px solid #EBEBEA",
              borderRadius: 12,
              minWidth: "160px",
            }}
          >
            <option value="">Toutes les priorités</option>
            <option value="normale">Normale</option>
            <option value="urgente">Urgente</option>
            <option value="tres_urgente">Très Urgente</option>
          </select>

          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            style={{
              padding: "14px 20px",
              border: "1.5px solid #EBEBEA",
              borderRadius: 12,
            }}
          />

          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            style={{
              padding: "14px 20px",
              border: "1.5px solid #EBEBEA",
              borderRadius: 12,
            }}
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "14px 20px",
              border: "1.5px solid #EBEBEA",
              borderRadius: 12,
            }}
          >
            <option value="desc">Date ↓ (récent)</option>
            <option value="asc">Date ↑ (ancien)</option>
          </select>
        </div>

        {/* Tableau */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #EBEBEA",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9F9F8" }}>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "left",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Numéro
                </th>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "left",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Objet
                </th>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "left",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Expéditeur
                </th>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "left",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "center",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Priorité
                </th>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "center",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    padding: "18px 24px",
                    textAlign: "center",
                    color: "#7A7975",
                    fontWeight: 500,
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCourriers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "80px",
                      textAlign: "center",
                      color: "#7A7975",
                    }}
                  >
                    Aucun courrier trouvé
                  </td>
                </tr>
              ) : (
                filteredAndSortedCourriers.map((c) => (
                  <tr
                    key={c.id_entrant}
                    style={{ borderTop: "1px solid #EBEBEA" }}
                  >
                    <td style={{ padding: "18px 24px", fontWeight: 600 }}>
                      {c.numero_ordre}
                    </td>
                    <td style={{ padding: "18px 24px" }}>{c.objet}</td>
                    <td style={{ padding: "18px 24px", color: "#555" }}>
                      {c.expediteur_nom}
                    </td>
                    <td style={{ padding: "18px 24px", color: "#555" }}>
                      {new Date(c.date_reception).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "18px 24px", textAlign: "center" }}>
                      <span
                        style={{
                          ...getPrioriteStyle(c.priorite),
                          padding: "6px 16px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {c.priorite}
                      </span>
                    </td>
                    <td style={{ padding: "18px 24px", textAlign: "center" }}>
                      <span
                        style={{
                          ...getStatutStyle(c.statut),
                          padding: "6px 16px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {c.statut}
                      </span>
                    </td>
                    <td style={{ padding: "18px 24px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          justifyContent: "center",
                        }}
                      >
                        <a
                          href={`/detail/${c.id_entrant}`}
                          style={{ color: "#E8570A", fontSize: 20 }}
                          title="Détail"
                        >
                          👁
                        </a>
                        {c.statut === "enregistre" && (
                          <a
                            href={`/edit/${c.id_entrant}`}
                            style={{ color: "#3B82F6", fontSize: 20 }}
                            title="Modifier"
                          >
                            ✏️
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helpers
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
