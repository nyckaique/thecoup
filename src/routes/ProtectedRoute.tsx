import { ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJaEstaNestaSala } from "../hooks/useJaEstaNestaSala"; // ou o caminho correto
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { id } = useParams(); // Obtém o id da sala da URL
  const navigate = useNavigate();
  const jaEstaNestaSala = useJaEstaNestaSala(); // Hook para verificar se o usuário está na sala
  const { user } = useAuth();

  useEffect(() => {
    // Verifica se o usuário já está em alguma sala
    const verificarSala = async (id: string | null = null) => {
      if(id && id !== undefined){
        const pertence = await jaEstaNestaSala(user!, id); // Verifica se o usuário pertence à sala
        if (!pertence) {
          navigate("/"); // Redireciona para a página inicial
        }
      }else if (id === undefined || id === null){
        navigate("/");
      }
      return;
    };
    if (!user) {
      navigate("/"); // Se não há user, redireciona para a página inicial
    }
    if (user && id) {
      verificarSala(id);
    }
  }, [user, id, jaEstaNestaSala, navigate]);

  return children;
}

export default ProtectedRoute;
