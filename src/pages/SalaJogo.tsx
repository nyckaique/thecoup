import { useParams } from "react-router-dom";
import { useJogo } from "../hooks/useJogo"; // Você precisará criar esse hook

export default function JogoScreen() {
  const { id } = useParams();
  const jogo = useJogo(id!); // Hook para buscar os dados do jogo

  if (!jogo) {
    return <p>Carregando jogo...</p>;
  }

  return (
    <div>
      <h1>Jogo em andamento</h1>
      {/* Sua lógica de jogo aqui */}
    </div>
  );
}
