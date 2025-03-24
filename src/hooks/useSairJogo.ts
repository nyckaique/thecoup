import { User } from "firebase/auth";
import { db } from "../services/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Jogo } from "../types/jogo";
import { useRemoverJogadorJogo } from "./useRemoverJogadorJogo";
import { useRemoverJogadorSala } from "./useRemoverJogadorSala";

export function useSairJogo() {
  const removerJogadorJogo = useRemoverJogadorJogo();
  const removerJogadorSala = useRemoverJogadorSala();

  const sairJogo = async (jogo: Jogo, user: User, ehDono: boolean) => {
    try {
      const jogoRef = doc(db, "jogos", jogo.id);
      const salaRef = doc(db, "salas", jogo.salaId);

      if (ehDono) {
        if (jogo.jogadores.length === 1) {
          // Se o dono for o único jogador, deleta o jogo e a sala
          await deleteDoc(jogoRef);
          await deleteDoc(salaRef);
          return;
        }

        // Define um novo dono
        const novosJogadores = jogo.jogadores.filter(
          (jogador) => jogador.uid !== user.uid
        );
        const novoDono = novosJogadores[0];

        // Atualiza o jogo
        await updateDoc(jogoRef, {
          jogadores: novosJogadores,
        });

        // Atualiza a sala
        await updateDoc(salaRef, {
          jogadores: novosJogadores,
          criador: novoDono.uid,
        });
      } else {
        // Remove o jogador do jogo
        await removerJogadorJogo(jogo, user.uid);

        // Remove o jogador da sala
        await removerJogadorSala(jogo.salaId, user.uid);
      }
    } catch (error) {
      console.error("Erro ao sair do jogo:", error);
      throw error;
    }
  };

  return sairJogo;
}
