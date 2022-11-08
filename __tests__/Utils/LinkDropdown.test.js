/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import LinkDropdown from '../../components/Utils/LinkDropdown';
import userEvent from '@testing-library/user-event';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});

describe('LinkDropdown', () => {
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
  const items = [
    { name: 'View', url: '/' },
    { name: 'Fund', url: '/asd' },
  ];
  it('should display LinkDropdown', async () => {
    // ARRANGE
    render(<LinkDropdown items={items} />);
    // ASSERT
    expect(screen.getAllByTestId('link')[0]).toBeInTheDocument();
  });
});
