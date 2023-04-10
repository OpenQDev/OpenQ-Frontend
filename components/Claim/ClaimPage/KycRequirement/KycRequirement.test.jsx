/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import KycRequirement from '.';
import InitialState from '../../../../store/Store/InitialState';
describe('KycRequirement', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  it('should kycrequirement', async () => {
    // ARRANGE
    const setKycVerified = vi.fn();
    render(<KycRequirement setKycVerified={setKycVerified} />);
    expect(
      await screen.findByText(/kycDAO is a multichain platform for issuing reusable, on-chain KYC verifications./)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Required/)).toBeInTheDocument();
    expect(await screen.findByText(/Verify/)).toBeInTheDocument();
  });
});
