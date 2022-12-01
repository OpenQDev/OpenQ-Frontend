/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import MintBountyModalButton from '../../components/MintBounty/MintBountyModalButton';

const issues = [
  {
    status: 'mintable',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21',
  },
  {
    status: 'minted',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/221',
  },
  {
    status: 'unknown',
    url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/2190',
  },
];

const test = (issue) => {
  const mintBounty = jest.fn();
  it('should be disabled when on correct network but not mintable yet.', () => {
    // ARRANGE
    render(<MintBountyModalButton account={true} enableMint={false} isOnCorrectNetwork={true} />);

    expect(screen.getByRole('button', { name: 'Deploy Contract' }).disabled).toBe(true);
  });
  it('should disappear when enabled transaction pending.', async () => {
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
    render(
      <MintBountyModalButton
        mintBounty={mintBounty}
        account={true}
        enableMint={true}
        enableContest={true}
        issue={issue}
        isLoading={false}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(mintBounty).toBeCalled();
  });
};

describe('MintBountyModalButton', () => {
  issues.forEach((issue) => {
    test(issue);
  });
});
