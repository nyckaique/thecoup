// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { ReactNode } from "react";

// function ProtectedRoute({ children }: { children: ReactNode }) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <div>Carregando...</div>; // Exibe um loader enquanto a autenticação carrega
//   }

//   if (!user) {
//     // Redireciona para a Home se o usuário não estiver autenticado
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;