import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogador } from "../types/jogador";

export function useJogadoresSala(salaId: string) {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  useEffect(() => {
    if (!salaId) return;

    const salaRef = doc(db, "salas", salaId);
    const unsubscribe = onSnapshot(salaRef, (doc) => {
      if (doc.exists()) {
        setJogadores(doc.data().jogadores || []);
      }
    });

    return () => unsubscribe();
  }, [salaId]);

  return jogadores;
}