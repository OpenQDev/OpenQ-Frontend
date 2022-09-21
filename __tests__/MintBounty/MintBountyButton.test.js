/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import MintBountyButton from '../../components/MintBounty/MintBountyButton';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';

InitialState.openQClient.shouldSleep = 200;

describe('MintBountyButton', () => {
  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['1', '2', '3']} wizard={true} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    expect(await screen.findByText(/we didn't find a suitable contract/i)).toBeInTheDocument();
    expect(screen.getByRole('link').href).toBe('https://discord.gg/puQVqEvVXn');
  });

  it('should open wizard and direct to competition contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['1', '2', '3']} wizard={true} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText(/Create a Contest Contract to send funds to any GitHub issue/i));
    expect(screen.getByText(/How many tiers/i));
  });

  it('should open wizard and direct to atomic contract server', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['1', '2', '3']} wizard={true} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    expect(screen.getByText(/Should only one person complete this task/i)).toBeInTheDocument();
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText(/Create a Fixed Price Contract to send funds to any GitHub issue/i));
  });
});
