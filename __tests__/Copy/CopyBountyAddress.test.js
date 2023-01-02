/**
 * @jest-environment jsdom
 */
import React from 'react';
import CopyAddressToClipboard from '../../components/Copy/CopyAddressToClipboard';
import renderer from 'react-test-renderer';

describe('CopyAddressToClipboard', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<CopyAddressToClipboard clipping={[2, 4]} data='patters' />);
    expect(tree.toJSON()).toMatchSnapshot('and show pa ... ers');
  });

  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<CopyAddressToClipboard data='pat' />);
    expect(tree.toJSON()).toMatchSnapshot('and show pat');
  });
});
