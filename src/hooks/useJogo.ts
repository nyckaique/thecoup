import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogo } from "../types/jogo"; // Você precisará definir esse tipo

export function useJogo(jogoId: string) {
  const [jogo, setJogo] = useState<Jogo | null>(null);

  useEffect(() => {
    const jogoRef = doc(db, "jogos", jogoId);
    const unsubscribe = onSnapshot(jogoRef, (doc) => {
      if (doc.exists()) {
        setJogo({ id: doc.id, ...doc.data() } as Jogo);
      } else {
        setJogo(null);
      }
    });

    return () => unsubscribe();
  }, [jogoId]);

  return jogo;
}
