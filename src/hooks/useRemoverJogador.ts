import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useRemoverJogador(sala: Sala | null) {
  const removerJogador = async (uid: string) => {
    if (!sala) {
      console.error("Sala não encontrada.");
      return;
    }

    try {
      // Filtra a lista de jogadores, removendo o jogador com o UID fornecido
      const novaLista = sala.jogadores.filter((jogador) => jogador.uid !== uid);

      // Referência ao documento da sala no Firestore
      const salaRef = doc(db, "salas", sala.id);

      // Atualiza a lista de jogadores no Firestore
      await updateDoc(salaRef, { jogadores: novaLista });

      console.log("Jogador removido com sucesso.");
    } catch (error) {
      console.error("Erro ao remover jogador:", error);
      alert("Ocorreu um erro ao remover o jogador.");
    }
  };

  return removerJogador;
}
