// test/component/Utils/UnexpectedError.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.

describe('Error Modal', () => {
  // Test cases for
  let push;
  beforeEach(() => {
    push = jest.fn(() => {
      return { catch: jest.fn };
    });
    process.env.BASE_URL = 'http://localhost:3000';
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));

    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should link to homepage.', async () => {
    // ARRANGE
    render(<UnexpectedError error={"I don't like bacon"} />);
    const anchorTag = await screen.findByRole('link');
    const githubLink = screen.queryByText(/github status/i);
    // ASSERT
    expect(screen.getByText("Sorry, something went wrong. I don't like bacon"));
    expect(githubLink).not.toBeInTheDocument();
    expect(anchorTag.href).toMatch(/localhost/);
  });
  it('should link to github.', async () => {
    // ARRANGE
    render(<UnexpectedError error={"I don't like Githubs bacon"} />);
    // ASSERT
    expect(screen.getByText("Sorry, something went wrong. I don't like Githubs bacon"));
    await screen.findAllByRole('link');
    const githubLink = screen.getByText(/github status/i);
    expect(githubLink.href).toMatch(/github/);
  });
});
