import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useMonitorarContagem(salaId: string) {
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);
  const [contagemAtiva, setContagemAtiva] = useState(false);

  useEffect(() => {
    const salaRef = doc(db, "salas", salaId);

    const unsubscribe = onSnapshot(salaRef, (snapshot) => {
      const sala = snapshot.data() as Sala;
      if (!sala || !sala.inicioPartida) {
        setContagemAtiva(false);
        setTempoRestante(null);
        return;
      }

      const inicio = sala.inicioPartida.seconds * 1000;
      const agora = Date.now();
      const restante = Math.max(10 - Math.floor((agora - inicio) / 1000), 0);

      if (restante === 0) {
        setContagemAtiva(false);
      } else {
        setContagemAtiva(true);
      }

      setTempoRestante(restante);
    });

    return () => unsubscribe();
  }, [salaId]);

  return { tempoRestante, contagemAtiva };
}
