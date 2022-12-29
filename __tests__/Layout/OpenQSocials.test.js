import React from 'react';
import OpenQSocials from '../../components/Layout/OpenQSocials';
import renderer from 'react-test-renderer';

describe('OpenQSocials', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<OpenQSocials />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
