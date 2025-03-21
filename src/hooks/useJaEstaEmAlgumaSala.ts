import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function useJaEstaEmAlgumaSala() {
  const navigate = useNavigate();

  const jaEstaEmAlgumaSala = async (user: User): Promise<boolean> => {
    // Verifica se o usuário já está em uma sala
    const salasRef = collection(db, "salas");
    const salasSnapshot = await getDocs(salasRef);

    for (const doc of salasSnapshot.docs) {
      const sala = doc.data() as Sala;
      // Verifica se o usuário já está na sala e se o status não é "encerrada"
      if (
        sala.jogadores.some((jogador) => jogador.uid === user.uid) &&
        sala.status !== "encerrada"
      ) {
        alert("Você já está em uma sala.");
        navigate(`/sala/${sala.id}`);
        return true; // Retorna true assim que encontrar a sala em que o usuário está
      }
    }

    return false; // Retorna false se o usuário não estiver em nenhuma sala
  };

  return jaEstaEmAlgumaSala;
}
