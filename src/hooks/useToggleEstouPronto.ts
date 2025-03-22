import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";
import { User } from "firebase/auth";

export function useToggleEstouPronto(sala: Sala | null) {
  const toggleEstouPronto = async (user: User) => {
    if (!sala) return;

    const novosJogadores = sala.jogadores.map((jogador) =>
      jogador.uid === user.uid ? { ...jogador, ready: !jogador.ready } : jogador
    );

    const salaRef = doc(db, "salas", sala.id);
    await updateDoc(salaRef, { jogadores: novosJogadores });
  };

  return toggleEstouPronto;
}
