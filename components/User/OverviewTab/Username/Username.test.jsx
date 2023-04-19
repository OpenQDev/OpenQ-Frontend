import { render } from '../../../../test-utils';
import React from 'react';
import Username from '.';
import Constants from '../../../../test-utils/constant';

describe('Username', () => {
  it('should match initial DOM Snapshot for user profile page', () => {
    const { asFragment } = render(<Username user={Constants.accountData} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('should match initial DOM Snapshot for FirstSignupModal', () => {
    const { asFragment } = render(<Username user={Constants.accountData} firstSignup={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
