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
    const NewFakeEmail = 'newUserFake@test.com'
    const NewFakePassword = 'test123'
    const confirmNewFakePassword = 'test123'

    const inputNewName = screen.getByTestId('displayName')
    const inputNewEmail =  screen.getByTestId('email')
    const inputNewPassword = screen.getByTestId('password')
    const inputNewPasswordConfirm = screen.getByTestId('passwordConfirmation')

    const CheckAgreement = screen.getByTestId('agreement')
    const buttonNew = screen.getByTestId('button-submit')
    
    userEvent.type(inputNewEmail, NewFakeEmail)
    userEvent.type(inputNewName, displayName)
    userEvent.type(inputNewPassword, NewFakePassword)
    userEvent.type(inputNewPasswordConfirm, confirmNewFakePassword)

    userEvent.click(CheckAgreement)
    userEvent.click(buttonNew)

    waitFor(() => expect(fakeUpdateProfile).toHaveBeenCalledWith({ displayName }))
    expect(fakeSignUp).toHaveBeenCalledWith(NewFakeEmail, NewFakePassword)

  });
})
