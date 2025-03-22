import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useRemoverJogador(sala: Sala | null) {
  const navigate = useNavigate();

  const removerJogador = async (uid: string) => {
    if (!sala) return;

    const novaLista = sala.jogadores.filter((jogador) => jogador.uid !== uid);
    const salaRef = doc(db, "salas", sala.id);

    await updateDoc(salaRef, { jogadores: novaLista });

    // Se o jogador removido for o usuário logado, redireciona para a home
    if (uid === localStorage.getItem("uid")) {
      navigate("/");
      alert("Você foi removido da sala.");
    }
  };

  return removerJogador;
}
