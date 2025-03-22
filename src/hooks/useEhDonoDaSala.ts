import { User } from "firebase/auth";
import { Sala } from "../types/sala";

export function useEhDonoDaSala(sala: Sala | null, user: User | null) {
  if (!sala || !user) return false;
  return sala.criador === user.uid;
}
