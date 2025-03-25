import { Carta } from "./carta";
import { JogadorInGame } from "./jogadorInGame";

export interface Jogo {
  id: string;
  salaId: string;
  jogadores: JogadorInGame[];
  status: "iniciado" | "encerrado";
  jogadorAtualId: string;
  fase: "escolhendoAcao" | "desafiando" | "bloqueando" | "executando" | "finalizado";
  baralho: Carta[];
  descarte: Carta[];
  historico: string[];
}
