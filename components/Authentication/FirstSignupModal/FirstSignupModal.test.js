import { render } from '../../../test-utils';
import React from 'react';
import FirstSignupModal from '.';

describe('FirstSignupModal', () => {
  const user = {
    id: '63c58870f2943bf006029305',
    renderError: '',
    avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
    __typename: 'User',
    name: 'Anya',
    login: 'ArcAnya',
    websiteUrl: 'arcanya.com',
    url: 'https://github.com/ArcAnya',
    twitterUsername: null,
    recentLanguages: ['Dockerfile', 'JavaScript', 'CSS', 'TypeScript', 'Mustache'],
    onChainAddress: null,
    github: 'MDQ6VXNlcjc1NzMyMjM5',
    devRoles: [],
    otherRoles: ['ohia'],
    interests: [],
    languages: ['dockerfile', 'javascript', 'css', 'typescript', 'mustache', 'rust'],
    frameworks: [],
  };
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<FirstSignupModal user={user} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
