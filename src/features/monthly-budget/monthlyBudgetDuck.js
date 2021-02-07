import { makeReduxAssets } from "resource-toolkit";
import { v4 as uuidv4 } from "uuid";
import { fireContextQuery, parseQuerySnapshot } from "../../app/firebase-adapters";
import makeResourceMessageTextFn from "../izitoast-for-resources/makeResourceMessageTextFn";

const monthlyBudgetResource = makeReduxAssets({
  name: "monthlyBudget",
  idKey: "uuid",
  makeMessageText: makeResourceMessageTextFn("planejamento", "planejamentos"),
  gateway: {
    fetchMany: async (ids, basicData) => {
      return fireContextQuery('monthly_budgets', basicData).get().then(parseQuerySnapshot);
    },
    create: async (budget, basicData) => {
      return { uuid: uuidv4(), ...budget };
    },
    update: async (uuid, budget, basicData) => {
      return { ...budget, uuid };
    },
    delete: async (uuid, basicData) => {
      return { uuid };
    },
  },
});

export const { actionThunks: monthlyBudgetActions } = monthlyBudgetResource;

export default monthlyBudgetResource.reducer;
