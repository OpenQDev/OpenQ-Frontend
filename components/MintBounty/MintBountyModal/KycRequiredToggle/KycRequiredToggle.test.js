/* @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import MintContext from '../../MintContext';
import InvoiceableToggle from '.';
// Test cases for full balances, empty balances, and undefined balances.
describe('KycRequired', () => {
  // Test cases for
  it('KycRequired', async () => {
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
  it('KycRequired', async () => {
    const mintState = {};
    const mintDispatch = jest.fn();
    // ARRANGE
    const user = userEvent.setup();
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <InvoiceableToggle />
      </MintContext.Provider>
    );

    // ASSERT
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await user.click(yesButton);
    expect(mintDispatch).toHaveBeenCalledWith({
      type: 'SET_KYC_REQUIRED',
      payload: true,
    });
  });
});
