import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES_FIXTURE } from '../categories/categoriesDuck';
import { INCOME_TYPE, EXPENSE_TYPE } from '../categories/constants';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';
import { WEEK_DAYS } from './constants';

const weeklyBudgetResource = makeReduxAssets({
  name: 'weeklyBudget',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('planejamento semanal', 'planejamentos semanais'),
  gateway: {
    fetchMany: async () => {
      return [
        {
          uuid: uuidv4(),
          name: 'Compras pro almoço',
          type: EXPENSE_TYPE.value,
          day: WEEK_DAYS[0].value,
          amount: '65.00',
          category: CATEGORIES_FIXTURE[4].uuid,
        },
        {
          uuid: uuidv4(),
          name: 'Janta (delivery)',
          type: EXPENSE_TYPE.value,
          day: WEEK_DAYS[0].value,
          amount: '20.00',
          category: CATEGORIES_FIXTURE[3].uuid,
        },
        {
          uuid: uuidv4(),
          name: 'Freelance Bar',
          type: INCOME_TYPE.value,
          day: WEEK_DAYS[4].value,
          amount: '199.99',
        },
        {
          uuid: uuidv4(),
          name: 'Jantar caro',
          type: EXPENSE_TYPE.value,
          day: WEEK_DAYS[4].value,
          amount: '100.00',
          category: CATEGORIES_FIXTURE[3].uuid,
        },
        {
          uuid: uuidv4(),
          name: 'Curtição',
          type: EXPENSE_TYPE.value,
          day: WEEK_DAYS[5].value,
          amount: '150.00',
          category: CATEGORIES_FIXTURE[1].uuid,
        },
        {
          uuid: uuidv4(),
          name: 'Curtição',
          type: EXPENSE_TYPE.value,
          day: WEEK_DAYS[6].value,
          amount: '200.00',
          category: CATEGORIES_FIXTURE[1].uuid,
        },
      ];
    },
    create: async (budget) => {
      return { uuid: uuidv4(), ...budget };
    },
    update: async (uuid, budget) => {
      return { ...budget, uuid };
    },
    delete: async(uuid) => {
      return { uuid };
    },
  },
});

export const { actionThunks: weeklyBudgetActions } = weeklyBudgetResource;

export default weeklyBudgetResource.reducer;
