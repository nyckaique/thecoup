import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Sala } from "../types/sala";

export function useVerificarInicioJogo(sala: Sala | null) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sala?.id) return;

    const salaRef = doc(db, "salas", sala.id);
    const unsubscribe = onSnapshot(salaRef, (doc) => {
      const data = doc.data();
      if (data?.status === "em jogo" && data?.jogoId) {
        navigate(`/jogo/${data.jogoId}`);
      }
    });

    return () => unsubscribe();
  }, [sala?.id, navigate]);
}
