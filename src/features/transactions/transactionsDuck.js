import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { parseQuerySnapshot } from '../../app/firebase-adapters';
import { firedb } from '../../app/firebase-configs';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const transactionsResource = makeReduxAssets({
  name: 'transactions',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('transação', 'transações'),
  gateway: {
    fetchMany: async (ids, basicData) => {
      return firedb
        .collection('transactions')
        .where('userUid', '==', basicData.user.uid)
        .get()
        .then(parseQuerySnapshot);
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
