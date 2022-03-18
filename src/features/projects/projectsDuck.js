import { makeReduxAssets } from 'resource-toolkit';
import { parseQuerySnapshot, toFirestoreDocData } from '../../app/firebase-adapters';
import { firedb } from '../../app/firebase-configs';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const projectsResource = makeReduxAssets({
  name: 'projects',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('projeto', 'projetos'),
  gateway: {
    fetchMany: (ids, basicData) => retrieveProjects(basicData),
    update: (uuid, project) =>
      firedb
        .collection('projects')
        .doc(uuid)
        .update(toFirestoreDocData(project))
        .then(() => ({ ...project, uuid })),
    create: (project, onCreate) =>
      firedb
        .collection('projects')
        .add(toFirestoreDocData(project))
        .then((responseRef) => {
          const createdProject = { ...project, uuid: responseRef.id };
          onCreate(createdProject);
          return createdProject;
        }),
    delete: (uuid) => batchedDelete(uuid).then(() => ({ uuid })),
  },
});

async function retrieveProjects(basicData) {
  const myProjects = await firedb
    .collection('projects')
    .where('userUid', '==', basicData.user.uid)
    .get()
    .then(parseQuerySnapshot);

  const sharedProjects = await firedb
    .collection('projects')
    .where('guestsEmails', 'array-contains', basicData.user.email)
    .get()
    .then(parseQuerySnapshot);

  return myProjects.concat(sharedProjects);
}

async function batchedDelete(uuid) {
  const batch = firedb.batch();

  await Promise.all(
    ['monthly_budgets', 'weekly_budgets', 'categories', 'transactions'].map((collection) =>
      firedb
        .collection(collection)
        .where('project', '==', uuid)
        .get()
        .then(parseQuerySnapshot)
        .then((founds) =>
          founds.forEach((doc) => {
            const docRef = firedb.collection(collection).doc(doc.uuid);
            batch.delete(docRef);
          })
        )
    )
  );

  const projectRef = firedb.collection('projects').doc(uuid);
  batch.delete(projectRef);

  await batch.commit();
}

export const { actionThunks: projectsActions, plainActions: projectsPlainActions } =
  projectsResource;

export default projectsResource.reducer;
