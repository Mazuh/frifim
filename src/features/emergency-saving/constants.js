export const emergencyFields = [
  {
    id: 'monthQuantity',
    label: 'Meses para proteger:',
    prepend: 'meses',
    prependStyle: { display: 'flex', flexDirection: 'row-reverse' },
    decimalScale: 0,
    legend:
      'Dica: 3 meses para funcionalismo público, 6 meses para carteira assinada (CLT) e 12 meses para os demais (estágio, informal, PJ etc.).',
  },
  {
    id: 'expenses',
    label: 'Despesas fixas por mês:',
    prepend: 'R$',
    decimalScale: 2,
    legend: 'Quanto você precisa para sobreviver no mês? Por padrão, seu total de despesas mesais.',
  },
  {
    id: 'monthlySavingAmount',
    label: 'Quanto guardará todo mês:',
    prepend: 'R$',
    decimalScale: 2,
    legend: 'Talvez 10% da sua receita mensal?',
  },
  {
    id: 'previouslySavedAmount',
    label: 'Quantia já guardada:',
    prepend: 'R$',
    decimalScale: 2,
    legend: 'Caso já tenha começado a guardar algo para esta reserva.',
  },
];
