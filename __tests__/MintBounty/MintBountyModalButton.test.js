/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import MintBountyModalButton from '../../components/MintBounty/MintBountyModalButton';

describe('MintBountyModalButton', () => {
  const mintBounty = jest.fn();
  it('should be able to be disabled.', () => {
    // ARRANGE
    render(<MintBountyModalButton account={true} enableMint={false} />);

    expect(screen.getByRole('button', { name: 'Deploy Contract' }).disabled).toBe(true);
  });
  it('should work when enabled.', async () => {
    // ARRANGE
    render(
      <MintBountyModalButton mintBounty={mintBounty} account={true} enableMint={true} transactionPending={true} />
    );
    const button = screen.queryByRole('button', { name: 'Deploy Contract' });
    expect(button).not.toBeInTheDocument();
  });
  it('should work when enabled.', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyModalButton mintBounty={mintBounty} account={true} enableMint={true} />);

    await user.click(screen.getByRole('button'));
    expect(mintBounty).toBeCalled();
  });
});
