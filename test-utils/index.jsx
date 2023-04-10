// Third party
import React from 'react';
// Cusotm
import { render, renderHook } from '@testing-library/react';
import { cleanup } from '@testing-library/react';

import StoreProvider from '../store/Store/TestStoreProvider';
import AuthProvider from '../store/AuthStore/TestAuthProvider';
import FundProvider from '../components/FundBounty/FundStore/TestFundProvider';
import TokenProvider from '../components/TokenSelection/TokenStore/TokenProvider';

// Add in any providers here if necessary:
// test-utils.js
// (ReduxProvider, ThemeProvider, etc)
afterEach(() => {
  cleanup();
});

const customRender = (ui, options = {}, storeProps, authProps) => {
  const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }));
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  const Providers = ({ children }) => {
    return (
      <AuthProvider StoreProps={authProps}>
        <StoreProvider StoreProps={storeProps}>
          <TokenProvider>{children}</TokenProvider>
        </StoreProvider>
      </AuthProvider>
    );
  };

  return render(ui, { wrapper: Providers, ...options });
};
const customHookRender = (hook, options = {}, storeProps, authProps, fundProps) => {
  const Providers = ({ children }) => {
    return (
      <AuthProvider StoreProps={authProps}>
        <StoreProvider StoreProps={storeProps}>
          <FundProvider StoreProps={fundProps}>
            <TokenProvider>{children}</TokenProvider>
          </FundProvider>
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
