import { makeReduxAssets } from 'resource-toolkit';
import { v4 as uuidv4 } from "uuid";
import { PROJECTS_FIXTURE } from '../../app/fixtures';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const projectsResource = makeReduxAssets({
  name: 'projects',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('projeto', 'projetos'),
  gateway: {
    fetchMany: async (basicData) => {
      return PROJECTS_FIXTURE;
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
