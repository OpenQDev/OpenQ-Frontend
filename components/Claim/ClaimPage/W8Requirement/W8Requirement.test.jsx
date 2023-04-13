import { render } from '../../../../test-utils';
import React from 'react';
import W8Requirement from '.';
import Constants from '../../../../test-utils/constant';

describe('W8Requirement', () => {
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<W8Requirement bounty={Constants.bounty3} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
