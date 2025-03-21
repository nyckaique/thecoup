import { useState } from "react";
import { useCriarSala } from "../hooks/useCriarSala";
import { useAcessarSala } from "../hooks/useAcessarSala";
import { useValidarNome } from "../hooks/useValidarNome";
import { useValidarCodigo } from "../hooks/useValidarCodigo";
import { useAuth } from "../hooks/useAuth";
import { useJaEstaEmAlgumaSala } from "../hooks/useJaEstaEmAlgumaSala";

export default function Home() {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");

  const criarSala = useCriarSala();
  const acessarSala = useAcessarSala();
  const validarNome = useValidarNome();
  const validarCodigo = useValidarCodigo();
  const jaEstaEmAlgumaSala = useJaEstaEmAlgumaSala();
  const { user, loading } = useAuth();

  // ACESSAR SALA PUBLICA
  const handleAcessarSalaPublica = async () => {
    if (!nome) {
      alert("Digite seu nome de jogador!");
      return;
    }
    if (!validarNome(nome)) {
      alert("Digite um nome válido! Entre 3 e 20 caracteres.");
      return;
    }
    if (!user) {
      alert("Você não está autenticado, por favor, recarregue a página!");
      return;
    }
    await acessarSala(nome, user, false);
  };

  // ACESSAR SALA PRIVADA
  const handleAcessarSalaPrivada = async () => {
    if (!nome) {
      alert("Digite seu nome de jogador!");
      return;
    }
    if (!validarNome(nome)) {
      alert("Digite um nome válido! Entre 3 e 20 caracteres.");
      return;
    }
    if (!codigo) {
      alert("Digite o código da sala!");
      return;
    }
    if (!validarCodigo(codigo)) {
      alert("Digite um código válido! São 5 caracteres.");
      return;
    }
    if (!user) {
      alert("Você não está autenticado, por favor, recarregue a página!");
      return;
    }
    await acessarSala(nome, user, true, codigo);
  };

  // CRIAR SALA PRIVADA
  const handleCriarSalaPrivada = async () => {
    if (!nome) {
      alert("Digite seu nome de jogador!");
      return;
    }
    if (!validarNome(nome)) {
      alert("Digite um nome válido! Entre 3 e 20 caracteres.");
      return;
    }
    if (!user) {
      alert("Você não está autenticado, por favor, recarregue a página!");
      return;
    }
    if (await jaEstaEmAlgumaSala(user)) {
      return;
    }
    const sala = await criarSala(user, true);
    await acessarSala(nome, user, true, sala.codigo);
  };

  // LER REGRAS
  const handleLerRegras = () => {
    alert(`Estou lendo as regras`);
  };

  // AGUARDANDO AUTENTICACAO
  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>The Coup</h1>
      <br />
      <label htmlFor="nome">Nome: </label>
      <input
        type="text"
        name="nome"
        id="nome"
        placeholder="Seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        maxLength={20}
      />
      <br />
      <button onClick={handleAcessarSalaPublica}>Acessar jogo publico</button>
      <br />
      <button onClick={handleCriarSalaPrivada}>Criar jogo privado</button>
      <br />
      <br />
      <label htmlFor="codigo">Codigo: </label>
      <input
        type="text"
        name="codigo"
        id="codigo"
        placeholder="Código de 5 digitos"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        maxLength={5}
      />
      <br />
      <button onClick={handleAcessarSalaPrivada}>Acessar jogo privado</button>
      <br />
      <br />
      <button onClick={handleLerRegras}>Ler Regras</button>
    </div>
  );
}
