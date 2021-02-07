import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { parseQuerySnapshot } from '../../app/firebase-adapters';
import { firedb } from '../../app/firebase-configs';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const weeklyBudgetResource = makeReduxAssets({
  name: 'weeklyBudget',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('planejamento semanal', 'planejamentos semanais'),
  gateway: {
    fetchMany: async (ids, basicData) => {
      return firedb
        .collection('weekly_budgets')
        .where('userUid', '==', basicData.user.uid)
        .get()
        .then(parseQuerySnapshot);
    },
    create: async (budget, basicData) => {
      return { uuid: uuidv4(), ...budget };
    },
    update: async (uuid, budget, basicData) => {
      return { ...budget, uuid };
    },
    delete: async(uuid, basicData) => {
      return { uuid };
    },
  },
});

export const { actionThunks: weeklyBudgetActions } = weeklyBudgetResource;

export default weeklyBudgetResource.reducer;
