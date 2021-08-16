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
    color: '#A569BD',
  },
  {
    name: 'Transporte',
    color: '#48C9B0 ',
  },
  {
    name: 'Educação',
    color: '#3498DB',
  },
  {
    name: 'Alimentaçao',
    color: '#E67E22',
  },
  {
    name: 'Saúde',
    color: '#E74C3C',
  },
  {
    name: 'Lazer',
    color: '#F4D03F',
  },
]