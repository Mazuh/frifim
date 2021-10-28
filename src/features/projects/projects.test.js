import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ProjectContext } from '../../app/contexts';
import { makeConfiguredStore } from '../../app/store';
import ProjectView, { DeletionModal } from './ProjectView';
import { projectsPlainActions } from './projectsDuck';
import firebase from 'firebase/app';

jest.mock('firebase/app', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn(() => ({
      firestore: jest.fn(() => ({
        batch: jest.fn(),
      })),
      auth: jest.fn(() => ({})),
    })),
    auth: {
      GoogleAuthProvider: jest.fn(),
      FacebookAuthProvider: jest.fn(),
    },
  },
}));

describe('projects', () => {
  beforeEach(() => {
    firebase.initializeApp.mock.results[0].value.auth.mockClear();
  });

  it('renders delete button', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      projectsPlainActions.setRead(null, [
        {
          createdAt: '2021-10-08T00:48:51.958Z',
          name: 'Principal',
          userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
          uuid: '8R17MZDN5FHWPwRWPWX6',
        },
        {
          createdAt: '2021-10-07T00:48:51.958Z',
          name: 'Secundário',
          userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
          uuid: '8R17MZDN5FHWPwRWPWY7',
        },
      ])
    );
    const container = render(
      <Provider store={store}>
        <ProjectContext.Provider
          value={{
            project: {
              createdAt: '2021-10-08T00:48:51.958Z',
              name: 'Principal',
              userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
              uuid: '8R17MZDN5FHWPwRWPWX6',
            },
            setProject: jest.fn(),
          }}
        >
          <ProjectView />
        </ProjectContext.Provider>
      </Provider>
    );

    expect(container.getByText('Deletar')).toBeVisible();
    expect(container.getByText('Deletar')).not.toBeDisabled();
  });

  it('renders disabled delete button when there is a single project', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      projectsPlainActions.setRead(null, [
        {
          createdAt: '2021-10-08T00:48:51.958Z',
          name: 'Principal',
          userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
          uuid: '8R17MZDN5FHWPwRWPWX6',
        },
      ])
    );
    const container = render(
      <Provider store={store}>
        <ProjectContext.Provider
          value={{
            project: {
              createdAt: '2021-10-08T00:48:51.958Z',
              name: 'Principal',
              userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
              uuid: '8R17MZDN5FHWPwRWPWX6',
            },
            setProject: jest.fn(),
          }}
        >
          <ProjectView />
        </ProjectContext.Provider>
      </Provider>
    );

    expect(container.getByText('Deletar')).toBeVisible();
    expect(container.getByText('Deletar')).toBeDisabled();
  });

  it('calls firebase when deleting a project', async () => {
    const project = {
      createdAt: '2021-10-08T00:48:51.958Z',
      name: 'Principal',
      userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
      uuid: '8R17MZDN5FHWPwRWPWX6',
    };
    const fallbackProject = {
      createdAt: '2021-10-07T00:48:51.958Z',
      name: 'Secundário',
      userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
      uuid: '8R17MZDN5FHWPwRWPWY7',
    };
    const store = makeConfiguredStore();

    const container = render(
      <Provider store={store}>
        <ProjectContext.Provider
          value={{
            project,
            setProject: jest.fn(),
          }}
        >
          <DeletionModal
            isVisible={true}
            project={project}
            fallbackProject={fallbackProject}
            close={jest.fn(() => false)}
          />
        </ProjectContext.Provider>
      </Provider>
    );

    const button = container.getByRole('button', { name: 'Deletar' });

    expect(
      firebase.initializeApp.mock.results[0].value.firestore.mock.results[0].value.batch
    ).not.toHaveBeenCalled();

    userEvent.click(button);

    expect(
      firebase.initializeApp.mock.results[0].value.firestore.mock.results[0].value.batch
    ).toHaveBeenCalled();
  });
});
