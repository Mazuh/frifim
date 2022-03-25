import get from 'lodash.get';
import { retrieveProjects } from './project-utils';

export const queryByClient = (client, basicData) => {
  return get(basicData, 'project.guestsEmails', null)
    ? client.querySharedData(basicData)
    : client.query(basicData);
};

export async function verifyBasicData(basicData) {
  const projects = await retrieveProjects(basicData);

  const currentProjectExist = projects.some((project) => project.uuid === basicData.project.uuid);

  return currentProjectExist ? basicData : { ...basicData, project: projects[0] };
}
