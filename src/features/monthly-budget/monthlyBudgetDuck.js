import { makeReduxAssets } from "resource-toolkit";
import { makeFirestoreApiClient, parseQuerySnapshot } from "../../app/firebase-adapters";
import makeResourceMessageTextFn from "../izitoast-for-resources/makeResourceMessageTextFn";

const client = makeFirestoreApiClient('monthly_budgets');

const monthlyBudgetResource = makeReduxAssets({
  name: "monthlyBudget",
  idKey: "uuid",
  makeMessageText: makeResourceMessageTextFn("planejamento", "planejamentos"),
  gateway: {
    fetchMany: (uuid, basicData) => client
      .query(basicData)
      .where('year', '==', basicData.year)
      .where('month', '==', basicData.month)
      .get()
      .then(parseQuerySnapshot),
    create: (budget, basicData) => client.create(basicData, budget),
    update: (uuid, budget, basicData) => client.update(basicData, budget),
    delete: (uuid) => client.delete(uuid),
  },
});

export const { actionThunks: monthlyBudgetActions } = monthlyBudgetResource;

export default monthlyBudgetResource.reducer;
