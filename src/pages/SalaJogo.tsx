import { useNavigate, useParams } from "react-router-dom";
import { useJogo } from "../hooks/useJogo"; // Você precisará criar esse hook
import { useAuth } from "../hooks/useAuth";
import { useSala } from "../hooks/useSala";
import { useEhDonoDaSala } from "../hooks/useEhDonoDaSala";
import { useSairJogo } from "../hooks/useSairJogo";
import { Acao } from "../types/acao";
import { Influencia } from "../types/influencia";
import { JogadorInGame } from "../types/jogadorInGame";
import { Jogo } from "../types/jogo";
import { executarAcao, finalizarTurno } from "../lib/game/actions/gameActions";
import { useEffect, useState } from "react";

export default function JogoScreen() {
  const { id } = useParams();
  const { user } = useAuth();
  const { jogo, atualizarJogo } = useJogo(id!); // Hook para buscar os dados do jogo
  const sala = useSala(jogo?.salaId || null);
  const ehDono = useEhDonoDaSala(sala, user);
  const sairJogo = useSairJogo();
  const navigate = useNavigate();
  const [podeAgir, setPodeAgir] = useState(false);

  useEffect(() => {
    setPodeAgir(jogo?.jogadorAtualId === user?.uid);
  }, [jogo, user?.uid]);
  // const podeAgir = jogo?.jogadorAtualId === user?.uid;

  const handleAcao = async (
    acao: Acao,
    jogadorDoTurno: string,
    influencia?: Influencia,
    alvoId?: string
  ) => {
    try {
      if (!jogo || !podeAgir) return;

      const jDT = jogo.jogadores.find(
        (jogador) => jogador.uid === jogadorDoTurno
      );
      // Executa a ação e obtém as mudanças
      const mudancas = executarAcao(jogo, acao, jDT!, alvoId, influencia);

      // Combina os estados diretamente
      const novoEstado: Jogo = {
        ...jogo,
        ...mudancas,
        // Garante que arrays sejam atualizados corretamente
        jogadores: mudancas.jogadores || jogo.jogadores,
        historico: mudancas.historico || jogo.historico,
      };

      await atualizarJogo(novoEstado);

      // Finaliza turno automaticamente se necessário
      if (mudancas.fase === "finalizandoTurno") {
        const mudancasTurno = finalizarTurno(novoEstado);
        await atualizarJogo({ ...novoEstado, ...mudancasTurno });
      }
    } catch (error) {
      console.error("Erro na ação:", error);
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  const handleSairJogo = async () => {
    if (!jogo || !user) return;

    try {
      await sairJogo(jogo, user, ehDono); // Redireciona para a página inicial após sair
      navigate("/");
    } catch (error) {
      alert("Erro ao sair do jogo");
      console.error(error);
    }
  };

  // LER REGRAS
  const handleLerRegras = () => {
    alert(`Estou lendo as regras`);
  };

  if (!jogo) {
    return <p>Carregando jogo...</p>;
  }

  return (
    <div>
      <h1>Jogo em andamento</h1>
      {/* Ações */}
      <div>
        <button
          onClick={() => handleAcao("Golpe de Estado", user!.uid)}
          disabled={!podeAgir}
        >
          Golpe de Estado (Custo $7)
        </button>
        <button
          onClick={() => handleAcao("Renda", user!.uid)}
          disabled={!podeAgir}
        >
          Renda (+ $1)
        </button>
        <button
          onClick={() => handleAcao("Ajuda externa", user!.uid)}
          disabled={!podeAgir}
        >
          Ajuda Externa (+ $2)
        </button>
      </div>

      {/* Tabuleiro -> Jogadores + Baralho */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Tabuleiro jogo={jogo} />
      </div>

      {/* Histórico */}
      <div className="historico">
        <h3>Histórico</h3>
        {jogo.historico.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>

      <button onClick={() => handleLerRegras()}>Ler Regras</button>
      <br />
      <button onClick={() => handleSairJogo()}>Sair do jogo</button>
    </div>
  );
}

const Tabuleiro = ({ jogo }: { jogo: Jogo }) => (
  <div
    className="tabuleiro"
    style={{
      position: "relative",
      width: "600px",
      height: "600px",
      border: "2px solid black",
      borderRadius: "50%",
    }}
  >
    <div
      className="jogadores"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        left: "-50%",
      }}
    >
      {jogo.jogadores.map((jogador, index) => (
        <JogadorInfo
          key={jogador.uid}
          jogador={jogador}
          eAtual={jogador.uid === jogo.jogadorAtualId}
          qtdJogadores={jogo.jogadores.length}
          index={index}
        />
      ))}
    </div>
    <div
      className="baralho"
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid red",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
      }}
    >
      {/* jogo.baralho */}
      <p>baralho</p>
    </div>
  </div>
);

const JogadorInfo = ({
  jogador,
  eAtual,
  qtdJogadores,
  index,
}: {
  jogador: JogadorInGame;
  eAtual: boolean;
  qtdJogadores: number;
  index: number;
}) => (
  <div
    className={`jogador ${eAtual ? "ativo" : ""}`}
    style={{
      position: "absolute",
      width: "100px",
      height: "100px",
      border: "2px solid blue",
      transform: `rotate(calc((360deg / ${qtdJogadores}) * ${index}))`,
      transformOrigin: "340px",
    }}
  >
    <div
      style={{
        position: "absolute",
        transform: `rotate(calc((-360deg / ${qtdJogadores}) * ${index}))`,
      }}
    >
      <h4>
        {jogador.nome} {eAtual && "(Seu turno)"}
      </h4>
      <p>${jogador.dinheiro}</p>
      <div className="influencias">
        {jogador.influencias.map((inf, i) => (
          <CartaComponente key={i} influence={inf} />
        ))}
      </div>
    </div>
  </div>
);

const CartaComponente = ({ influence }: { influence: Influencia }) => (
  <div className={`carta ${influence.revelada ? "revelada" : ""}`}>
    {influence.revelada ? influence.carta.nome : "Carta Ocultada"}
  </div>
);
