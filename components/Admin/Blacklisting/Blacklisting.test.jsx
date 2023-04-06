/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Blacklisting from '.';
import userEvent from '@testing-library/user-event';

describe('Blacklisting', () => {
  it('should display the Blacklisting interface', async () => {
    // ARRANGE
    render(<Blacklisting claimant={'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'} />);

    // ASSERT
    const heading2 = await screen.findByText('Blacklisting');
    expect(screen.getByLabelText(/Github Issue Id/i));
    expect(screen.getByLabelText(/organization id/i));
    expect(heading2).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should allow users to blacklist issues and orgs', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Blacklisting claimant={'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'} />);

    // ASSERT
    const inputIssue = screen.getByLabelText(/Github Issue Id/i);
    const inputOrg = screen.getByLabelText(/Github Issue Id/i);
    await user.type(inputIssue, 'I_afsdfsdfw32sd');
    await user.type(inputOrg, 'MD_AF?DIwrwFD');
    const blacklistIssueButton = screen.getByRole('button', { name: /Blacklist org/i });
    const blacklistOrgRadio = screen.getByLabelText('blacklist');
    const blacklistOrgButton = screen.getByRole('button', { name: /Blacklist issue/i });

    await user.click(blacklistOrgRadio);
    await user.click(blacklistOrgButton);
    expect(await screen.findByRole('button', { name: /Blacklist org/i })).toBeInTheDocument();
    await user.click(blacklistIssueButton);
    expect(await screen.findByRole('button', { name: /Blacklist issue/i })).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
