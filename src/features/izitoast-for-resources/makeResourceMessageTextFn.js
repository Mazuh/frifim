export default function makeResourceMessageTextFn(label, pluralLabel) {
  return (relating, operation, error) => {
    const isError = error instanceof Error || error;
    const isMany = !isError && Array.isArray(relating) && relating.length > 1;

    switch (operation) {
      case 'CREATE':
        return (isError ? `Falhou ao adicionar ${label}.` : `Criação de ${label} com sucesso.`);
      case 'READ':
        if (isMany) {
          return (
            isError
              ? `Falha ao carregar ${relating.length} ${pluralLabel}.`
              : `Carregamento de ${relating.length} ${pluralLabel} com sucesso.`
          );
        } else {
          return (isError ? `Falha ao carregar ${label}.` : `Carregamento de ${label} com sucesso.`);
        }
      case 'UPDATE':
        return (isError ? `Falha ao alterar ${label}.` : `Alteração em ${label} com sucesso.`);
      case 'DELETE':
        return (isError ? `Falha ao apagar ${label}.` : `Remoção de ${label} com sucesso.`);
      default:
        return isError ? 'Código de erro inesperado para essa operação.' : 'Operação feita com sucesso.';
    }
  };
}
