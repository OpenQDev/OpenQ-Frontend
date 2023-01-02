/**
 * @jest-environment jsdom
 */
import React from 'react';
import AvatarPack from '../../components/Utils/AvatarPack';
import renderer from 'react-test-renderer';
// Test cases for full balances, empty balances, and undefined balances.

describe('AvatarPack', () => {
  // Test cases for
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(
      <AvatarPack
        avatars={[
          {
            login: 'OpenQDev',
            url: 'https://github.com/OpenQDev',
            avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4',
          },
        ]}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
