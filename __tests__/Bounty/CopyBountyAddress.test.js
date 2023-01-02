/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import CopyBountyAddress from '../../components/Bounty/CopyBountyAddress';
import Constants from '../../test-utils/constant';
import userEvent from '@testing-library/user-event';

describe('CopyBountyAddress', () => {
  const bounty = Constants.bounty;

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render CopyBountyAddress', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<CopyBountyAddress address={bounty.bountyAddress} />);
    const addressRegex = new RegExp(bounty.bountyAddress.slice(0, 3));

    // ASSERT
    expect(screen.getByText(addressRegex));
    await user.click(screen.getByText(/0x3c57cd5933/i));
    expect(await screen.findByTestId('checkmark')).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
