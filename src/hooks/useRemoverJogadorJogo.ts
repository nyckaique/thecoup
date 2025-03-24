import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogo } from "../types/jogo";

export function useRemoverJogadorJogo() {
  const removerJogadorJogo = async (jogo: Jogo, uid: string) => {
    if (!jogo) {
      console.error("Jogo não encontrado.");
      return;
    }

    try {
      // Filtra a lista de jogadores, removendo o jogador com o UID fornecido
      const novaLista = jogo.jogadores.filter((jogador) => jogador.uid !== uid);

      // Referência ao documento do jogo no Firestore
      const jogoRef = doc(db, "jogos", jogo.id);

      // Atualiza a lista de jogadores no Firestore
      await updateDoc(jogoRef, { jogadores: novaLista });

      console.log("Jogador removido do jogo com sucesso.");
    } catch (error) {
      console.error("Erro ao remover jogador:", error);
      alert("Ocorreu um erro ao remover o jogador.");
    }
  };

  return removerJogadorJogo;
}
