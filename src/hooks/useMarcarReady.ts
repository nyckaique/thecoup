import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogador } from "../types/jogador";

// export function useMarcarReady() {
//   const marcarReady = async (salaId: string, jogadorId: string) => {
//     const salaRef = doc(db, "salas", salaId);

//     // A lógica agora garante que apenas o campo 'ready' do jogador seja atualizado
//     await updateDoc(salaRef, {
//       [`jogadores.${jogadorId}.ready`]: true, // Atualiza o 'ready' do jogador
//     });
//   };

//   return marcarReady;
// }

export function useMarcarReady() {
  const marcarReady = async (salaId: string, jogadorId: string) => {
    const salaRef = doc(db, "salas", salaId);

    try {
      // Pega os dados da sala
      const salaDoc = await getDoc(salaRef);
      if (!salaDoc.exists()) {
        throw new Error("Sala não encontrada");
      }

      // Recupera a lista de jogadores
      const jogadores = salaDoc.data()?.jogadores || [];

      // Atualiza o jogador específico
      const jogadoresAtualizados = jogadores.map((jogador: Jogador) =>
        jogador.uid === jogadorId ? { ...jogador, ready: true } : jogador
      );

      // Atualiza a sala no Firestore com a lista de jogadores atualizada
      await updateDoc(salaRef, {
        jogadores: jogadoresAtualizados,
      });
    } catch (error) {
      console.error("Erro ao marcar como pronto:", error);
    }
  };

  return marcarReady;
}

