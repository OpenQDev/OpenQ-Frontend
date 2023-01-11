import { render } from '../../../test-utils';
import React from 'react';
import FirstSignupModal from '.';

describe('FirstSignupModal', () => {
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<FirstSignupModal />);
    expect(asFragment()).toMatchSnapshot();
  });
});
