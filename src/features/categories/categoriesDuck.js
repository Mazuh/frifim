import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES_FIXTURE } from '../../app/fixtures';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const categoriesResource = makeReduxAssets({
  name: 'categories',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('categoria', 'categorias'),
  gateway: {
    fetchMany: async (basicData) => {
      return CATEGORIES_FIXTURE;
    },
    create: async (category, basicData) => {
      return { uuid: uuidv4(), ...category };
    },
    delete: async(uuid, basicData) => {
      return { uuid };
    },
  },
});

export const { actionThunks: categoriesActions } = categoriesResource;

export default categoriesResource.reducer;
