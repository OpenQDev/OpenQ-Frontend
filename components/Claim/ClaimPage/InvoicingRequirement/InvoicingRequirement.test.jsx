/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import InvoicingRequirement from '.';
import InitialState from '../../../../store/Store/InitialState';
import Constants from '../../../../test-utils/constant';
describe('InvoicingRequirement', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  it('should render InvoicingRequirement', async () => {
    // ARRANGE
    const bounty = { ...Constants.bounty, invoiceRequired: true };
    render(<InvoicingRequirement bounty={bounty} />);
    expect(await screen.findByText(/How to use OpenQ's Invoice Generator/)).toBeInTheDocument();
  });
});
