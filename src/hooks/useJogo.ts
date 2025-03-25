import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Jogo } from "../types/jogo"; // Você precisará definir esse tipo

export function useJogo(jogoId: string) {
  const [jogo, setJogo] = useState<Jogo | null>(null);

  useEffect(() => {
    if(!jogoId){
      return;
    }
    const jogoRef = doc(db, "jogos", jogoId);
    const unsubscribe = onSnapshot(jogoRef, (snapshot) => {
      if (snapshot.exists()) {
        setJogo({ ...snapshot.data() } as Jogo);
      } else {
        setJogo(null);
      }
    });

    return () => unsubscribe();
  }, [jogoId]);

  const atualizarJogo = async (novoEstado: Partial<Jogo>) => {
    if (!jogo) return;
    
    await updateDoc(doc(db, "jogos", jogo.id), novoEstado);
  };

  return {jogo, atualizarJogo};
}
