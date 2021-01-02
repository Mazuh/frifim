import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES_FIXTURE } from '../categories/categoriesDuck';
import { INCOME_TYPE, EXPENSE_TYPE } from '../categories/constants';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const transactionsResource = makeReduxAssets({
  name: 'transactions',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('transação', 'transações'),
  gateway: {
    fetchMany: async (basicData) => {
      return [
        {
          uuid: uuidv4(),
          datetime: (new Date()).toISOString(),
          name: 'Um negócio aí',
          type: EXPENSE_TYPE.value,
          amount: '69.00',
          category: '',
        },
        {
          uuid: uuidv4(),
          datetime: (new Date()).toISOString(), name: 'Salário (após IR e FGTS)',
          type: INCOME_TYPE.value,
          amount: '1500.00',
          category: CATEGORIES_FIXTURE[0].uuid,
        },
        {
          uuid: uuidv4(),
          datetime: (new Date()).toISOString(),
          name: 'Netflix',
          type: EXPENSE_TYPE.value,
          amount: '45.90',
          category: CATEGORIES_FIXTURE[1].uuid,
        },
      ];
    },
    create: async (transaction, basicData) => {
      return { uuid: uuidv4(), ...transaction };
    },
    update: async (uuid, transaction, basicData) => {
      return { ...transaction, uuid };
    },
    delete: async(uuid, basicData) => {
      return { uuid };
    },
  },
});

export const { actionThunks: transactionsActions } = transactionsResource;

export default transactionsResource.reducer;
