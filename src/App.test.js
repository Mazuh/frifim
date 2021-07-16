import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import GlobalContextProvider from './app/contexts';
import firebase from 'firebase/app';

jest.mock('./features/auth/useRecaptcha', () => jest.fn(() => ({
  isRecaptchaVerified: true
})))

jest.mock('firebase/app', () => {
  return {
    signInWithEmailAndPassword: jest.fn(),
  };
});

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

  it('should login', () => {
    const fakeEmail = 'mari@hackers.com'
    const fakePassword = 'teste123'
    const inputEmail = screen.getByRole('textbox', { type: 'email'})
    const inputPassword = screen.getByRole('textbox', { type: 'password'})
    const button = screen.getByTestId('submit-button')
    
    fireEvent.change(inputEmail, { target: { value: fakeEmail } })
    fireEvent.change(inputPassword, { target: { value: fakePassword } })

    fireEvent.click(button)

    expect(firebase.auth().signInWithEmailAndPassword).toBeCalledWith(fakeEmail, fakePassword);
  });
  
  
  
  it.todo('should NOT login when recaptcha is unchecked')
})
