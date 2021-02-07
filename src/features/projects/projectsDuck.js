import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { parseQuerySnapshot } from '../../app/firebase-adapters';
import { firedb } from '../../app/firebase-configs';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const projectsResource = makeReduxAssets({
  name: 'projects',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('projeto', 'projetos'),
  gateway: {
    fetchMany: async (ids, basicData) => {
      return firedb
        .collection('projects')
        .where('userUid', '==', basicData.user.uid)
        .get()
        .then(parseQuerySnapshot);
    },
    create: async (project, basicData) => {
      return { uuid: uuidv4(), ...project };
    },
    delete: async(uuid, basicData) => {
      return { uuid };
    },
  },
});

export const { actionThunks: projectsActions } = projectsResource;

export default projectsResource.reducer;
