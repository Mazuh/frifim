export const emergencyFields = [
  {
    id: 'monthQuantity',
    label: 'Meses protegidos:',
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
    legend: 'Dica: quanto você precisa para sobreviver por mês.',
  },
  {
    id: 'recommendedEmergency',
    label: 'Valor mensal recomendado para guardar no fundo de emergência para atingir o objetivo:',
    prepend: 'R$',
    placeholder: 'o valor recomendado é de 10% de suas despesas mensais',
    decimalScale: 2,
    legend: 'Dica: 10% da sua receita mensal.',
  },
  {
    id: 'previouslySavedAmount',
    label: 'Quanto guardar por mês:',
    prepend: 'R$',
    decimalScale: 2,
    legend: 'Dica: Caso já tenha começado a guardar algo para esta reserva.',
  },
];
