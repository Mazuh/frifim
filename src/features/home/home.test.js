import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import GlobalContextProvider from '../../app/contexts';
import Home from './Home';
import { monthlyBudgetPlainActions } from '../monthly-budget/monthlyBudgetDuck';
import { monthlyTransactionsPlainActions } from '../transactions/transactionsDuck';
import { weeklyBudgetPlainActions } from '../weekly-budget/weeklyBudgetDuck';
import MockDate from 'mockdate';

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
  beforeEach(() => {
    MockDate.set(new Date('08/19/2021'));
  });

  it('renders', () => {
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

  it('weekly incomes will be considered on monthly summary multiplied by how many week days such month has', () => {
    const store = makeConfiguredStore();

    const incomeWithFiveOccurencesInGivenMonth = {
      name: 'Freela extra',
      type: 'income',
      amount: '100',
      category: '',
      day: 1,
      month: 7,
      year: 2021,
      project: 'ndBPE5akhKHBcbtHdzce',
      uuid: 'B261OiZRozfyWHumsgLX',
    };
    store.dispatch(weeklyBudgetPlainActions.setRead(null, [incomeWithFiveOccurencesInGivenMonth]));

    const container = render(
      <Provider store={store}>
        <GlobalContextProvider>
          <Home />
        </GlobalContextProvider>
      </Provider>
    );

    const budget = container.baseElement.querySelector('*[data-monthly-total="budgets"]');
    expect(budget).toBeVisible();
    expect(budget.textContent).toBe('Total dos orçamentos: R$ 500.00');
  });

  it('weekly expenses will be considered on monthly summary multiplied by how many week days such month has', () => {
    const store = makeConfiguredStore();

    const expenseWithFourOccurencesInGivenMonth = {
      name: 'Lanche',
      type: 'expense',
      amount: '50',
      category: '',
      day: 5,
      month: 7,
      year: 2021,
      project: 'ndBPE5akhKHBcbtHdzce',
      uuid: 'RRw1l5Pi4N7hVNGTcbQu',
    };
    store.dispatch(weeklyBudgetPlainActions.setRead(null, [expenseWithFourOccurencesInGivenMonth]));

    const container = render(
      <Provider store={store}>
        <GlobalContextProvider>
          <Home />
        </GlobalContextProvider>
      </Provider>
    );

    const budget = container.baseElement.querySelector('*[data-monthly-total="budgets"]');
    expect(budget).toBeVisible();
    expect(budget.textContent).toBe('Total dos orçamentos: R$ -200.00');
  });

  it('several weekly budgets will impact summary calculations along with existing monthly data', () => {
    const store = makeConfiguredStore();

    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          name: 'Sorte',
          type: 'income',
          amount: '0.50',
          category: '',
          year: 2021,
          month: 7,
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: 'CqnTV257JrveuEA73UST',
        },
        {
          name: 'Azar',
          type: 'expense',
          amount: '0.10',
          category: '',
          year: 2021,
          month: 7,
          project: 'ndBPE5akhKHBcbtHdzce',
          uuid: '6pJkoUjqIXAvpsSkg9py',
        },
      ])
    );

    const incomeWithFiveOccurencesInGivenMonth = {
      name: 'Freela extra',
      type: 'income',
      amount: '100',
      category: '',
      day: 1,
      month: 7,
      year: 2021,
      project: 'ndBPE5akhKHBcbtHdzce',
      uuid: 'B261OiZRozfyWHumsgLX',
    };
    const expenseWithFourOccurencesInGivenMonth = {
      name: 'Lanche',
      type: 'expense',
      amount: '50',
      category: '',
      day: 5,
      month: 7,
      year: 2021,
      project: 'ndBPE5akhKHBcbtHdzce',
      uuid: 'RRw1l5Pi4N7hVNGTcbQu',
    };
    store.dispatch(
      weeklyBudgetPlainActions.setRead(null, [
        incomeWithFiveOccurencesInGivenMonth,
        expenseWithFourOccurencesInGivenMonth,
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
    expect(budget.textContent).toBe('Total dos orçamentos: R$ 300.40');
  });

  it('weekly incomes will be consider the month of the income on calcs, not the month of the system', () => {
    const septemberHumanizedDate = '09/19/2021';
    MockDate.set(new Date(septemberHumanizedDate));

    const augustIndex = 7;
    const incomeWithFiveOccurencesInAugustButFourInSeptember = {
      name: 'Freela extra',
      type: 'income',
      amount: '100',
      category: '',
      day: 1,
      month: augustIndex,
      year: 2021,
      project: 'ndBPE5akhKHBcbtHdzce',
      uuid: 'B261OiZRozfyWHumsgLX',
    };

    const store = makeConfiguredStore();
    store.dispatch(
      weeklyBudgetPlainActions.setRead(null, [incomeWithFiveOccurencesInAugustButFourInSeptember])
    );

    const container = render(
      <Provider store={store}>
        <GlobalContextProvider>
          <Home />
        </GlobalContextProvider>
      </Provider>
    );

    expect(container.baseElement.querySelector('*[data-monthly-total="budgets"]').textContent).toBe(
      'Total dos orçamentos: R$ 500.00'
    );
  });
});
