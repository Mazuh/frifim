import { makeReduxAssets } from 'resource-toolkit';
import { makeFirestoreApiClient, parseQuerySnapshot } from '../../app/firebase-adapters';
import { queryByClient } from '../../utils/query-utils';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const client = makeFirestoreApiClient('weekly_budgets');

const weeklyBudgetResource = makeReduxAssets({
  name: 'weeklyBudget',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('planejamento semanal', 'planejamentos semanais'),
  gateway: {
    fetchMany: (uuids, basicData) =>
      queryByClient(client, basicData)
        .where('year', '==', basicData.year)
        .where('month', '==', basicData.month)
        .get()
        .then(parseQuerySnapshot),
    create: (budget, basicData) => client.create(basicData, budget),
    update: (uuid, budget, basicData) => client.update(basicData, budget),
    delete: (uuid) => client.delete(uuid),
  },
});

export const { actionThunks: weeklyBudgetActions, plainActions: weeklyBudgetPlainActions } =
  weeklyBudgetResource;

export default weeklyBudgetResource.reducer;
