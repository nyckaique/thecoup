import { Jogo} from "../../../types/jogo";
import { Carta } from "../../../types/carta";
import { NomeCarta } from "../../../types/nomeCarta";
import { JogadorInGame } from "../../../types/jogadorInGame";

export const criarBaralho = (numJogadores: number): Carta[] => {
  const quantidades: Record<number, Record<NomeCarta, number>> = {
    3: { 'Assassino': 3, 'Capitão': 3, 'Condessa': 3, 'Duque': 3, 'Inquisidor': 3 },
    6: { 'Assassino': 4, 'Capitão': 4, 'Condessa': 4, 'Duque': 4, 'Inquisidor': 4 },
    10: { 'Assassino': 5, 'Capitão': 5, 'Condessa': 5, 'Duque': 5, 'Inquisidor': 5 }
  };

  const qtd = numJogadores <= 6 ? 3 : numJogadores <= 8 ? 4 : 5;
  const baralho: Carta[] = [];
  
  const adicionarCartas = (nome: NomeCarta, quantidade: number) => {
    for (let i = 0; i < quantidade; i++) {
      baralho.push({
        nome,
        id: `${nome}-${Math.random().toString(36).substr(2, 9)}`
      });
    }
  };

  Object.entries(quantidades[qtd]).forEach(([nome, qtd]) => {
    adicionarCartas(nome as NomeCarta, qtd);
  });

  return embaralhar(baralho);
};

const embaralhar = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export const inicializarJogo = (salaId: string, jogadores: JogadorInGame[]): Omit<Jogo, 'id'> => {
  const baralho = criarBaralho(jogadores.length);
  
  const jogadoresComInfluencias: JogadorInGame[] = jogadores.map(jogador => ({
    ...jogador,
    dinheiro: 2,
    influencias: [
      { carta: baralho.pop()!, revelada: false },
      { carta: baralho.pop()!, revelada: false }
    ],
    estaVivo: true
  }));

  return {
    salaId,
    jogadores: jogadoresComInfluencias,
    jogadorAtualId: jogadores[0].uid,
    fase: 'escolhendoAcao',
    baralho,
    descarte: [],
    historico: [],
    status: "iniciado"
  };
};