import { FieldValue, Timestamp } from "firebase/firestore";
import { Jogador } from "./jogador";

export interface Sala {
  id: string;
  codigo: string | null;
  jogadores: Jogador[];
  privada: boolean;
  criador: string; //uid de quem criou a sala
  status: "aguardando" | "em jogo" | "encerrada";
  createdAt: Timestamp | FieldValue; // Adicionar campo de criação
  jogoId: string;
}
