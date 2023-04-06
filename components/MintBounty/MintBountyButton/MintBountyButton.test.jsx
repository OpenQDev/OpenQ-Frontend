/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import MintBountyButton from '../MintBountyButton';
import userEvent from '@testing-library/user-event';
import InitialState from '../../../store/Store/InitialState';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

InitialState.openQClient.shouldSleep = 200;
nextRouter.useRouter = vi.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: vi.fn(() => {
    return { catch: vi.fn };
  }),
}));

describe('MintBountyButton', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<MintBountyButton />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should open MintBountyModal on fixed price', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['0', '1', '2', '3']} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    expect(await screen.findByText(/Deploy Fixed Price Contract/i)).toBeInTheDocument();
    expect(screen.getByText(/Create a Fixed Price Contract to send funds to any GitHub issue/i));
  });

  it('should open MintBountyModal on contest', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['2', '3']} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    expect(await screen.findByText(/Deploy Hackathon Contract/i)).toBeInTheDocument();
    expect(await screen.findByText(/New Contract/i)).toBeInTheDocument();
    expect(screen.getByText(/How many tiers/i));
  });
});
