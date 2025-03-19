import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useJogadoresSala } from "../hooks/useJogadoresSala";
import { useMarcarReady } from "../hooks/useMarcarReady";

function SalaEspera() {
  const { id: salaId } = useParams();
  const { user } = useAuth();
  const jogadores = useJogadoresSala(salaId!); // Hook personalizado
  const marcarReady = useMarcarReady(); // Hook personalizado

  const handleReady = async () => {
    if (!user || !salaId) return;
    await marcarReady(salaId, user.uid);
  };

  return (
    <div>
      <h1>Sala de Espera</h1>
      <h2>Jogadores:</h2>
      <ul>
        {jogadores.map((jogador) => (
          <li key={jogador.uid}>
            {jogador.nome} - {jogador.ready ? "✅ Pronto" : "❌ Não pronto"}
          </li>
        ))}
      </ul>
      <button onClick={handleReady}>Pronto</button>
    </div>
  );
}

export default SalaEspera;