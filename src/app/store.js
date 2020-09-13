import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesDuck';
import monthlyBudgetReducer from '../features/monthlyBudget/monthlyBudgetDuck';

export default configureStore({
  reducer: {
    categories: categoriesReducer,
    monthlyBudget: monthlyBudgetReducer,
  },
});
