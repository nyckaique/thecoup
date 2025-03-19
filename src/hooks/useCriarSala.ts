import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogador } from "../types/jogador";

export function useCriarSala() {
  const criarSala = async (jogador: Jogador) => {
    try {
      const salaRef = await addDoc(collection(db, "salas"), {
        jogadores: [jogador]
      });
      return salaRef.id;
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      throw error;
    }
  };

  return criarSala;
}