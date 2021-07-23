import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux';
import store from '../app/store';
import App from '../App';
import GlobalContextProvider from '../app/contexts';
import * as firebaseMock from '../app/firebase-configs';

jest.mock('../features/auth/useRecaptcha', () => jest.fn(() => ({
  isRecaptchaVerified: true
})))

describe('/', () => {
  beforeEach(() => 
    render(
      <Provider store={store}>
        <GlobalContextProvider>
          <App />
        </GlobalContextProvider>
      </Provider>
    )
  )

  afterEach(() => jest.restoreAllMocks())
  
  it('should login', async () => {
    const fakeSignIn = jest.spyOn(firebaseMock, 'signInWithEmailAndPassword')
    
    const fakeEmail = 'user@provider.com'
    const fakePassword = 'teste123'
    const inputEmail = document.querySelector('input[name="email"]')
    const inputPassword = document.querySelector('input[name="password"]')
    const button = document.querySelector('button[type="submit"]')

    expect(fakeSignIn).not.toHaveBeenCalledWith(fakeEmail, fakePassword)
    
    userEvent.type(inputEmail, fakeEmail)
    userEvent.type(inputPassword, fakePassword)

    userEvent.click(button)

    expect(fakeSignIn).toHaveBeenCalledWith(fakeEmail, fakePassword)
  });
})
