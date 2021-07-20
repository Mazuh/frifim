import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux';
import store from '../app/store';
import App from '../App';
import GlobalContextProvider from '../app/contexts';
import * as firebaseMock from '../app/firebase-configs';

jest.mock('../features/auth/useRecaptcha', () => jest.fn(() => ({
  isRecaptchaVerified: true
})))

jest.useFakeTimers();

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
  
  it('should login', async () => {
    const fakeSignIn = jest.spyOn(firebaseMock, 'signInWithEmailAndPassword')
    
    const fakeEmail = 'user@provider.com'
    const fakePassword = 'teste123'
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const button = screen.getByTestId('submit-button')
    expect(fakeSignIn).not.toHaveBeenCalledWith(fakeEmail, fakePassword)
    
    userEvent.type(inputEmail, fakeEmail )
    userEvent.type(inputPassword, fakePassword )
    userEvent.click(button)

    expect(fakeSignIn).toHaveBeenCalledWith(fakeEmail, fakePassword)
  });
})
