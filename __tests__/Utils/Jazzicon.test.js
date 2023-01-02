/**
 * @jest-environment jsdom
 */
import React from 'react';
import Jazzicon from '../../components/Utils/Jazzicon';
import renderer from 'react-test-renderer';
// Test cases for full balances, empty balances, and undefined balances.

const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

describe('Jazzicon', () => {
  // Test cases for
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<Jazzicon address={address} size={24} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
