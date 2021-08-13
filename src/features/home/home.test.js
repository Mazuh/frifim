import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import GlobalContextProvider from '../../app/contexts';
import Home from './Home';
import { monthlyBudgetPlainActions } from '../monthly-budget/monthlyBudgetDuck';
import { monthlyTransactionsPlainActions } from '../transactions/transactionsDuck';

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
  it('renders', async () => {
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
          amount: '1100.15',
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

    const budget = container.baseElement.querySelector('*[data-monthly-total="budgets"]');
    expect(budget).toBeVisible();
    expect(budget.textContent).toBe('Total dos orçamentos: R$ 550.15');
  });

  it('calculates transactions correctly, with incomes and expenses', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyTransactionsPlainActions.setRead(null, [
        {
          name: 'Feira de comida',
          project: 'ndBPE5akhKHBcbtHdzce',
          category: '',
          amount: '400',
          datetime: '2021-08-13T01:54:44.189Z',
          type: 'expense',
          userUid: 'u2PlChlGs2eXS0cFKSlGEtdHuMq2',
          uuid: '2iIR8VYfvhayrggzP6Ve',
        },
        {
          datetime: '2021-08-13T01:54:44.189Z',
          category: '',
          project: 'ndBPE5akhKHBcbtHdzce',
          amount: '1100.15',
          type: 'income',
          name: 'Salário',
          userUid: 'u2PlChlGs2eXS0cFKSlGEtdHuMq2',
          uuid: 'G4pj5sJLIa8KUkkHDNI4',
        },
        {
          userUid: 'u2PlChlGs2eXS0cFKSlGEtdHuMq2',
          type: 'income',
          datetime: '2021-08-13T01:54:44.189Z',
          amount: '200',
          name: 'Freelance',
          category: '',
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: 'jb8O9ccB1TbvXQBTwN2f',
        },
        {
          userUid: 'u2PlChlGs2eXS0cFKSlGEtdHuMq2',
          name: 'Aluguel',
          amount: '350',
          type: 'expense',
          project: 'ndBPE5akhKHBcbtHdzce',
          category: '',
          datetime: '2021-08-13T01:54:44.189Z',
          uuid: 'yEayEz1YlQAKrttocTsr',
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

    const budget = container.baseElement.querySelector('*[data-monthly-total="transactions"]');
    expect(budget).toBeVisible();
    expect(budget.textContent).toBe('Total das transações: R$ 550.15');
  });
});
