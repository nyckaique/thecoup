import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useVerificarRemocao() {
  const { id } = useParams(); // Obtém o ID da sala da URL
  const { user } = useAuth(); // Obtém o usuário atual
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;

    // Referência ao documento da sala no Firestore
    const salaRef = doc(db, "salas", id);

    // Escuta as mudanças na sala em tempo real
    const unsubscribe = onSnapshot(salaRef, (salaDoc) => {
      if (salaDoc.exists()) {
        const jogadores = salaDoc.data().jogadores || [];
        const usuarioEstaNaSala = jogadores.some(
          (jogador: { uid: string }) => jogador.uid === user.uid
        );

        // Se o usuário não estiver mais na sala, redireciona para a home
        if (!usuarioEstaNaSala) {
          navigate("/");
          alert("Você foi removido da sala.");
        }
      }
    });

    // Limpa o listener quando o componente for desmontado
    return () => unsubscribe();
  }, [user, id, navigate]);
}
