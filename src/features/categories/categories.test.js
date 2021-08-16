import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import GlobalContextProvider from '../../app/contexts';
import CategoriesView from './CategoriesView';

describe('categories', () => {
  it('renders', async () => {
    const container = render(
      <Provider store={makeConfiguredStore()}>
        <GlobalContextProvider>
          <CategoriesView />
        </GlobalContextProvider>
      </Provider>
    );
    expect(container.getByText('Categorias')).toBeVisible();
  });
});
