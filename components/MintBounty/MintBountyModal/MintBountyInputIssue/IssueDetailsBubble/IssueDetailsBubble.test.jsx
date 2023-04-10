/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../../../test-utils';
import IssueDetailsBubble from '../../../MintBountyModal/MintBountyInputIssue/IssueDetailsBubble';
import MintContext from '../../../MintContext';
import InitialMintState from '../../../InitialMintState';
import { cleanup } from '@testing-library/react';

describe('IssueDetailsBubble', () => {
  afterEach(() => {
    cleanup();
  });

  const mintableIssue = {
    __typename: 'Issue',
    closed: false,
    title: 'Mintable issue',
    body: 'This is a good first issue',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21',
    number: '21',
    languages: {
      __typename: 'LanguageConnection',
      edges: [
        {
          __typename: 'LanguageEdge',
          node: {
            __typename: 'Language',
            name: 'JavaScript',

            color: 'yellow',
          },
        },
      ],
    },
    id: 'I_kwDOGWnnz85I9Agl',
    titleHTML: 'Good Mintable issue',
    bodyHTML: '<p dir="auto">This is a good mintabvle issue</p>',
    assignees: {
      __typename: 'UserConnection',
      nodes: [],
    },
    labels: {
      __typename: 'LabelConnection',
      edges: [],
    },
    createdAt: '2022-05-03T16:44:14Z',
    repository: {
      __typename: 'Repository',
      id: 'R_kgDOGWnnzw',
      name: 'OpenQ-TestRepo',
      languages: {
        __typename: 'LanguageConnection',
        edges: [],
      },
      owner: {
        __typename: 'Organization',
        login: 'OpenQDev',
        avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
        url: 'https://github.com/OpenQDev',
      },
    },
    timelineItems: {
      edges: [],
    },
  };
  const unmintableIssue = {
    __typename: 'Issue',
    closed: true,
    title: 'Mintable issue',
    body: 'This is a good first issue',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21',
    number: '21',
    languages: {
      __typename: 'LanguageConnection',
      edges: [
        {
          __typename: 'LanguageEdge',
          node: {
            __typename: 'Language',
            name: 'JavaScript',

            color: 'yellow',
          },
        },
      ],
    },
    id: 'I_kwDOGWnnz85I9Agl',
    titleHTML: 'Good Mintable issue',
    bodyHTML: '<p dir="auto">This is a good mintabvle issue</p>',
    assignees: {
      __typename: 'UserConnection',
      nodes: [],
    },
    labels: {
      __typename: 'LabelConnection',
      edges: [],
    },
    createdAt: '2022-05-03T16:44:14Z',
    repository: {
      __typename: 'Repository',
      id: 'R_kgDOGWnnzw',
      name: 'OpenQ-TestRepo',
      languages: {
        __typename: 'LanguageConnection',
        edges: [],
      },
      owner: {
        __typename: 'Organization',
        login: 'OpenQDev',
        avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
        url: 'https://github.com/OpenQDev',
      },
    },
    timelineItems: {
      edges: [],
    },
  };

  it('should display mintable issue', () => {
    const mintState = {
      ...InitialMintState.mintState,
      enableRegistration: true,
      issue: mintableIssue,
    };
    const mintDispatch = vi.fn();
    // ARRANGE
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <IssueDetailsBubble issueData={mintableIssue} />
      </MintContext.Provider>
    );

    expect(screen.getByText('Created on May 3, 2022 at 16:44')).toBeInTheDocument();
    expect(screen.getByText(/Mintable Issue/i)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display unmintable issue', () => {
    const mintState = {
      ...InitialMintState.mintState,
      enableRegistration: true,
      issue: unmintableIssue,
    };
    const mintDispatch = vi.fn();
    // ARRANGE
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <IssueDetailsBubble issueData={mintableIssue} />
      </MintContext.Provider>
    );

    expect(screen.getByText('Created on May 3, 2022 at 16:44')).toBeInTheDocument();
    expect(screen.getByText(/Mintable Issue/i)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
