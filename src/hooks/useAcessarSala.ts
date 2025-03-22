import { User } from "firebase/auth";
import { Sala } from "../types/sala";
import { useEncontrarSala } from "./useEncontrarSala";
import { useCriarSala } from "./useCriarSala";
import { useJaEstaEmAlgumaSala } from "./useJaEstaEmAlgumaSala";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export function useAcessarSala() {
  const encontrarSala = useEncontrarSala();
  const criarSala = useCriarSala();
  const jaEstaEmAlgumaSala = useJaEstaEmAlgumaSala();
  const navigate = useNavigate();

  const acessarSala = async (
    nome: string,
    user: User,
    privada: boolean,
    codigo: string | null = null
  ) => {
    // Se já está em alguma sala
    if (await jaEstaEmAlgumaSala(user)) {
      return;
    }
    // Se estiver procurando sala privada (é privada e tem o código)
    if (privada && codigo) {
      const sala: Sala | null = await encontrarSala(privada, codigo);
      if (!sala) {
        // Não encontrou a sala privada ou não acertou o código -> volta para home
        navigate(`/`);
        return;
      }
      // Temos a sala privada, vamos entrar nela
      // Adiciona o jogador na sala
      const salaRef = doc(db, "salas", sala.id as string);
      await updateDoc(salaRef, {
        jogadores: arrayUnion({ uid: user.uid, nome, ready: false }),
      });
      // navega para a sala privada
      navigate(`/sala/${sala.id}`);
      return;
    } else if (privada && !codigo) {
      // Está criando sala privada (é privada e não tem código)
      let sala: Sala | null = null;
      sala = await criarSala(user, privada);
      // Adiciona o jogador na sala
      const salaRef = doc(db, "salas", sala.id as string);
      await updateDoc(salaRef, {
        jogadores: arrayUnion({ uid: user.uid, nome, ready: false }),
      });
      // navega para a sala privada
      navigate(`/sala/${sala.id}`);
      return;
    } else {
      // Se for sala pública tenta encontrar uma existente
      let sala: Sala | null = await encontrarSala(privada);
      // Se não achou uma sala publica existente, vamos criar
      if (!sala && !privada) {
        // Cria uma nova sala pública
        sala = await criarSala(user, privada);
      }
      // Aqui ou temos uma sala achada ou criamos uma, então iremos nos alocar nela e navegar ate ela
      // Adiciona o jogador na sala
      const salaRef = doc(db, "salas", sala!.id as string);
      await updateDoc(salaRef, {
        jogadores: arrayUnion({ uid: user.uid, nome, ready: false }),
      });
      // navega para a sala pública
      navigate(`/sala/${sala!.id}`);
      return;
    }
  };

  return acessarSala;
}
