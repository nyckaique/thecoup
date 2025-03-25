import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";
import { Jogo } from "../types/jogo";
import { criarBaralho } from "../lib/game/utils/gameUtils";
import { transformarJogadoresParaJogo } from "../lib/game/utils/transformarJogadores";
import { Carta } from "../types/carta";

export function useIniciarPartida() {
  const iniciarPartida = async (sala: Sala) => {
    const salaRef = doc(db, "salas", sala.id);
    if (sala.jogadores.length < 3) {
      alert("Não há jogadores suficientes para iniciar a partida.");
      return;
    }
    
    // Verifica se todos os jogadores estão prontos
    const todosProntos = sala.jogadores.every((jogador) => jogador.ready);
    if (!todosProntos) {
      alert("Algum jogador não está pronto!");
      return;
    }

    // Prepara o jogo
    const baralho = criarBaralho(sala.jogadores.length);
    const jogadoresInGame = transformarJogadoresParaJogo(sala.jogadores, baralho);

    const jogoNovo:Jogo = {
      id: "a",
      salaId: sala.id,
      jogadores: jogadoresInGame,
      status: "iniciado" as const,
      jogadorAtualId: sala.jogadores[0].uid, // Primeiro jogador começa
      baralho,
      descarte: [] as Carta[],
      historico: [] as string[],
      fase: "escolhendoAcao" as const
    };

    // Cria um novo documento na coleção de jogos
    const jogoRef = await addDoc(collection(db, "jogos"), jogoNovo);

    // Agora, atualizamos o documento para incluir o 'id' do Firestore
    await updateDoc(jogoRef, {
      id: jogoRef.id, // Adiciona o 'id' gerado pelo Firestore
    });

    // Atualiza a sala com o status e o ID do jogo
    await updateDoc(salaRef, {
      status: "em jogo",
      jogoId: jogoRef.id,
    });

    return jogoRef.id; // Retorna o ID do jogo criado
  };

  return iniciarPartida;
}
