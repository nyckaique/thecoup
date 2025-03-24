import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogador } from "../types/jogador";

export function useRemoverJogadorSala() {
  const removerJogadorSala = async (salaId: string, uid: string) => {
    try {
      const salaRef = doc(db, "salas", salaId);

      // Precisamos primeiro obter os dados atuais da sala
      const salaSnapshot = await getDoc(salaRef);
      if (!salaSnapshot.exists()) {
        throw new Error("Sala não encontrada");
      }

      const salaData = salaSnapshot.data();
      const novosJogadores = salaData.jogadores.filter(
        (jogador: Jogador) => jogador.uid !== uid
      );

      await updateDoc(salaRef, { jogadores: novosJogadores });
      console.log("Jogador removido da sala com sucesso.");
    } catch (error) {
      console.error("Erro ao remover jogador da sala:", error);
      throw error;
    }
  };

  return removerJogadorSala;
}
