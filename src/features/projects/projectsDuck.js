import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

export const MAIN_PROJECT_FIXTURE = { uuid: uuidv4(), name: 'Principal' };

const projectsResource = makeReduxAssets({
  name: 'projects',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('projeto', 'projetos'),
  gateway: {
    fetchMany: async (basicData) => {
      return [MAIN_PROJECT_FIXTURE];
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
