import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useIniciarPartida() {
  const iniciarPartida = async (sala: Sala) => {
    // Verifica se todos os jogadores estão prontos
    const todosProntos = sala.jogadores.every((jogador) => jogador.ready);
    if (!todosProntos) {
      alert("Algum jogador não está pronto.");
      return;
    }

    // Define o tempo de início da partida (10 segundos a partir de agora)
    const tempoInicio = Date.now() + 10000;

    // Atualiza a sala no Firestore
    const salaRef = doc(db, "salas", sala.id);
    await updateDoc(salaRef, {
      status: "contagem",
      inicioPartida: tempoInicio, // Novo campo no Firestore para armazenar o tempo de início
    });
  };

  return iniciarPartida;
}
