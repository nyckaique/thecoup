import { User } from "firebase/auth";
import { db } from "../services/firebase"; // Ajuste o caminho para o seu arquivo de configuração do Firebase
import { doc, getDoc } from "firebase/firestore"; // Importe as funções do Firestore
import { Jogador } from "../types/jogador";

export function useTemPermissao() {
  const temPermissao = async (user: User, id: string) => {
    try {
      // Verifica se o usuário está na sala com o id fornecido
      const salaDocRef = doc(db, "salas", id); // Referência ao documento da sala
      const salaDoc = await getDoc(salaDocRef);

      if (salaDoc.exists()) {
        const jogadores = salaDoc.data().jogadores; // Lista de jogadores da sala
        const usuarioEstaNaSala: boolean = jogadores.some(
          (jogador: Jogador) => jogador.uid === user.uid
        );
        console.log(usuarioEstaNaSala);
        return usuarioEstaNaSala; // Retorna true se o usuário estiver na lista
      }

      // Se não encontrar a sala, verifica se é um jogo
      const jogoDocRef = doc(db, "jogos", id); // Referência ao documento do jogo
      const jogoDoc = await getDoc(jogoDocRef);

      if (jogoDoc.exists()) {
        const jogadores = jogoDoc.data().jogadores; // Lista de jogadores do jogo
        const usuarioEstaNoJogo: boolean = jogadores.some(
          (jogador: Jogador) => jogador.uid === user.uid
        );
        console.log(usuarioEstaNoJogo);
        return usuarioEstaNoJogo; // Retorna true se o usuário estiver na lista
      }

      // Se não encontrar nem sala nem jogo, retorna false
      return false;
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return false; // Retorna false em caso de erro
    }
  };

  return temPermissao;
}
