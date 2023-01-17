/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import MintBountyButton from '../../components/MintBounty/MintBountyButton';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

InitialState.openQClient.shouldSleep = 200;
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
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

  it('should open MintBountyModal on split price', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['1', '2', '3']} wizard={true} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    expect(await screen.findByText(/Deploy Split Price Contract/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Pay out a fixed amount to any contributors who submit work to this bounty, as many times as you like/i
      )
    );
  });

  it('should open MintBountyModal on contest', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyButton types={['2', '3']} />);

    // ACT
    const mintBountyButton = await screen.findByRole('button', { name: /New Contract/i });
    await user.click(mintBountyButton);
    expect(await screen.findByText(/Deploy Contest Contract/i)).toBeInTheDocument();
    expect(await screen.findByText(/Create a Contest Contract to send funds to any GitHub issue/i)).toBeInTheDocument();
    expect(screen.getByText(/How many tiers/i));
  });
});
