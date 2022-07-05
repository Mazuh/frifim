import iziToast from 'izitoast';
import { parseQuerySnapshot } from '../app/firebase-adapters';
import { firedb } from '../app/firebase-configs';

export async function retrieveProjects(basicData) {
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

export async function validateProject(basicData) {
  const projects = await retrieveProjects(basicData);

  return projects.some((project) => project.uuid === basicData.project.uuid);
}

export const invalidActionToast = (isMobile) =>
  iziToast.show({
    title: 'Erro',
    message: 'Operação não autorizada. Você não faz parte desse projeto.',
    color: 'red',
    position: isMobile ? 'bottomCenter' : 'topRight',
    timeout: 2500,
  });
