import { makeReduxAssets } from 'resource-toolkit';
import { fireContextCreation, fireContextDeletion, fireContextQuery, parseQuerySnapshot } from '../../app/firebase-adapters';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const categoriesResource = makeReduxAssets({
  name: 'categories',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('categoria', 'categorias'),
  gateway: {
    fetchMany: (ids, basicData) => {
      return fireContextQuery('categories', basicData).get().then(parseQuerySnapshot);
    },
    create: (category, basicData) => {
      return fireContextCreation('categories', basicData, category);
    },
    delete: (uuid) => {
      return fireContextDeletion('categories', null, uuid);
    },
  },
});

export const { actionThunks: categoriesActions } = categoriesResource;

export default categoriesResource.reducer;
