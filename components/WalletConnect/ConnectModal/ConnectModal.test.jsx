// test/component/WatchButton/WatchButton.test
/**
 * @vi-environment jsdom
 */
import React from 'react';
import ConnectModal from '.';
import { render } from '../../../test-utils';

describe('ConnectModal', () => {
  it('should render match DOM Snapshot', () => {
    const { asFragment } = render(<ConnectModal closeModal={() => {}} setShowModal={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
