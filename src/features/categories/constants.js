import { BsBoxArrowInLeft, BsBoxArrowRight } from 'react-icons/bs';

export const INCOME_TYPE = Object.freeze({
  value: 'income',
  label: 'Receita',
  pluralLabel: 'Receitas',
  Icon: BsBoxArrowInLeft,
});
export const EXPENSE_TYPE = Object.freeze({
  value: 'expense',
  label: 'Despesa',
  pluralLabel: 'Despesas',
  Icon: BsBoxArrowRight,
});

export const FLOW_TYPES = Object.freeze([INCOME_TYPE, EXPENSE_TYPE]);

export const defaultCategories = [
  {
    name: 'Moradia',
    color: '#F5793A',
  },
  {
    name: 'Transporte',
    color: '#A95AA1 ',
  },
  {
    name: 'Educação',
    color: '#85C0F9',
  },
  {
    name: 'Alimentaçao',
    color: '#ABC3C9',
  },
  {
    name: 'Saúde',
    color: '#63ACBE',
  },
  {
    name: 'Lazer',
    color: '#EBE7E0',
  },
];
