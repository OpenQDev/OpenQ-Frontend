// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import ConnectModal from '../../components/WalletConnect/ConnectModal';
import { render } from '../../test-utils';

describe('ConnectModal', () => {
  it('should render match DOM Snapshot', () => {
    const { asFragment } = render(<ConnectModal closeModal={() => {}} setShowModal={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
