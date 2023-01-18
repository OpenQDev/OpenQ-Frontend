import { render } from '../../../test-utils';
import React from 'react';
import KycRegistration from '.';

describe('KycRegistration', () => {
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<KycRegistration />);
    expect(asFragment()).toMatchSnapshot();
  });
});
