import { User } from "firebase/auth";

export function useSairSala() {
  const sairSala = (user: User, ehDono: boolean) => {
    if (ehDono) {
      // logica sair da sala se for o dono
    } else {
      // logica sair da sala se não for o dono
    }
    return user.uid;
  };
  return sairSala;
}
