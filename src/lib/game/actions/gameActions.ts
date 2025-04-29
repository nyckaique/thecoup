import { Acao } from "../../../types/acao";
import { Influencia } from "../../../types/influencia";
import { JogadorInGame } from "../../../types/jogadorInGame";
import { Jogo } from "../../../types/jogo";
import { getProximoJogadorAtivo } from "../utils/gameUtils";

export const executarAcao = (
  jogo: Jogo,
  acao: Acao,
  jogadorDoTurno: JogadorInGame,
  alvoId?: string,
  influenciaDeclarada?: Influencia
): Partial<Jogo> => {
  const baseChanges = {
    acaoAtual: {
      jogadorId: jogo.jogadorAtualId,
      tipo: acao,
    },
  };

  switch (acao) {
    case "Renda":
      return {
        ...baseChanges,
        jogadores: jogo.jogadores.map((j) =>
          j.uid === jogo.jogadorAtualId ? { ...j, dinheiro: j.dinheiro + 1 } : j
        ),
        fase: "finalizandoTurno", // Finaliza imediatamente
        historico: [
          ...jogo.historico,
          `${jogadorDoTurno.nome} executa a ação de ${acao} para receber + $1.`,
        ],
      };

    case "Ajuda externa":
      return {
        ...baseChanges,
        jogadores: jogo.jogadores.map((j) =>
          j.uid === jogo.jogadorAtualId ? { ...j, dinheiro: j.dinheiro + 2 } : j
        ),
        fase: "desafiandoAcao", // Permite desafios
        historico: [
          ...jogo.historico,
          `${jogadorDoTurno.nome} quer executar a ação ${acao} para receber + $2.`,
        ],
      };

    // ... outras ações

    default:
      return { ...baseChanges, fase: "finalizandoTurno" };
  }
};

export const finalizarTurno = (jogo: Jogo): Partial<Jogo> => {
  const indexAtual = jogo.jogadores.findIndex(
    (j) => j.uid === jogo.jogadorAtualId
  );

  // Encontra próximo jogador ativo de forma circular
  for (let i = 1; i <= jogo.jogadores.length; i++) {
    const proximoIndex = (indexAtual + i) % jogo.jogadores.length;
    if (jogo.jogadores[proximoIndex].estaVivo) {
      return {
        jogadorAtualId: jogo.jogadores[proximoIndex].uid,
        fase: "escolhendoAcao",
        acaoAtual: undefined,
        historico: [
          ...jogo.historico,
          `Turno de ${jogo.jogadores[proximoIndex].nome}`,
        ],
      };
    }
  }

  // Caso não encontre (teórico, pois validamos jogadoresAtivos.length anteriormente)
  throw new Error("Nenhum jogador ativo encontrado");
};
