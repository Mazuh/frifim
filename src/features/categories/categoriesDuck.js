import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { TAG_COLORS, INCOME_TYPE, EXPENSE_TYPE } from './constants';

const categoriesResource = makeReduxAssets({
  name: 'categories',
  idKey: 'uuid',
  gateway: {
    fetchMany: async () => {
      return [
        { uuid: uuidv4(), name: 'Salário', color: TAG_COLORS[0], type: INCOME_TYPE.value },
        { uuid: uuidv4(), name: 'Moradia', color: TAG_COLORS[1], type: EXPENSE_TYPE.value },
        { uuid: uuidv4(), name: 'Alimentação', color: TAG_COLORS[2], type: EXPENSE_TYPE.value },
        { uuid: uuidv4(), name: 'Transporte', color: TAG_COLORS[2], type: EXPENSE_TYPE.value },
        { uuid: uuidv4(), name: 'Saúde', color: TAG_COLORS[2], type: EXPENSE_TYPE.value },
      ];
    },
    create: async (category) => {
      return { uuid: uuidv4(), ...category };
    },
    delete: async(uuid) => {
      return { uuid };
    },
  },
});

export const { actionThunks: categoriesActions } = categoriesResource;

export default categoriesResource.reducer;
