import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import categoriesReducer from '../features/categories/categoriesDuck';

export default configureStore({
  reducer: {
    counter: counterReducer,
    categories: categoriesReducer,
  },
});
