import { makeReduxAssets } from 'resource-toolkit';
import { parseQuerySnapshot, toFirestoreDocData } from '../../app/firebase-adapters';
import { firedb } from '../../app/firebase-configs';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const projectsResource = makeReduxAssets({
  name: 'projects',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('projeto', 'projetos'),
  gateway: {
    fetchMany: (ids, basicData) => {
      return firedb
        .collection('projects')
        .where('userUid', '==', basicData.user.uid)
        .get()
        .then(parseQuerySnapshot);
    },
    update: (uuid, project) =>
      firedb
        .collection('projects')
        .doc(uuid)
        .update(toFirestoreDocData(project))
        .then(() => ({ ...project, uuid })),
    create: (project) =>
      firedb
        .collection('projects')
        .add(toFirestoreDocData(project))
        .then((responseRef) => ({ ...project, uuid: responseRef.id })),
    delete: (uuid) =>
      firedb
        .collection('projects')
        .doc(uuid)
        .delete()
        .then(() => ({ uuid })),
  },
});

export const { actionThunks: projectsActions } = projectsResource;

export default projectsResource.reducer;
