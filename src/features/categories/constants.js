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
    name: 'Moradia'
  },
  {
    name: 'Transporte'
  },
  {
    name: 'Educação'
  },
  {
    name: 'Alimentaçao'
  },
  {
    name: 'Saúde'
  },
  {
    name: 'Lazer'
  },
]