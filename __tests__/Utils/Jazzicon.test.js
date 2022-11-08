/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Jazzicon from '../../components/Utils/Jazzicon';
import nextRouter from 'next/router';
import userEvent from '@testing-library/user-event';
// Test cases for full balances, empty balances, and undefined balances.

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});
const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

describe('Jazzicon', () => {
  // Test cases for

  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });
  it('should display address and have link', async () => {
    // ARRANGE
    const user = userEvent.setup();

    render(<Jazzicon address={address} size={24} />);
    // ASSERT
    const icon = screen.getAllByTestId('link');
    const toolTip = screen.getByText(address);
    expect(icon[0]).toBeInTheDocument();
    expect(toolTip).toBeInTheDocument();
  });
});
