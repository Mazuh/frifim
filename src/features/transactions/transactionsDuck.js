import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { INCOME_TYPE, EXPENSE_TYPE } from '../categories/constants';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const transactionsResource = makeReduxAssets({
  name: 'transactions',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('transação', 'transações'),
  gateway: {
    fetchMany: async () => {
      return [
        { uuid: uuidv4(), datetime: (new Date()).toISOString(), name: 'Salário (após IR e FGTS)', type: INCOME_TYPE.value, amount: '1500.00' },
        { uuid: uuidv4(), datetime: (new Date()).toISOString(), name: 'Netflix', type: EXPENSE_TYPE.value, amount: '45.90' },
      ];
    },
    create: async (transaction) => {
      return { uuid: uuidv4(), ...transaction };
    },
    update: async (uuid, transaction) => {
      return { ...transaction, uuid };
    },
    delete: async(uuid) => {
      return { uuid };
    },
  },
});

export const { actionThunks: transactionsActions } = transactionsResource;

export default transactionsResource.reducer;
