import { auth } from "../services/firebase";
import { signInAnonymously } from "firebase/auth";

export function useAutenticacaoAnonima() {
  const autenticar = async () => {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  };

  return autenticar;
}