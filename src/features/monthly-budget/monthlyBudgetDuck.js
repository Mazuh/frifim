import { makeReduxAssets } from "resource-toolkit";
import { v4 as uuidv4 } from "uuid";
import { MONTHLY_BUDGETS_FIXTURE } from "../../app/fixtures";
import makeResourceMessageTextFn from "../izitoast-for-resources/makeResourceMessageTextFn";

const monthlyBudgetResource = makeReduxAssets({
  name: "monthlyBudget",
  idKey: "uuid",
  makeMessageText: makeResourceMessageTextFn("planejamento", "planejamentos"),
  gateway: {
    fetchMany: async (basicData) => {
      return MONTHLY_BUDGETS_FIXTURE;
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
