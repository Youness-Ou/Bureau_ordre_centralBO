import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — affiche les enfants uniquement si l'utilisateur
 * est connecté et possède l'un des rôles autorisés.
 *
 * Props :
 *   roles?: string[]  — si absent, tout utilisateur connecté est autorisé
 *   fallback?: ReactNode — affiché si accès refusé (défaut : null)
 */
const ProtectedRoute = ({ children, roles, fallback = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 14, color: "#6B6B6B" }}>
        Chargement…
      </div>
    );
  }

  if (!user) return fallback;

  if (roles && !roles.includes(user?.role?.libelle)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#3D3D3D" }}>Accès refusé</div>
        <div style={{ fontSize: 13.5, color: "#6B6B6B" }}>Vous ne disposez pas des droits nécessaires pour accéder à cette page.</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;