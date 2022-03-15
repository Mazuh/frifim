import { makeReduxAssets } from 'resource-toolkit';
import { makeFirestoreApiClient, parseQuerySnapshot } from '../../app/firebase-adapters';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const client = makeFirestoreApiClient('monthly_budgets');

const monthlyBudgetResource = makeReduxAssets({
  name: 'monthlyBudget',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('planejamento', 'planejamentos'),
  gateway: {
    fetchMany: (uuid, basicData) => retrieveMonthlyBudgets(basicData),
    create: (budget, basicData) => client.create(basicData, budget),
    update: (uuid, budget, basicData) => client.update(basicData, budget),
    delete: (uuid) => client.delete(uuid),
  },
});

const retrieveMonthlyBudgets = (basicData) =>
  basicData.project.guestsUids.length > 0
    ? client
        .querySharedData(basicData)
        .where('year', '==', basicData.year)
        .where('month', '==', basicData.month)
        .get()
        .then(parseQuerySnapshot)
    : client
        .query(basicData)
        .where('year', '==', basicData.year)
        .where('month', '==', basicData.month)
        .get()
        .then(parseQuerySnapshot);

export const { actionThunks: monthlyBudgetActions, plainActions: monthlyBudgetPlainActions } =
  monthlyBudgetResource;

export default monthlyBudgetResource.reducer;
