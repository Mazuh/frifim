import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../../app/store';
import App from '../../App';
import GlobalContextProvider from '../../app/contexts';
import * as firebaseMock from '../../app/firebase-configs';

jest.mock('../auth/useRecaptcha', () =>
  jest.fn(() => ({
    isRecaptchaVerified: true,
  }))
);

describe('/', () => {
  let container = null;

  beforeEach(
    () =>
      (container = render(
        <Provider store={store}>
          <GlobalContextProvider>
            <App />
          </GlobalContextProvider>
        </Provider>
      ))
  );

  it('calls firebase on sign in using e-mail', async () => {
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
