import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";

const categoriesResource = makeReduxAssets({
  name: 'categories',
  idKey: 'uuid',
  gateway: {
    fetchMany: async () => {
      return [
        { uuid: uuidv4(), name: 'Moradia' },
        { uuid: uuidv4(), name: 'Alimentação' },
        { uuid: uuidv4(), name: 'Transporte' },
        { uuid: uuidv4(), name: 'Saúde' },
      ];
    },
  },
});

export const { actionThunks: categoriesActions } = categoriesResource;

export default categoriesResource.reducer;
