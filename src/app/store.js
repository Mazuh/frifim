import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesDuck';
import monthlyBudgetReducer from '../features/monthly-budget/monthlyBudgetDuck';

export default configureStore({
  reducer: {
    categories: categoriesReducer,
    monthlyBudget: monthlyBudgetReducer,
  },
});
