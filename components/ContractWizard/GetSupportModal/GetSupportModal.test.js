/**
 * @jest-environment jsdom
 */
import React from 'react';
import GetSupportModal from '.';
import renderer from 'react-test-renderer';

describe('GetSupportModal', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<GetSupportModal modalVisibility={true} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
