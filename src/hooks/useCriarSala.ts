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
  const timestamp = Date.now().toString(36); // Usa o timestamp atual em base 36
  const random = Math.random().toString(36).substring(2, 5); // Gera uma parte aleatória de 3 caracteres
  return (timestamp + random).toUpperCase().substring(0, 5); // Combina ambos e pega os primeiros 5 caracteres
}

export function useCriarSala() {
  const criarSala = async (user: User, privada: boolean): Promise<Sala> => {
    const codigo = privada ? criarCodigo() : null; // Se privada, gera um código

    const salaNova: Sala = {
      id: "a",
      codigo: codigo,
      jogadores: [],
      privada,
      criador: user.uid,
      status: "aguardando",
      createdAt: serverTimestamp(),
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
