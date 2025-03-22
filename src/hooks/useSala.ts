import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useSala() {
  const { id } = useParams(); // Pega o ID da sala da URL
  const [sala, setSala] = useState<Sala | null>(null);

  useEffect(() => {
    if (!id) return;

    const salaRef = doc(db, "salas", id);

    // Escuta mudanças no Firestore em tempo real
    const unsubscribe = onSnapshot(salaRef, (snapshot) => {
      if (snapshot.exists()) {
        setSala({ id: snapshot.id, ...snapshot.data() } as Sala);
      } else {
        setSala(null);
      }
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar
  }, [id]);

  return sala;
}
