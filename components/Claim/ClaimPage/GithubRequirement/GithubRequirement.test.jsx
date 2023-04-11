/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import GithubRequirement from '.';
import InitialState from '../../../../store/Store/InitialState';
describe('GithubRequirement', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  it('should render GithubRequirement', async () => {
    // ARRANGE
    const setGithubHasWalletVerified = vi.fn();
    const githubHasWalletVerifiedState = [false, setGithubHasWalletVerified];
    render(<GithubRequirement githubHasWalletVerifiedState={githubHasWalletVerifiedState} />);
    expect(await screen.findByText(/Github profile not signed in./)).toBeInTheDocument();
    expect(await screen.findByText(/Associate your GitHub account to an Ethereum address/)).toBeInTheDocument();
  });
});
