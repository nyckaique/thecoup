import { useNavigate } from "react-router-dom";
import { useAutenticacaoAnonima } from "./useAutenticacaoAnonima";
import { useCriarSala } from "./useCriarSala";
import { Jogador } from "../types/jogador";

export function useEntrarSala() {
  const navigate = useNavigate();
  const autenticar = useAutenticacaoAnonima();
  const criarSala = useCriarSala();

  const entrarSala = async (nomeJogador: string) => {
    if (!nomeJogador.trim()) {
      throw new Error("Por favor, insira seu nome.");
    }

    try {
      // Autenticação
      const user = await autenticar();

      // Cria jogador
      const novoJogador: Jogador = {
        uid: user.uid,
        nome: nomeJogador,
        ready: false,
      };

      // Cria sala e redireciona
      const salaId = await criarSala(novoJogador);
      navigate(`/sala/${salaId}`);
    } catch (error) {
      console.error("Erro no processo de entrada:", error);
      throw error;
    }
  };

  return entrarSala;
}