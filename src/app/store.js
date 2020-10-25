import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesDuck';
import monthlyBudgetReducer from '../features/monthly-budget/monthlyBudgetDuck';
import weeklyBudgetReducer from '../features/weekly-budget/weeklyBudgetDuck';
import transactionsReducer from '../features/transactions/transactionsDuck';

export default configureStore({
  reducer: {
    categories: categoriesReducer,
    monthlyBudget: monthlyBudgetReducer,
    weeklyBudget: weeklyBudgetReducer,
    transactions: transactionsReducer,
  },
});
