// Third party
import React from 'react';
// Cusotm
import { render } from '@testing-library/react';
import StoreProvider from '../store/Store/TestStoreProvider';
import AuthProvider from '../store/AuthStore/TestAuthProvider';

// Add in any providers here if necessary:
// test-utils.js
// (ReduxProvider, ThemeProvider, etc)
const customRender = (ui, options = {}, storeProps, authProps) => {
  const Providers = ({ children }) => {
    return (
      <AuthProvider StoreProps={authProps}>
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
