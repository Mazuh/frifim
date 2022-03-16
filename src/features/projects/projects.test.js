import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import MockDate from 'mockdate';
import { PeriodContext, ProjectContext } from '../../app/contexts';
import { makeConfiguredStore } from '../../app/store';
import ProjectView, { DeletionModal } from './ProjectView';
import { projectsPlainActions } from './projectsDuck';
import firebase from 'firebase/app';
import { makePeriod } from '../periods/period-lib';

jest.mock('firebase/app', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn(() => ({
      firestore: jest.fn(() => ({
        batch: jest.fn(),
        app: {
          auth: jest.fn(() => ({
            currentUser: { displayName: 'Marcell', uid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2' },
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
  beforeEach(() => {
    MockDate.set(new Date('08/10/2021'));
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
        <PeriodContext.Provider value={{ period: makePeriod(), setPeriod: jest.fn() }}>
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
        </PeriodContext.Provider>
      </Provider>
    );

    expect(container.getByText('Deletar')).toBeVisible();
    expect(container.getByText('Deletar')).not.toBeDisabled();
  });

  it("does not render delete button when I'm a guest user", () => {
    const store = makeConfiguredStore();
    store.dispatch(
      projectsPlainActions.setRead(null, [
        {
          createdAt: '2021-10-08T00:48:51.958Z',
          name: 'Principal',
          userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g3',
          uuid: '8R17MZDN5FHWPwRWPWX6',
        },
      ])
    );
    const container = render(
      <Provider store={store}>
        <PeriodContext.Provider value={{ period: makePeriod(), setPeriod: jest.fn() }}>
          <ProjectContext.Provider
            value={{
              project: {
                createdAt: '2021-10-08T00:48:51.958Z',
                name: 'Principal',
                userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g3',
                uuid: '8R17MZDN5FHWPwRWPWX6',
              },
              setProject: jest.fn(),
            }}
          >
            <ProjectView />
          </ProjectContext.Provider>
        </PeriodContext.Provider>
      </Provider>
    );

    expect(
      container.getByText(
        'Projeto compartilhado. Somente o criador do projeto tem permissão para alterá-lo.'
      )
    ).toBeVisible();
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
        <PeriodContext.Provider value={{ period: makePeriod(), setPeriod: jest.fn() }}>
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
        </PeriodContext.Provider>
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

  it('render the new project while the project state is not updated yet', async () => {
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
        <PeriodContext.Provider value={{ period: makePeriod(), setPeriod: jest.fn() }}>
          <ProjectContext.Provider
            value={{
              project: {
                createdAt: '2021-10-08T10:48:51.958Z',
                name: 'Secundário',
                userUid: '0dwe96bbnSRYiyEPJ7ojfSNi21g2',
                uuid: 'sLws1rQ970rv813cqEIA',
              },
              setProject: jest.fn(),
            }}
          >
            <ProjectView />
          </ProjectContext.Provider>
        </PeriodContext.Provider>
      </Provider>
    );

    expect(container.getByTestId('name').getAttribute('value')).toBe('Secundário');
    expect(container.getByTestId('uuid').getAttribute('value')).toBe('sLws1rQ970rv813cqEIA');
  });
});
