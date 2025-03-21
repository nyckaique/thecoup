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
    if (await jaEstaEmAlgumaSala(user)) {
      return;
    }

    let sala: Sala | null = await encontrarSala(privada, codigo);
    if (!sala && !privada) {
      sala = await criarSala(user, privada); // Se não encontrar, cria uma nova sala pública
      // Adiciona o jogador na sala
      const salaRef = doc(db, "salas", sala.id as string);
      await updateDoc(salaRef, {
        jogadores: arrayUnion({ uid: user.uid, nome }),
      });

      navigate(`/sala/${sala.id}`);
      return;
    } else if (!sala && privada) {
      navigate(`/`);
      return;
    }
  };

  return acessarSala;
}
