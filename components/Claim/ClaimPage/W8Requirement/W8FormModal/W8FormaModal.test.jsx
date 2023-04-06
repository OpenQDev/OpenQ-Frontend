import { render } from '../../../../../test-utils';
import React from 'react';
import W8FormModal from '.';

describe('W8FormModal', () => {
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<W8FormModal />);
    expect(asFragment()).toMatchSnapshot();
  });
});
