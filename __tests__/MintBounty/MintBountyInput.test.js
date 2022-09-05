/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MintBountyInput from '../../components/MintBounty/MintBountyInput';
import userEvent from '@testing-library/user-event';

let setIssueUrlFunc;
beforeEach(() => {
  setIssueUrlFunc = jest.fn();
});
describe('MintBountyInput', () => {
  it('should display atomic header', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyInput setIssueUrl={setIssueUrlFunc} url='' />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'https://github.com/svelte/issue/3');
    expect(screen.getByText(/Enter github issue/i)).toBeInTheDocument();
    expect(setIssueUrlFunc).toHaveBeenCalledTimes(33);
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
