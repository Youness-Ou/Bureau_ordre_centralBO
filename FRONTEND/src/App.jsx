import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EntrantsListPage from "./pages/EntrantsListPage";
import CreateEntrantForm from "./pages/CreateEntrantForm";
// On créera ces pages ensuite
import EntrantDetailPage from "./pages/EntrantDetailPage";
import EditEntrantPage from "./pages/EditEntrantPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page principale : Liste des courriers */}
        <Route path="/" element={<EntrantsListPage />} />

        {/* Créer un nouveau courrier */}
        <Route path="/create" element={<CreateEntrantForm />} />

        {/* Détail d'un courrier (à créer) */}
        <Route path="/detail/:id" element={<EntrantDetailPage />} />

        {/* Modifier un courrier (à créer) */}
        <Route path="/edit/:id" element={<EditEntrantPage />} />
      </Routes>
    </Router>
  );
}

export default App;