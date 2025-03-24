import { useNavigate, useParams } from "react-router-dom";
import { useJogo } from "../hooks/useJogo"; // Você precisará criar esse hook
import { useAuth } from "../hooks/useAuth";
import { useSala } from "../hooks/useSala";
import { useEhDonoDaSala } from "../hooks/useEhDonoDaSala";
import { useSairJogo } from "../hooks/useSairJogo";

export default function JogoScreen() {
  const { id } = useParams();
  const { user } = useAuth();
  const jogo = useJogo(id!); // Hook para buscar os dados do jogo
  const sala = useSala(jogo?.salaId || null);
  const ehDono = useEhDonoDaSala(sala, user);
  const sairJogo = useSairJogo();
  const navigate = useNavigate();

  const handleSairJogo = async () => {
    if (!jogo || !user) return;

    try {
      await sairJogo(jogo, user, ehDono); // Redireciona para a página inicial após sair
      navigate("/");
    } catch (error) {
      alert("Erro ao sair do jogo");
      console.error(error);
    }
  };

  // LER REGRAS
  const handleLerRegras = () => {
    alert(`Estou lendo as regras`);
  };

  if (!jogo) {
    return <p>Carregando jogo...</p>;
  }

  return (
    <div>
      <h1>Jogo em andamento</h1>
      {/* Sua lógica de jogo aqui */}
      <ul>
        {jogo.jogadores.map((jogador) => {
          return (
            <li key={jogador.uid}>
              <p>{jogador.nome}</p>
            </li>
          );
        })}
      </ul>
      <button onClick={() => handleLerRegras()}>Ler Regras</button>
      <br />
      <button onClick={() => handleSairJogo()}>Sair do jogo</button>
    </div>
  );
}
