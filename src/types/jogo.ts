import { Jogador } from "./jogador";

export interface Jogo {
  id: string;
  salaId: string;
  jogadores: Jogador[];
  status: "iniciado" | "encerrado";
}
