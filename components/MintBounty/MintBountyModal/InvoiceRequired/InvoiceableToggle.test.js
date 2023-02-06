/* @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import InvoiceableToggle from '.';
import MintContext from '../../MintContext';
import userEvent from '@testing-library/user-event';
// Test cases for full balances, empty balances, and undefined balances.
describe('InvoiceableRequired', () => {
  // Test cases for
  it('should display invoiceable toggle', async () => {
    const mintState = {};
    const mintDispatch = jest.fn();
    // ARRANGE
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <InvoiceableToggle />
      </MintContext.Provider>
    );

    // ASSERT
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });
  it('should let user update invoiceable toggle', async () => {
    const mintState = {};
    const mintDispatch = jest.fn();
    // ARRANGE
    const user = userEvent.setup();
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <InvoiceableToggle />
      </MintContext.Provider>
    );

    // ASSERT   // ASSERT
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await user.click(yesButton);
    expect(mintDispatch).toHaveBeenCalledWith({
      type: 'SET_INVOICEABLE',
      payload: true,
    });
  });
});
