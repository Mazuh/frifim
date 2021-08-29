import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './app/store';
import GlobalContextProvider from './app/contexts';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
