/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import ShowCasePage from '../../components/ShowCase/ShowCasePage';

describe('ShowcasePage', () => {
  const pr = {
    __typename: 'PullRequest',
    mergedAt: '2022-03-28T17:57:44Z',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/138',
    merged: true,
    title: 'Update README.md',
    bodyText: 'closes #34',
    bodyHTML: 'closes #34',
    author: {
      __typename: 'User',
      login: 'FlacoJones',
      avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
      url: 'https://github.com/FlacoJones',
    },
    mergeCommit: {
      __typename: 'Commit',
      author: {
        __typename: 'GitActor',
        avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?v=4',
        name: 'FlacoJones',
        user: { __typename: 'User', login: 'FlacoJones', url: 'https://github.com/FlacoJones' },
      },
    },
  };

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render ShowcasePage', async () => {
    // ARRANGE
    render(<ShowCasePage pr={pr} />);

    // ASSERT
    expect(screen.getByText(/Update README.md/)).toBeInTheDocument();
    expect(screen.getByText(/FlacoJones/)).toBeInTheDocument();
    expect(screen.getAllByRole('link')[0].href).toBe('https://github.com/OpenQDev/OpenQ-TestRepo/pull/138');
    expect(screen.getByText(/closes #34/)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
