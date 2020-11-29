import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { TAG_COLORS } from './constants';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

export const CATEGORIES_FIXTURE = [
  { uuid: uuidv4(), name: 'Empresa Acme', color: TAG_COLORS[0] },
  { uuid: uuidv4(), name: 'Entretenimento', color: TAG_COLORS[2] },
  { uuid: uuidv4(), name: 'Moradia', color: TAG_COLORS[1] },
  { uuid: uuidv4(), name: 'Alimentação', color: TAG_COLORS[2] },
  { uuid: uuidv4(), name: 'Transporte', color: TAG_COLORS[2] },
  { uuid: uuidv4(), name: 'Saúde', color: TAG_COLORS[2] },
];

const categoriesResource = makeReduxAssets({
  name: 'categories',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('categoria', 'categorias'),
  gateway: {
    fetchMany: async () => {
      return CATEGORIES_FIXTURE;
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
