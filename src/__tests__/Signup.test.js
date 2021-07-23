import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux';
import _set from 'lodash.set'

import store from '../app/store';
import SignupView from "../features/auth/SignupView";
import GlobalContextProvider from '../app/contexts';
import * as firebaseMock from '../app/firebase-configs';

jest.mock('../features/auth/useRecaptcha', () => jest.fn(() => ({
  isRecaptchaVerified: true
})))

jest.useFakeTimers();

describe('/signup', () => {
  beforeEach(() => 
    render(
        <Provider store={store}>
          <GlobalContextProvider>
            <SignupView />
          </GlobalContextProvider>
        </Provider>
      )
  )
  
  it('should register new user', async () => {
    const fakeUpdateProfile = jest.fn()
    fakeUpdateProfile()

    const fakeCredentials = _set({}, 'user.updateProfile', fakeUpdateProfile)
    const fakeSignUp = jest.spyOn(firebaseMock, 'createUserWithEmailAndPassword')
      .mockImplementation(() => 
        new Promise(resolve => resolve(fakeCredentials))
      )
    
    const displayName = "Test"
    const email = 'newUserFake@test.com'
    const password = 'test123'
    const passwordConfirmation = 'test123'

    const inputName = screen.getByPlaceholderText('Como te chamaremos?')
    const inputEmail =  screen.getByPlaceholderText('Digite seu melhor e-mail...')
    const inputPassword = screen.getByPlaceholderText('Digite pelo menos 8 caracteres de senha...')
    const inputPasswordConfirmation = screen.getByPlaceholderText('Digite a senha acima novamente...')

    const checkAgreement = document.querySelector('input[type="checkbox"]')
    const button = document.querySelector('button[type="submit"]')
    
    userEvent.type(inputEmail, email)
    userEvent.type(inputName, displayName)
    userEvent.type(inputPassword, password)
    userEvent.type(inputPasswordConfirmation, passwordConfirmation)

    userEvent.click(checkAgreement)
    userEvent.click(button)

    expect(fakeSignUp).toHaveBeenCalledWith(email, password)
    waitFor(() => expect(fakeUpdateProfile).toHaveBeenCalledWith({ displayName }))
  });
})
