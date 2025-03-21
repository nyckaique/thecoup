import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useEncontrarSala() {
  const encontrarSala = async (
    privada: boolean,
    codigo: string | null = null
  ): Promise<Sala | null> => {
    const salasRef = collection(db, "salas");

    let q;
    if (codigo) {
      // Se foi passado um código, buscamos pela sala privada que não esteja encerrada
      codigo = codigo.toUpperCase();
      q = query(
        salasRef,
        where("codigo", "==", codigo),
        where("privada", "==", privada),
        where("status", "!=", "encerrada")
      );
    } else {
      // Busca por qualquer sala pública que não esteja encerrada
      q = query(
        salasRef,
        where("privada", "==", privada),
        where("status", "!=", "encerrada")
      );
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // Percorre todas as salas e encontra a primeira com vagas
      for (const doc of snapshot.docs) {
        const salaEncontrada = doc.data() as Sala;

        // Verifica se a sala tem vagas
        if (salaEncontrada.jogadores.length < 8) {
          // Sala com vaga disponível, retorna ela
          return { ...salaEncontrada };
        }
      }
      if (privada) {
        alert("A sala não possui vagas disponíveis. Vamos retornar à home.");
      }
      // Se nenhuma sala tiver vaga, retorna null
      return null;
    }
    if (privada) {
      alert("Não encontramos esta sala. Vamos retornar à home.");
    }
    return null; // Nenhuma sala encontrada
  };

  return encontrarSala;
}
