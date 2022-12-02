/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MintBountyInputIssue from '../../components/MintBounty/MintBountyInputIssue';
import userEvent from '@testing-library/user-event';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';

let setIssueUrlFunc;
beforeEach(() => {
  setIssueUrlFunc = jest.fn();
});
describe('MintBountyInput', () => {
  const issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
  it('should display atomic header', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyInputIssue issue={issueData} setIssueUrl={setIssueUrlFunc} url='' />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'https://github.com/svelte/issue/3');
    expect(screen.getByText(/Enter github issue/i)).toBeInTheDocument();
    expect(setIssueUrlFunc).toHaveBeenCalledTimes(33);
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
