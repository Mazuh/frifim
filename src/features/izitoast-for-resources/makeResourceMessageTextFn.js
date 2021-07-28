export default function makeResourceMessageTextFn(label) {
  return (relating, operation, error) => {
    const isError = error instanceof Error || error;

    switch (operation) {
      case 'CREATE':
        return isError ? `Falhou ao adicionar ${label}.` : `Criação de ${label} com sucesso.`;
      case 'READ':
        return isError ? `Falha ao carregar ${label}.` : '';
      case 'UPDATE':
        return isError ? `Falha ao alterar ${label}.` : `Alteração em ${label} com sucesso.`;
      case 'DELETE':
        return isError ? `Falha ao apagar ${label}.` : `Remoção de ${label} com sucesso.`;
      default:
        return isError
          ? 'Código de erro inesperado para essa operação.'
          : 'Operação feita com sucesso.';
    }
  };
}
