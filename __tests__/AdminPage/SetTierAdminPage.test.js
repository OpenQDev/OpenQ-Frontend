import { render } from '../../test-utils';
import React from 'react';
import SetTierAdminPage from '../../components/AdminPage/SetTierAdminPage';
import Constants from '../../test-utils/constant';

describe('SetTierAdminPage', () => {
  it('should render nothing if bounty type is 0', () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty0} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('should render nothing if bounty type is 1', () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty1} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('should match DOM and render "Weight per Tier (%)", "1st place winner" etc. if bounty type is 2', () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty2} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('should match DOM and render "Which token?", "Volumes:" if bounty type is 3', () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty3} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
