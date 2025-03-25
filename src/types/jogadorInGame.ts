import { Influencia } from "./influencia";

export type JogadorInGame = {
  uid: string;
  nome: string;
  dinheiro: number;
  influencias: Influencia[];
  estaVivo: boolean;
};