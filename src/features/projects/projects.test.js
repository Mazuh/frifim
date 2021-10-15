import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ProjectContext } from '../../app/contexts';
import { makeConfiguredStore } from '../../app/store';
import ProjectView from './ProjectView';
import { projectsPlainActions } from './projectsDuck';

jest.mock('firebase/app', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn(() => ({
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          where: {
            get: jest.fn(() =>
              Promise.resolve([
                {
                  createdAt: '2021-10-08T00:48:51.958Z',
                  name: 'Principal',
                  userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
                  uuid: '8R17MZDN5FHWPwRWPWX6',
                },
              ])
            ),
          },
        })),
        app: {
          auth: jest.fn(() => ({
            currentUser: { displayName: 'Rodrigo' },
          })),
        },
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
});
