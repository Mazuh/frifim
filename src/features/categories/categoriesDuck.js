import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { parseQuerySnapshot } from '../../app/firebase-adapters';
import { firedb } from '../../app/firebase-configs';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const categoriesResource = makeReduxAssets({
  name: 'categories',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('categoria', 'categorias'),
  gateway: {
    fetchMany: async (ids, basicData) => {
      return firedb
        .collection('categories')
        .where('userUid', '==', basicData.user.uid)
        .get()
        .then(parseQuerySnapshot);
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
