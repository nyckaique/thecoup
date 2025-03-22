import { useEhDonoDaSala } from "../hooks/useEhDonoDaSala";
import { useSala } from "../hooks/useSala";
import { useAuth } from "../hooks/useAuth";
import { useRemoverJogador } from "../hooks/useRemoverJogador";
import { useToggleEstouPronto } from "../hooks/useToggleEstouPronto";
import { useIniciarPartida } from "../hooks/useIniciarPartida";
import { useSairSala } from "../hooks/useSairSala";

import { User } from "firebase/auth";
import { Sala } from "../types/sala";

export default function SalaEspera() {
  const sala = useSala();
  const { user } = useAuth();
  const ehDono = useEhDonoDaSala(sala, user);
  const removerJogador = useRemoverJogador(sala);
  const toggleEstouPronto = useToggleEstouPronto(sala);
  const iniciarPartida = useIniciarPartida();
  const sairSala = useSairSala();

  const handleRemoverJogador = (uid: string) => {
    removerJogador(uid);
  };

  const handleToggleEstouPronto = (user: User) => {
    toggleEstouPronto(user);
  };

  const handleIniciarPartida = (sala: Sala) => {
    iniciarPartida(sala);
  };

  const handleSairSala = (user: User, ehDono: boolean) => {
    sairSala(user, ehDono);
  };

  if (!sala) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      {/* Titulo da sala */}
      <h1>Sala de Espera</h1>
      {/* Quantidade de jogadores */}
      <h5>{sala.jogadores.length} / 8 Jogadores</h5>
      {/* Código */}
      {sala.codigo && <h6>{sala.codigo}</h6>}
      {/* Cronometro */}
      <p>Começando em 10 segundos!</p>
      {/* Lista dos jogadores */}
      <ul>
        {sala.jogadores.map((jogador) => (
          <li key={jogador.uid}>
            <p>
              {ehDono && <span>Líder</span>}
              {jogador.nome}
              <span>{jogador.ready ? "Pronto" : "Aguardando"}</span>
              {ehDono && (
                <button onClick={() => handleRemoverJogador(jogador.uid)}>
                  Remover jogador
                </button>
              )}
            </p>
          </li>
        ))}
      </ul>
      {/* Botões */}
      <button onClick={() => handleToggleEstouPronto(user!)}>
        Estou pronto
      </button>
      {ehDono && (
        <button onClick={() => handleIniciarPartida(sala)}>
          Começar o jogo
        </button>
      )}
      <button onClick={() => handleSairSala(user!, ehDono)}>
        Sair da sala
      </button>
    </>
  );
}
