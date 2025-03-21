export function useValidarCodigo() {
  const validarCodigo = (codigo: string): boolean => {
    const regex = /^[a-zA-Z0-9]{5}$/;
    return regex.test(codigo);
  };
  return validarCodigo;
}
