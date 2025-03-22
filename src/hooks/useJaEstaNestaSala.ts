import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

export function useJaEstaNestaSala() {
  const navigate = useNavigate();

  const jaEstaNestaSala = async (user: User, id: string): Promise<boolean> => {
    // Verifica se o usuário já está em uma sala
    const salasRef = doc(db, "salas", id);
    const salaSnapshot = await getDoc(salasRef);
    if (salaSnapshot.exists()) {
      const sala = salaSnapshot.data() as Sala;

      // Verifica se o usuário já está na sala e se o status não é "encerrada"
      if (
        sala.jogadores.some((jogador) => jogador.uid === user.uid) &&
        sala.status !== "encerrada"
      ) {
        navigate(`/sala/${sala.id}`);
        alert("Você já está em uma sala ja.");
        return true; // Retorna true se o usuário já estiver na sala
      }
    }

    return false; // Retorna false se o usuário não estiver na sala ou a sala não existir
  };

  return jaEstaNestaSala;
}
