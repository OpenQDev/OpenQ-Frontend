/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AvatarPack from '../../components/Utils/AvatarPack';
import nextRouter from 'next/router';
import userEvent from '@testing-library/user-event';
// Test cases for full balances, empty balances, and undefined balances.

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});

describe('AvatarPack', () => {
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
  it('should show org name on hover', async () => {
    // ARRANGE
    const user = userEvent.setup();

    render(
      <AvatarPack
        avatars={[
          {
            login: 'OpenQDev',
            url: 'https://github.com/OpenQDev',
            avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4',
          },
        ]}
      />
    );
    // ASSERT
    await user.hover(screen.getByTestId('link'));
    expect(screen.getByText('OpenQDev')).toBeInTheDocument();
  });

  it('should have link with correct url', async () => {
    // ARRANGE

    render(
      <AvatarPack
        avatars={[
          {
            login: 'OpenQDev',
            url: 'https://github.com/OpenQDev',
            avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4',
          },
        ]}
      />
    );
    // ASSERT
    expect(screen.getByTestId('link')).toBeInTheDocument();
  });
});
