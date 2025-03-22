import { ReactNode, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTemPermissao } from "../hooks/useTemPermissao"; // ou o caminho correto
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { id } = useParams(); // Obtém o id da sala ou jogo da URL
  const { user } = useAuth(); // Obtém o usuário atual
  const temPermissao = useTemPermissao(); // Hook para verificar se o usuário está na sala ou jogo
  const [permissaoVerificada, setPermissaoVerificada] = useState<
    boolean | null
  >(null); // Estado para controlar a verificação

  useEffect(() => {
    const verificarPermissao = async () => {
      if (!user || !id) {
        console.log("Usuário ou ID não encontrado");
        return;
      }
      try {
        const permissao = await temPermissao(user!, id!); // Verifica a permissão
        console.log("Permissão verificada:", permissao);
        setPermissaoVerificada(permissao); // Atualiza o estado
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        setPermissaoVerificada(false); // Define como false em caso de erro
      }
    };

    verificarPermissao();
    console.log(permissaoVerificada);
  });

  // Exibe um loading enquanto a verificação está em andamento
  if (permissaoVerificada === null) {
    return <div>Carregando...</div>; // Ou um componente de loading
  }

  // Redireciona para a página inicial se o usuário não tiver permissão
  if (!permissaoVerificada) {
    return <Navigate to="/" replace />;
  }

  // Renderiza os children apenas se o usuário tiver permissão
  return children;
}

export default ProtectedRoute;
