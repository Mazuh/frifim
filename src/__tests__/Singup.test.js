import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux';
import store from '../app/store';
import SignupView from "..//features/auth/SignupView";
import GlobalContextProvider from '../app/contexts';



describe('/', () => {
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
    
    const NewFakeName = "Test"
    const NewFakeEmail = 'newElement@test.com'
    const NewFakePassword = 'test123'
    const confirmNewFakePassword = 'test123'

    const inputNewName = screen.getByTestId('displayName')
    const inputNewEmail =  screen.getByTestId('email')
    const inputNewPassword = screen.getByTestId('password')
    const inputNewPasswordConfirm = screen.getByTestId('passwordConfirmation')

    const CheckAgreement = screen.getByTestId('agreement')
    const buttonNew = screen.getByTestId('button-submit')

    
    userEvent.type(inputNewEmail, NewFakeEmail )
    userEvent.type(inputNewName, NewFakeName )
    userEvent.type(inputNewPassword, NewFakePassword )
    userEvent.type(inputNewPasswordConfirm, confirmNewFakePassword )

    userEvent.click(CheckAgreement)
    userEvent.click(buttonNew)


  });
  it.todo('should NOT register when recaptcha is unchecked')
})
