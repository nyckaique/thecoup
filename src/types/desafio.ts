import { Acao } from "./acao";

export type Desafio = {
  desafianteId: string;
  desafiadoId: string;
  acaoDesafiada: Acao;
  resolvido: boolean;
};