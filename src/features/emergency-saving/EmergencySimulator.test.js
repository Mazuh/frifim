import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import { monthlyBudgetPlainActions } from '../monthly-budget/monthlyBudgetDuck';
import EmergencySimulator from './EmergencySimulator';

describe('emergency saving simulator', () => {
  it('should simulate emergency saving', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          rememberOnDashboard: true,
          month: 11,
          amount: '10000.00',
          category: '',
          project: 'KO4nF9EDng0XEYI1KeOT',
          year: 2021,
          name: 'salario',
          type: 'income',
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          uuid: 'VQlo3e4frBJbUwpF4Fys',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: 11,
          amount: '2000.00',
          name: 'nubank',
          year: 2021,
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

    expect(container.getByLabelText('Meses protegidos:').value).toBe('3');
    expect(container.getByLabelText('Despesas fixas por mês:').value).toBe('2.000,00');
    expect(
      container.getByLabelText(
        'Valor mensal recomendado para guardar no fundo de emergência para atingir o objetivo:'
      ).value
    ).toBe('1.000,00');
    expect(container.getByLabelText('Quanto guardar por mês:').value).toBe('0,00');
  });

  it('should simulate calcs with state changes', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          rememberOnDashboard: true,
          month: 11,
          amount: '10000.00',
          category: '',
          project: 'KO4nF9EDng0XEYI1KeOT',
          year: 2021,
          name: 'salario',
          type: 'income',
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          uuid: 'VQlo3e4frBJbUwpF4Fys',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: 11,
          amount: '2000.00',
          name: 'nubank',
          year: 2021,
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

    const monthQuantityInput = container.getByLabelText('Meses protegidos:');
    fireEvent.change(monthQuantityInput, { target: { value: '6' } });

    const expensesInput = container.getByLabelText('Despesas fixas por mês:');
    fireEvent.change(expensesInput, { target: { value: '2.000,00' } });

    const recommendedEmergencyInput = container.getByLabelText(
      'Valor mensal recomendado para guardar no fundo de emergência para atingir o objetivo:'
    );
    fireEvent.change(recommendedEmergencyInput, { target: { value: '1.000,00' } });

    const previusSavedMoneyInput = container.getByLabelText('Quanto guardar por mês:');
    fireEvent.change(previusSavedMoneyInput, { target: { value: '5.000,00' } });

    expect(container.getByText(/Ao fim/i).children[0].textContent).toBe('12 meses');
    expect(container.getByText(/Ao fim/i).children[1].textContent).toBe('R$ 12.000,00 reservados');
  });
});
