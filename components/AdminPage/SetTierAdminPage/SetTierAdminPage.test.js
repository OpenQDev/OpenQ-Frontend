import React from 'react';
import { render, screen } from '../../../test-utils';
import SetTierAdminPage from '.';
import InitialState from '../../../store/Store/InitialState';
import Constants from '../../../test-utils/constant';
import userEvent from '@testing-library/user-event';
import MockOpenQClient from '../../../services/ethers/MockOpenQClient';
import { waitFor } from '@testing-library/react';
describe('SetTierAdminPage', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render nothing if bounty type is 0', async () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty0} />);

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
  it('should render nothing if bounty type is 1', async () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty1} />);
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
  it('should match DOM and render "Which token?", "Volumes:" if bounty type is 3', async () => {
    await waitFor(async () => {
      const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty3} />);

      expect(asFragment()).toMatchSnapshot();
      await expect(screen.findByText(/Which token\?/)).resolves.toBeInTheDocument();
    });
  });
  it('should allow user to update tiers on fixed bounty', async () => {
    const bounty = Constants.bounty3;
    // ARRANGE
    const user = userEvent.setup();
    const setTier = jest.fn();
    const customInitialState = {
      ...InitialState,
      openQClient: new MockOpenQClient({ setTier }),
    };
    render(<SetTierAdminPage refreshBounty={() => {}} bounty={bounty} />, {}, customInitialState);

    // ACT
    const textBoxes = screen.getAllByRole('textbox');
    await user.type(textBoxes[1], '{backspace}{backspace}{backspace}{backspace}50');

    await user.type(textBoxes[2], '{backspace}{backspace}{backspace}{backspace}30');

    await user.type(textBoxes[3], '{backspace}{backspace}{backspace}{backspace}20');

    await user.click(await screen.findByRole('button', { name: 'Set New Payout Schedule' }));

    // ASSERT
    expect(await screen.findByText(/Updating Payout Schedule.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();

    expect(await screen.findByText(/Updating Payout.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
    expect(await screen.findByText(/The payout schedule for this issue has been updated./i)).toBeInTheDocument();
    expect(await screen.findByText(/payout schedule set to/i)).toBeInTheDocument();
    expect(await screen.findByText(/1st winner:/i)).toBeInTheDocument();
    expect(await screen.findByText(/2nd winner:/i)).toBeInTheDocument();
    expect(await screen.findByText(/3rd winner:/i)).toBeInTheDocument();
    expect(await screen.findByText(/^50 Matic/i)).toBeInTheDocument();
    expect(await screen.findByText(/^30 Matic/i)).toBeInTheDocument();
    expect(await screen.findByText(/^20 Matic/i)).toBeInTheDocument();
    expect(setTier).toBeCalledWith(bounty.bountyId, ['50', '30', '20'], Constants.maticAddress);
  });
});
