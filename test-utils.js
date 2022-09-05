// Third party
import React from 'react';
// Cusotm
import { render } from '@testing-library/react';
import StoreProvider from './store/Store/StoreProvider';
import AuthProvider from './store/AuthStore/AuthProvider';

// Add in any providers here if necessary:
// test-utils.js
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthProvider>
  );
};

const customRender = (ui, options = {}) => render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
