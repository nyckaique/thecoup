export function useValidarNome() {
  const validarNome = (nome: string): boolean => {
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    return regex.test(nome);
  };
  return validarNome;
}
