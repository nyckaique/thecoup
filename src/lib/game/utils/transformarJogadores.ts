// src/lib/game/utils/transformJogadores.ts
import { Carta } from "../../../types/carta";
import { Jogador } from "../../../types/jogador";
import { JogadorInGame } from "../../../types/jogadorInGame";

export const transformarJogadoresParaJogo = (
  jogadores: Jogador[],
  baralho: Carta[]
): JogadorInGame[] => {
  return jogadores.map(jogador => ({
    uid: jogador.uid,
    nome: jogador.nome,
    dinheiro: 2, // Valor inicial padrão
    influencias: [
      { carta: baralho.pop()!, revelada: false },
      { carta: baralho.pop()!, revelada: false }
    ],
    estaVivo: true
  }));
};