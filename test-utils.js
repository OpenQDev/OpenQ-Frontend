// Third Party
import React from 'react';
// Cusotm
import { render } from '@testing-library/react';
import StoreProvider from './store/Store/StoreProvider';

// Add in any providers here if necessary:
// test-utils.js
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({ children }) => {
	return <StoreProvider>
		{children}
	</StoreProvider>;
};

const customRender = (ui, options = {}) => render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
