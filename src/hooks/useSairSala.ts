import { User } from "firebase/auth";
import { useRemoverJogadorSala } from "./useRemoverJogadorSala";
import { Sala } from "../types/sala";
import { db } from "../services/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export function useSairSala(sala: Sala) {
  const removerJogadorSala = useRemoverJogadorSala();
  const sairSala = async (user: User, ehDono: boolean) => {
    const salaRef = doc(db, "salas", sala.id);
    if (ehDono) {
      if (sala.jogadores.length === 1) {
        // Se o dono for o único jogador, você sai da sala e deleta a sala
        await removerJogadorSala(sala.id, user.uid);
        await deleteDoc(salaRef);
      } else {
        // Define um novo dono e remove o dono atual
        const novosJogadores = sala.jogadores.filter(
          (jogador) => jogador.uid !== user.uid
        );
        const novoDono = novosJogadores[0]; // Escolhe o primeiro da lista como novo dono

        await updateDoc(salaRef, {
          jogadores: novosJogadores,
          criador: novoDono.uid, // Atualiza o dono
        });

        await removerJogadorSala(sala.id, user.uid);
      }
      // não é dono
    } else {
      await removerJogadorSala(sala.id, user.uid);
    }
    return user.uid;
  };
  return sairSala;
}
