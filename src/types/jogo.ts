import { Acao } from "./acao";
import { Carta } from "./carta";
import { JogadorInGame } from "./jogadorInGame";

export type FaseJogo =
  | "escolhendoAcao"
  | "desafiandoAcao"
  | "desafiandoBloqueio"
  | "bloqueandoAcao"
  | "executandoAcao"
  | "finalizandoTurno";

export type StatusJogo = "iniciado" | "encerrado";

export interface Jogo {
  id: string;
  salaId: string;
  status: StatusJogo;
  jogadores: JogadorInGame[];
  jogadorAtualId: string;
  fase: FaseJogo;
  baralho: Carta[];
  descarte: Carta[];
  historico: string[];
  acaoAtual?: {
    tipo: Acao;
    jogadorId: string;
    alvoId?: string;
    custo?: number;
  };
  desafioAtual?: {
    desafianteId: string;
    desafiadoId: string;
    motivo: "acao" | "bloqueio";
    resolvido: boolean;
  };
}
