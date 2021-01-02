import { makeReduxAssets } from "resource-toolkit";
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES_FIXTURE } from "../categories/categoriesDuck";
import { INCOME_TYPE, EXPENSE_TYPE } from "../categories/constants";
import makeResourceMessageTextFn from "../izitoast-for-resources/makeResourceMessageTextFn";

const monthlyBudgetResource = makeReduxAssets({
  name: "monthlyBudget",
  idKey: "uuid",
  makeMessageText: makeResourceMessageTextFn("planejamento", "planejamentos"),
  gateway: {
    fetchMany: async (basicData) => {
      return [
        {
          uuid: uuidv4(),
          name: "Salário (após IR e FGTS)",
          type: INCOME_TYPE.value,
          amount: "1500.00",
          category: CATEGORIES_FIXTURE[0].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Freelance Foo",
          type: INCOME_TYPE.value,
          amount: "1000.00",
        },
        {
          uuid: uuidv4(),
          name: "Reserva de emergência",
          type: EXPENSE_TYPE.value,
          amount: "300.00",
        },
        {
          uuid: uuidv4(),
          name: "Aluguel",
          type: EXPENSE_TYPE.value,
          amount: "200.00",
          category: CATEGORIES_FIXTURE[2].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Energia",
          type: EXPENSE_TYPE.value,
          amount: "150.00",
          category: CATEGORIES_FIXTURE[2].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Animal de estimação",
          type: EXPENSE_TYPE.value,
          amount: "150.00",
          category: CATEGORIES_FIXTURE[2].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Transporte",
          type: EXPENSE_TYPE.value,
          amount: "350.00",
          category: CATEGORIES_FIXTURE[4].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Plano de saúde",
          type: EXPENSE_TYPE.value,
          amount: "90.00",
          category: CATEGORIES_FIXTURE[5].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Remédios",
          type: EXPENSE_TYPE.value,
          amount: "50.00",
          category: CATEGORIES_FIXTURE[5].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Academia",
          type: EXPENSE_TYPE.value,
          amount: "59.99",
          category: CATEGORIES_FIXTURE[5].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Compras gerais do lar",
          type: EXPENSE_TYPE.value,
          amount: "350.00",
          category: CATEGORIES_FIXTURE[2].uuid,
        },
        {
          uuid: uuidv4(),
          name: "Entretenimento geral (festas, jogos etc)",
          type: EXPENSE_TYPE.value,
          amount: "200.00",
        },
        {
          uuid: uuidv4(),
          name: "Netflix",
          type: EXPENSE_TYPE.value,
          amount: "45.90",
          category: CATEGORIES_FIXTURE[1].uuid,
        },
      ];
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
