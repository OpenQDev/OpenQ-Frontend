// Third party
import React from 'react';
// Cusotm
import { render } from '@testing-library/react';
import StoreProvider from '../store/Store/TestStoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';

// Add in any providers here if necessary:
// test-utils.js
// (ReduxProvider, ThemeProvider, etc)
const customRender = (ui, options = {}, storeProps) => {
  const Providers = ({ children }) => {
    return (
      <AuthProvider>
        <StoreProvider StoreProps={storeProps}>{children}</StoreProvider>
      </AuthProvider>
    );
  };

  render(ui, { wrapper: Providers, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
