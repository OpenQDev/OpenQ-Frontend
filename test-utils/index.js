// Third party
import React from 'react';
// Cusotm
import { render, renderHook } from '@testing-library/react';

import StoreProvider from '../store/Store/TestStoreProvider';
import AuthProvider from '../store/AuthStore/TestAuthProvider';
import FundProvider from '../components/FundBounty/TestFundProvider';

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
const customHookRender = (hook, options = {}, storeProps, authProps, fundProps) => {
  const Providers = ({ children }) => {
    return (
      <AuthProvider StoreProps={authProps}>
        <StoreProvider StoreProps={storeProps}>
          <FundProvider StoreProps={fundProps}> {children}</FundProvider>
        </StoreProvider>
      </AuthProvider>
    );
  };

  return renderHook(hook, { wrapper: Providers, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, customHookRender as hookRender };
