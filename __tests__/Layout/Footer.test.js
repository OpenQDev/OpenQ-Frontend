import React from 'react';
import Footer from '../../components/Layout/Footer';
import renderer from 'react-test-renderer';

describe('Footer', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<Footer />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
