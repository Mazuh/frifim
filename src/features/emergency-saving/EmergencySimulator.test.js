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
  });

  // it('simulates new results when user changes the form', () => {
  //   const store = makeConfiguredStore();
  //   store.dispatch(
  //     monthlyBudgetPlainActions.setRead(null, [
  //       {
  //         rememberOnDashboard: true,
  //         month: new Date().getMonth(),
  //         amount: '10000.00',
  //         category: '',
  //         project: 'KO4nF9EDng0XEYI1KeOT',
  //         year: new Date().getFullYear(),
  //         name: 'salario',
  //         type: 'income',
  //         userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
  //         uuid: 'VQlo3e4frBJbUwpF4Fys',
  //       },
  //       {
  //         project: 'KO4nF9EDng0XEYI1KeOT',
  //         rememberOnDashboard: true,
  //         category: '',
  //         month: new Date().getMonth(),
  //         amount: '2000.00',
  //         name: 'nubank',
  //         year: new Date().getFullYear(),
  //         userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
  //         type: 'expense',
  //         uuid: 'WrEFWVWN0MtIxmbDavaH',
  //       },
  //     ])
  //   );

  //   const container = render(
  //     <Provider store={store}>
  //       <EmergencySimulator />
  //     </Provider>
  //   );

  //   const monthQuantityInput = container.getByLabelText('Meses para proteger:');
  //   fireEvent.change(monthQuantityInput, { target: { value: '6' } });

  //   const expensesInput = container.getByLabelText('Despesas fixas por mês:');
  //   fireEvent.change(expensesInput, { target: { value: '2.000,00' } });

  //   const recommendedEmergencyInput = container.getByLabelText('Quanto guardará todo mês:');
  //   fireEvent.change(recommendedEmergencyInput, { target: { value: '1.000,00' } });

  //   const previouslySavedAmountInput = container.getByLabelText('Quantia já guardada:');
  //   fireEvent.change(previouslySavedAmountInput, { target: { value: '5.000,00' } });

  //   expect(container.getByText(/Ao fim/i).children[0].textContent).toBe('12 meses');
  //   expect(container.getByText(/Ao fim/i).children[1].textContent).toBe('R$ 12.000,00 reservados');
  // });
});
