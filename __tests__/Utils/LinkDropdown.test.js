// test/component/Utils/UnexpectedError.test.js
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
    const user = userEvent.setup();
    render(<LinkDropdown items={items} />);
    // ASSERT
    const view = screen.getAllByRole('link');
    expect(view[0].href).toMatch(/localhost/);
    await user.click(view[0]);
    expect(push).toHaveBeenCalledTimes(1);
  });
});
