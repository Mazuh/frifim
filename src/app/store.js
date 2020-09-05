import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesDuck';

export default configureStore({
  reducer: {
    categories: categoriesReducer,
  },
});
