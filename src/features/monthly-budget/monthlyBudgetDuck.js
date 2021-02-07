import { makeReduxAssets } from "resource-toolkit";
import { v4 as uuidv4 } from "uuid";
import { parseQuerySnapshot } from "../../app/firebase-adapters";
import { firedb } from "../../app/firebase-configs";
import makeResourceMessageTextFn from "../izitoast-for-resources/makeResourceMessageTextFn";

const monthlyBudgetResource = makeReduxAssets({
  name: "monthlyBudget",
  idKey: "uuid",
  makeMessageText: makeResourceMessageTextFn("planejamento", "planejamentos"),
  gateway: {
    fetchMany: async (ids, basicData) => {
      return firedb
        .collection('monthly_budgets')
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
    delete: async (uuid, basicData) => {
      return { uuid };
    },
  },
});

export const { actionThunks: monthlyBudgetActions } = monthlyBudgetResource;

export default monthlyBudgetResource.reducer;
