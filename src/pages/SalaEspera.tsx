import { useEhDonoDaSala } from "../hooks/useEhDonoDaSala";
import { useSala } from "../hooks/useSala";
import { useAuth } from "../hooks/useAuth";
import { useRemoverJogadorSala } from "../hooks/useRemoverJogadorSala";
import { useToggleEstouPronto } from "../hooks/useToggleEstouPronto";
import { useIniciarPartida } from "../hooks/useIniciarPartida";
import { useSairSala } from "../hooks/useSairSala";
import { User } from "firebase/auth";
import { Sala } from "../types/sala";
import { useVerificarRemocao } from "../hooks/useVerificarRemocao";
import { useNavigate, useParams } from "react-router-dom";
import { useVerificarInicioJogo } from "../hooks/useVerificarInicioJogo";

export default function SalaEspera() {
  const { id } = useParams();
  const sala = useSala(id!);
  const { user } = useAuth();
  const ehDono = useEhDonoDaSala(sala, user);
  const removerJogadorSala = useRemoverJogadorSala();
  const toggleEstouPronto = useToggleEstouPronto(sala);
  const iniciarPartida = useIniciarPartida();
  const sairSala = useSairSala(sala!);
  const navigate = useNavigate();

  // Fica verificando o início do jogo
  useVerificarInicioJogo(sala);

  // Fica verificando se foi removido da sala
  useVerificarRemocao();

  const handleRemoverJogadorSala = (uid: string) => {
    removerJogadorSala(sala!.id, uid);
  };

  const handleToggleEstouPronto = (user: User) => {
    toggleEstouPronto(user);
  };

  const handleIniciarPartida = async (sala: Sala) => {
    const jogoId = await iniciarPartida(sala);
    if (jogoId) {
      navigate(`/jogo/${jogoId}`);
    }
  };

  const handleSairSala = (user: User, ehDono: boolean) => {
    sairSala(user, ehDono);
  };

  // LER REGRAS
  const handleLerRegras = () => {
    alert(`Estou lendo as regras`);
  };

  if (!sala) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      {/* Titulo da sala */}
      <h1>Sala de Espera</h1>
      {/* Quantidade de jogadores */}
      <h5>{sala.jogadores.length} / 10 Jogadores</h5>
      {/* Código */}
      {sala.codigo && (
        <h6>
          Código: <b>{sala.codigo}</b>
        </h6>
      )}
      {/* Verifica se todos estão prontos */}
      {sala.jogadores.every((jogador) => jogador.ready) ? (
        <p>Prontos para começar!</p>
      ) : (
        <p>Aguardando Jogadores</p>
      )}
      {/* Lista dos jogadores */}
      <ul>
        {sala.jogadores.map((jogador) => {
          const jogadorEhDono = jogador.uid === sala.criador;
          return (
            <li key={jogador.uid}>
              <p>
                {jogadorEhDono && <span>Líder</span>} {jogador.nome}{" "}
                <span>{jogador.ready ? "Pronto" : "Aguardando"}</span>{" "}
                {ehDono && jogador.uid !== user!.uid && (
                  <button onClick={() => handleRemoverJogadorSala(jogador.uid)}>
                    Remover jogador
                  </button>
                )}
              </p>
            </li>
          );
        })}
      </ul>
      {/* Botões */}
      <button onClick={() => handleToggleEstouPronto(user!)}>
        Estou pronto
      </button>
      <br />
      {ehDono && (
        <>
          <button onClick={() => handleIniciarPartida(sala)}>
            Começar o jogo
          </button>
          <br />
        </>
      )}
      <button onClick={() => handleLerRegras()}>Ler Regras</button>
      <br />
      <button onClick={() => handleSairSala(user!, ehDono)}>
        Sair da sala
      </button>
    </>
  );
}
