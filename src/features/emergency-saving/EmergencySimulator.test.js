import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import { monthlyBudgetPlainActions } from '../monthly-budget/monthlyBudgetDuck';
import EmergencySimulator from './EmergencySimulator';

describe('emergency saving simulator', () => {
  it('shows default values based on user data', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          rememberOnDashboard: true,
          month: new Date().getMonth(),
          amount: '10000.00',
          category: '',
          project: 'KO4nF9EDng0XEYI1KeOT',
          year: new Date().getFullYear(),
          name: 'salario',
          type: 'income',
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          uuid: 'VQlo3e4frBJbUwpF4Fys',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: new Date().getMonth(),
          amount: '2000.00',
          name: 'nubank',
          year: new Date().getFullYear(),
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          type: 'expense',
          uuid: 'WrEFWVWN0MtIxmbDavaH',
        },
      ])
    );
    const container = render(
      <Provider store={store}>
        <EmergencySimulator />
      </Provider>
    );

    expect(container.getByLabelText('Meses para proteger:').value).toBe('3');
    expect(container.getByLabelText('Despesas fixas por mês:').value).toBe('2.000,00');
    expect(container.getByLabelText('Quanto guardará todo mês:').value).toBe('1.000,00');
    expect(container.getByLabelText('Quantia já guardada:').value).toBe('0,00');

    expect(container.getByText(/Você precisa de/, { selector: 'p' }).textContent).toBe(
      'Você precisa de uma reserva total de R$ 6.000,00.Ao fim de 6 meses, você terá pelo menos R$ 6.000,00 reservados para emergência.'
    );
  });

  it('simulates new results when user changes the form', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          rememberOnDashboard: true,
          month: new Date().getMonth(),
          amount: '2400.00',
          category: '',
          project: 'KO4nF9EDng0XEYI1KeOT',
          year: new Date().getFullYear(),
          name: 'Salário',
          type: 'income',
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          uuid: 'VQlo3e4frBJbUwpF4Fys',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: new Date().getMonth(),
          amount: '200.00',
          name: 'Energia',
          year: new Date().getFullYear(),
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          type: 'expense',
          uuid: 'WrEFWVWN0MtIxmbDavaH',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: new Date().getMonth(),
          amount: '500.00',
          name: 'Feira',
          year: new Date().getFullYear(),
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          type: 'expense',
          uuid: 'WrEFWVWN0MtfffffIxmbDavaH',
        },
      ])
    );

    const container = render(
      <Provider store={store}>
        <EmergencySimulator />
      </Provider>
    );

    const monthQuantityInput = container.getByLabelText('Meses para proteger:');
    fireEvent.change(monthQuantityInput, { target: { value: '6' } });

    expect(container.getByLabelText('Despesas fixas por mês:').value).toBe('700,00');

    fireEvent.change(container.getByLabelText('Quanto guardará todo mês:'), {
      target: { value: '240,00' },
    });

    fireEvent.change(container.getByLabelText('Quantia já guardada:'), {
      target: { value: '1,00' },
    });

    expect(container.getByText(/Você precisa de/, { selector: 'p' }).textContent).toBe(
      'Você precisa de uma reserva total de R$ 4.200,00.Ao fim de 18 meses, você terá pelo menos R$ 4.321,00 reservados para emergência.'
    );
  });

  it('asks for required data when there are not default values', () => {
    const store = makeConfiguredStore();

    const container = render(
      <Provider store={store}>
        <EmergencySimulator />
      </Provider>
    );

    expect(container.getByText(/Por favor, informe/, { selector: 'span' }).textContent).toBe(
      'Por favor, informe pelo menos os valores de meses para proteger, despesas fixas por mês para obter um resultado.'
    );
  });

  it('shows message about the previously saved money is already enough', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          rememberOnDashboard: true,
          month: new Date().getMonth(),
          amount: '2400.00',
          category: '',
          project: 'KO4nF9EDng0XEYI1KeOT',
          year: new Date().getFullYear(),
          name: 'Salário',
          type: 'income',
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          uuid: 'VQlo3e4frBJbUwpF4Fys',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: new Date().getMonth(),
          amount: '200.00',
          name: 'Energia',
          year: new Date().getFullYear(),
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          type: 'expense',
          uuid: 'WrEFWVWN0MtIxmbDavaH',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: new Date().getMonth(),
          amount: '500.00',
          name: 'Feira',
          year: new Date().getFullYear(),
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          type: 'expense',
          uuid: 'WrEFWVWN0MtfffffIxmbDavaH',
        },
      ])
    );

    const container = render(
      <Provider store={store}>
        <EmergencySimulator />
      </Provider>
    );

    const monthQuantityInput = container.getByLabelText('Meses para proteger:');
    fireEvent.change(monthQuantityInput, { target: { value: '3' } });

    expect(container.getByLabelText('Despesas fixas por mês:').value).toBe('700,00');

    fireEvent.change(container.getByLabelText('Quanto guardará todo mês:'), {
      target: { value: '240,00' },
    });

    fireEvent.change(container.getByLabelText('Quantia já guardada:'), {
      target: { value: '2500,00' },
    });

    expect(container.getByText(/A quantia já guardada/, { selector: 'span' }).textContent).toBe(
      'A quantia já guardada é suficiente para os meses que você deseja proteger.'
    );
  });
});
