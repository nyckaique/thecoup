import { useState } from "react";
import { useEntrarSala } from "../hooks/useEntrarSala";

function Home() {
  const [nomeJogador, setNomeJogador] = useState("");
  const entrarSala = useEntrarSala();

  const handleEntrar = async () => {
    try {
      await entrarSala(nomeJogador);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ocorreu um erro ao entrar no jogo.");
    }
  };

  return (
    <div>
      <h1>The Coup</h1>
      <input
        type="text"
        placeholder="Seu nome"
        value={nomeJogador}
        onChange={(e) => setNomeJogador(e.target.value)}
        maxLength={20}
      />
      <button onClick={handleEntrar}>Entrar</button>
    </div>
  );
}

export default Home;