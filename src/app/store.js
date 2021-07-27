import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localPersitence from "redux-persist/lib/storage";
import authReducer from '../features/auth/authDuck';
import categoriesReducer from '../features/categories/categoriesDuck';
import monthlyBudgetReducer from '../features/monthly-budget/monthlyBudgetDuck';
import weeklyBudgetReducer from '../features/weekly-budget/weeklyBudgetDuck';
import transactionsReducer from '../features/transactions/transactionsDuck';
import projectsReducer from '../features/projects/projectsDuck';

export const middleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REGISTER, PAUSE, REHYDRATE, PERSIST, PURGE],
  },
})

export const store = configureStore({
  reducer: {
    auth: persistReducer({
      key: 'auth',
      storage: localPersitence,
      blacklist: ['infoMessage', 'errorCode', 'isLoading'],
    }, authReducer),
    categories: categoriesReducer,
    monthlyBudget: monthlyBudgetReducer,
    weeklyBudget: weeklyBudgetReducer,
    transactions: transactionsReducer,
    projects: projectsReducer,
  },
  middleware,
});

export const persistor = persistStore(store);

export default store;
