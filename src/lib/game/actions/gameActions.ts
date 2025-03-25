import { Acao } from "../../../types/acao";
import { Jogo } from "../../../types/jogo";

export const executarAcao = async (jogo: Jogo, acao: Acao, alvoId?: string) => {
  const novoEstado: Partial<Jogo> = { 
    historico: [...jogo.historico, `${jogo.jogadorAtualId} executou ${acao}`]
  };

  switch(acao) {
    case 'Renda':
      novoEstado.jogadores = jogo.jogadores.map(j => 
        j.uid === jogo.jogadorAtualId ? { ...j, dinheiro: j.dinheiro + 1 } : j
      );
      break;

    case 'Ajuda externa':
      novoEstado.jogadores = jogo.jogadores.map(j => 
        j.uid === jogo.jogadorAtualId ? { ...j, dinheiro: j.dinheiro + 2 } : j
      );
      break;

    // Implementar outras ações
  }

  return novoEstado;
};