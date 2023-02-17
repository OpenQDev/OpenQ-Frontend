import { render, screen, waitFor } from '../../../../test-utils';
import React from 'react';
import AddSkill from '.';
import userEvent from '@testing-library/user-event';
import MockOpenQPrismaClient from '../../../../services/openq-api/MockOpenQPrismaClient';
import InitialState from '../../../../store/Store/InitialState';

describe('Add Skill', () => {
  const setInputValue = jest.fn();
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
    const { asFragment } = render(<AddSkill childInfo={['toml', 'languages']} user={user} category={'languages'} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('setInputValue to have been called', async () => {
    const currentUser = userEvent.setup();
    const updateUserMockFunc = jest.fn();
    const customInitialState = {
      ...InitialState,
      accountData: user,
      openQPrismaClient: new MockOpenQPrismaClient({ updateUserMockFunc }),
    };

    render(
      <AddSkill setInputValue={setInputValue} childInfo={['toml', 'languages']} user={user} category={'languages'} />,
      {},
      customInitialState
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(6);
    await currentUser.click(buttons[0]);
    expect(screen.getAllByRole('button').length).toBe(6);
    expect(setInputValue).toBeCalledWith('');
  });
});
