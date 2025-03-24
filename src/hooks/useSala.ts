import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useSala(salaId: string) {
  const [sala, setSala] = useState<Sala | null>(null);

  useEffect(() => {
    const salaRef = doc(db, "salas", salaId);
    // Escuta mudanças no Firestore em tempo real
    const unsubscribe = onSnapshot(salaRef, (snapshot) => {
      if (snapshot.exists()) {
        setSala({ ...snapshot.data() } as Sala);
      } else {
        setSala(null);
      }
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar
  }, [salaId]);

  return sala;
}
