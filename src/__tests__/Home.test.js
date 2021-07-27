import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' //ES6 modules
import GlobalContextProvider from '../app/contexts';
import App  from '../App';
import * as firebase from '../app/firebase-configs';
import initialStore from './fixtures/store.json'
import { middleware } from '../app/store'

const mockStore = configureStore(middleware)

jest.spyOn(firebase, 'onIdTokenChanged').mockImplementation(() => jest.fn())

const spyFirebaseCollection = jest.spyOn(firebase.firedb, 'collection')

describe('/inicio', () => {
  beforeEach(() => {
    const store = mockStore(initialStore)

    render(
      <Provider store={store}>
        <GlobalContextProvider>
          <App />
        </GlobalContextProvider>
      </Provider>
    )
  })
  
  afterEach(() => jest.restoreAllMocks())

  it('should show budget', () => {
    expect(spyFirebaseCollection).toHaveBeenCalledWith('monthly_budgets')

    screen.getByText('R$ 494310.60')
  });
})
