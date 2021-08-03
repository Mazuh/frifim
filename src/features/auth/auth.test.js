import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../../app/store';
import LoginView from '../../features/auth/LoginView';
import GlobalContextProvider from '../../app/contexts';
import * as firebaseMock from '../../app/firebase-configs';

jest.mock('../auth/useRecaptcha', () =>
  jest.fn(() => ({
    isRecaptchaVerified: true,
  }))
);

describe('/', () => {
  it('calls firebase on sign in using e-mail', async () => {
    const container = render(
      <Provider store={store}>
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
});
