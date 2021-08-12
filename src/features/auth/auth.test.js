import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import LoginView from '../../features/auth/LoginView';
import SignupView from '../../features/auth/SignupView';
import GlobalContextProvider from '../../app/contexts';
import firebase from 'firebase/app';
import * as firebaseMock from '../../app/firebase-configs';

jest.mock('../auth/useRecaptcha', () =>
  jest.fn(() => ({
    isRecaptchaVerified: true,
  }))
);

jest.mock('react-router-dom', () => ({
  Redirect: jest.fn(() => <div />),
  useHistory: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('firebase/app', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn(() => ({
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          add: jest.fn(() => Promise.resolve()),
        })),
      })),
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { toJSON: () => {} } })),
        createUserWithEmailAndPassword: jest.fn((email) =>
          Promise.resolve({
            user: {
              toJSON: jest.fn(() => ({ email })),
              updateProfile: jest.fn(() => Promise.resolve()),
              sendEmailVerification: jest.fn(() => Promise.resolve()),
            },
          })
        ),
      })),
    })),
    auth: {
      GoogleAuthProvider: jest.fn(),
    },
  },
}));

describe('auth', () => {
  beforeEach(() => {
    Redirect.mockClear();
    firebase.initializeApp.mock.results[0].value.auth.mockClear();
  });

  it('calls firebase on sign in using e-mail', async () => {
    const container = render(
      <Provider store={makeConfiguredStore()}>
        <GlobalContextProvider>
          <LoginView />
        </GlobalContextProvider>
      </Provider>
    );
    const fakeSignIn = jest.spyOn(firebaseMock, 'signInWithEmailAndPassword');

    const fakeEmail = 'user@provider.com';
    const fakePassword = 'teste123';
    const inputEmail = container.getByLabelText('E-mail:');
    const inputPassword = container.getByLabelText('Senha:');
    const button = container.getByRole('button', { name: 'Entrar usando e-mail' });

    expect(fakeSignIn).not.toHaveBeenCalledWith(fakeEmail, fakePassword);

    userEvent.type(inputEmail, fakeEmail);
    userEvent.type(inputPassword, fakePassword);

    userEvent.click(button);

    expect(fakeSignIn).toHaveBeenCalledWith(fakeEmail, fakePassword);
  });

  it('calls firebase on sign up using e-mail', async () => {
    const store = makeConfiguredStore();
    const container = render(
      <Provider store={store}>
        <GlobalContextProvider>
          <SignupView />
        </GlobalContextProvider>
      </Provider>
    );

    userEvent.type(container.getByLabelText('Nome ou apelido:'), 'Rick');
    userEvent.type(container.getByLabelText('E-mail:'), 'rick@frifim.com');
    userEvent.type(container.getByLabelText('Senha:'), 'Wubba Lubba Dub Dub');
    userEvent.type(container.getByLabelText('Confirme a senha:'), 'Wubba Lubba Dub Dub');
    userEvent.click(container.getByRole('checkbox', { name: /li, compreendi e concordo/ }));
    userEvent.click(container.getByRole('button', { name: 'Cadastrar' }));

    await waitFor(() => expect(Redirect).toBeCalled());

    const { auth } = store.getState();
    expect(auth.user.email).toBe('rick@frifim.com');
    expect(auth.isAuthorized).toBe(true);

    expect(
      firebase.initializeApp.mock.results[0].value.auth.mock.results[0].value
        .createUserWithEmailAndPassword
    ).toBeCalledWith('rick@frifim.com', 'Wubba Lubba Dub Dub');
  });
});
