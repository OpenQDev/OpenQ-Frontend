// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import ConnectModal from '../../components/WalletConnect/ConnectModal';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('ConnectModal', () => {
  it('should render match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<ConnectModal />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
