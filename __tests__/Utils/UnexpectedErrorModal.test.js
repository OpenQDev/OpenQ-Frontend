/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import UnexpectedErrorModal from '../../components/Utils/UnexpectedErrorModal';
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
    render(<UnexpectedErrorModal error={"I don't like bacon"} />);
    const anchorTag = await screen.findAllByRole('link');
    const githubLink = screen.queryByText(/github status/i);
    // ASSERT
    expect(await screen.findByText("Error: I don't like bacon"));
    expect(githubLink).not.toBeInTheDocument();
    expect(anchorTag[0].href).toMatch(/DISCORD/i);
  });
  it('should link to github.', async () => {
    // ARRANGE
    render(<UnexpectedErrorModal error={"I don't like Githubs bacon"} />);
    // ASSERT
    expect(await screen.findByText("Error: I don't like Githubs bacon"));
    await screen.findAllByRole('link');
    const githubLink = screen.getByText(/github status/i);
    expect(githubLink.href).toMatch(/github/);
  });
  it('should render explanation for graphql rate limit.', async () => {
    // ARRANGE
    const error = {
      graphQLErrors: [{ type: 'RATE_LIMITED', message: 'API rate limit exceeded for user ID 98236734' }],
      clientErrors: [],
      networkError: null,
      message: 'API rate limit exceeded for user ID 98236734',
    };
    render(<UnexpectedErrorModal error={error} />);
    // ASSERT
    expect(
      await screen.findByText(
        "Error: Looks like you're a power user...We're still building and have limited Github access at the moment. Please give it a rest, go get a coffee, and come back in about an hour. Your Github auth should be good by then."
      )
    );
    await screen.findAllByRole('link');
    const githubLink = screen.getByText(/discord/i);
    expect(githubLink.href).toMatch(/discord/);
  });
});
