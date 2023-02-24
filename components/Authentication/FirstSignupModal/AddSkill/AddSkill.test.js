import { render, screen } from '../../../../test-utils';
import React from 'react';
import AddSkill from '.';

describe('Add Skill', () => {
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
    const setRolesInCategoriesState = jest.fn();
    const rolesInCategoriesState = [{ languages: user.languages }, setRolesInCategoriesState];
    const { asFragment } = render(
      <AddSkill
        rolesInCategoriesState={rolesInCategoriesState}
        childInfo={['toml', 'languages']}
        user={user}
        category={'languages'}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it.only('setInputValue to have been called', async () => {
    const setRolesInCategoriesState = jest.fn();
    const rolesInCategoriesState = [{ languages: user.languages }, setRolesInCategoriesState];
    render(<AddSkill rolesInCategoriesState={rolesInCategoriesState} category={'languages'} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(6);
    //    await currentUser.click(buttons[0]);
    //  expect(screen.getAllByRole('button').length).toBe(6);
    //expect(setInputValue).toBeCalledWith('');
  });
});
