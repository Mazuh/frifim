import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './app/store';
import GlobalContextProvider from './app/contexts';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
