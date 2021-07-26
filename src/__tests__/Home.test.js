import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import GlobalContextProvider from '../app/contexts';
import App  from '../App';
import store  from '../app/store';
import { authSlice } from '../features/auth/authDuck';
import * as firebase from '../app/firebase-configs';
import * as selectorMonthlyBudget from '../features/monthly-budget/useSelectorForMonthlyBudgetStatus'

const mockBasicRequestData = {
  month: 6,
  project: {
      createdAt: "2021-07-18T23:31:00.842Z",
      name: "Principal",
      userUid: "QovcZZVRTrd9Fq3glumc734pLrz1",
      uuid: "iRqmxVou7FVNfPTbZXOW"
  },
  user: { displayName: "Marizinha", email: "teste@teste.com", uid: 123123 },
  year: 2021,
}

const mockIncomes = {
  "total": {
    toString() {
      return "86.6"
    },
    isZero() {
      return false
    },
    lessThan() {
      return false
    },
    toFixed(...args){
      return Number(this.toString()).toFixed(...args)
    }
  },
  "totalIncomes": "19.52",
  "totalExpenses": "23.92"
}

jest.mock('../app/useBasicRequestData', () => jest.fn(() => mockBasicRequestData))
jest.spyOn(firebase, 'onIdTokenChanged').mockImplementation(() => jest.fn())

jest.spyOn(selectorMonthlyBudget, 'getMonthlyCalcs').mockImplementation(() => (mockIncomes))

const spyFirebaseCollection = jest.spyOn(firebase.firedb, 'collection')

describe('/inicio', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <GlobalContextProvider testProps={{ initialProject: mockBasicRequestData.project }}>
          <App />
        </GlobalContextProvider>
      </Provider>
    )

    store.dispatch(authSlice.actions.setUser(mockBasicRequestData.user))
  })
  
  afterEach(() => jest.restoreAllMocks())

  it('should show budget', () => {
    expect(spyFirebaseCollection).toHaveBeenCalledWith('monthly_budgets')

    screen.getByText('R$ 86.60')
  });
})
