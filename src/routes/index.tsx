import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SalaEspera from "../pages/SalaEspera";
import SalaJogo from "../pages/SalaJogo";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/sala/:id"
        element={
          <ProtectedRoute>
            <SalaEspera />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jogo/:id"
        element={
          <ProtectedRoute>
            <SalaJogo />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
