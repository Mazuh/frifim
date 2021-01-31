import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { TRANSACTIONS_FIXTURE } from '../../app/fixtures';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const transactionsResource = makeReduxAssets({
  name: 'transactions',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('transação', 'transações'),
  gateway: {
    fetchMany: async (basicData) => {
      return TRANSACTIONS_FIXTURE;
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
