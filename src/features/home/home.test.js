import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import GlobalContextProvider from '../../app/contexts';
import Home from './Home';
import { monthlyBudgetPlainActions } from '../monthly-budget/monthlyBudgetDuck';

jest.mock('react-router-dom', () => ({
  Redirect: jest.fn(() => <div />),
  useHistory: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('firebase/app', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn(() => ({
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({})),
        app: {
          auth: jest.fn(() => ({
            currentUser: { displayName: 'Marcell' },
          })),
        },
      })),
      auth: jest.fn(() => ({})),
    })),
    auth: {
      GoogleAuthProvider: jest.fn(),
    },
  },
}));

jest.mock('./BudgetsChart', () => ({
  __esModule: true,
  default: jest.fn(() => <div id="budget-charts" />),
}));

describe('home', () => {
  it('remders', async () => {
    const container = render(
      <Provider store={makeConfiguredStore()}>
        <GlobalContextProvider>
          <Home />
        </GlobalContextProvider>
      </Provider>
    );
    expect(container.getByText('Início')).toBeVisible();
  });

  it('calculates monthly budget correctly, with incomes and expenses', async () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          name: 'Salário',
          type: 'income',
          amount: '1100',
          category: '',
          year: 2021,
          month: 7,
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: 'CqnTV257JrveuEA73UST',
        },
        {
          name: 'Feira de comida',
          type: 'expense',
          amount: '400',
          category: '',
          year: 2021,
          month: 7,
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: '6pJkoUjqIXAvpsSkg9py',
        },
        {
          name: 'Aluguel',
          type: 'expense',
          amount: '350',
          category: '',
          year: 2021,
          month: 7,
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: 'HdsRb2QWU2ZZf8QogMC2',
        },
        {
          name: 'Freelance',
          type: 'income',
          amount: '200',
          category: '',
          year: 2021,
          month: 7,
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: 'FYRknc6A9DwgMHTEcdrW',
        },
      ])
    );

    const container = render(
      <Provider store={store}>
        <GlobalContextProvider>
          <Home />
        </GlobalContextProvider>
      </Provider>
    );

    const budget = container.baseElement.querySelector('*[data-monthly="budget"]');
    expect(budget).toBeVisible();
    expect(budget.textContent).toBe('Total dos orçamentos: R$ 550.00');
  });

  it('calculates transactions correctly, with incomes and expenses', () => {
    // TODO
  });
});
