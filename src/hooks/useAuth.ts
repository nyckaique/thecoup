import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { auth } from "../services/firebase";
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        await signInAnonymously(auth);
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup ao desmontar
  }, []);

  return { user, loading };
}
