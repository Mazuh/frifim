import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux';
import store from '../app/store';
import SignupView from "../features/auth/SignupView";
import GlobalContextProvider from '../app/contexts';
import * as firebaseMock from '../app/firebase-configs';


// jest.mock('../features/auth/useRecaptcha', () => jest.fn(() => ({
//   isRecaptchaVerified: true
// })))

// jest.useFakeTimers();

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
    const fakeSignUp = jest.spyOn(firebaseMock, 'createUserWithEmailAndPassword')
    
    const NewFakeName = "Test"
    const NewFakeEmail = 'newUserFake@test.com'
    const NewFakePassword = 'test123'
    const confirmNewFakePassword = 'test123'

    const inputNewName = screen.getByTestId('displayName')
    const inputNewEmail =  screen.getByTestId('email')
    const inputNewPassword = screen.getByTestId('password')
    const inputNewPasswordConfirm = screen.getByTestId('passwordConfirmation')

    const CheckAgreement = screen.getByTestId('agreement')
    const buttonNew = screen.getByTestId('button-submit')

    expect(fakeSignUp).not.toHaveBeenCalledWith(NewFakeEmail, NewFakePassword)
    
    userEvent.type(inputNewEmail, NewFakeEmail )
    userEvent.type(inputNewName, NewFakeName )
    userEvent.type(inputNewPassword, NewFakePassword )
    userEvent.type(inputNewPasswordConfirm, confirmNewFakePassword )

    userEvent.click(CheckAgreement)
    userEvent.click(buttonNew)

    // expect(fakeSignUp).toHaveBeenCalledWith(NewFakeEmail, NewFakePassword)

  });
  it.todo('should NOT register when recaptcha is unchecked')
})
