/**
 * @jest-environment jsdom
 */
import React from 'react';

import AboutTitle from '../../../../components/User/OverviewTab/AboutTitle';
import renderer from 'react-test-renderer';

describe('AboutTitle', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(
      <AboutTitle
        ensName={null}
        account={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
        githubUser={{ login: 'Christopher-Stevers', avatarUrl: 'https://github.com/Deep1144' }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
