import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";
import { User } from "firebase/auth";

// Função para gerar um código para salas privadas
function criarCodigo(): string {
  return Math.random().toString(36).toUpperCase().substring(2, 7); // Combina ambos e pega os primeiros 5 caracteres
}

export function useCriarSala() {
  const criarSala = async (user: User, privada: boolean): Promise<Sala> => {
    const codigo = privada ? criarCodigo() : null; // Se privada, gera um código

    const salaNova: Sala = {
      codigo: codigo,
      createdAt: serverTimestamp(),
      criador: user.uid,
      id: "a",
      //inicioPartida: null,
      jogadores: [],
      privada,
      status: "aguardando",
      jogoId: "a",
    };

    const docRef = await addDoc(collection(db, "salas"), salaNova);
    // Agora, atualizamos o documento para incluir o 'id' do Firestore
    await updateDoc(docRef, {
      id: docRef.id, // Adiciona o 'id' gerado pelo Firestore
    });
    return { ...salaNova, id: docRef.id }; // Retorna a sala com o ID gerado
  };
  return criarSala;
}
