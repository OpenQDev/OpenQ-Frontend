import React from 'react';
import Footer from '../../components/Layout/Footer';
import ShallowRenderer from 'react-test-renderer/shallow';
describe('Footer', () => {
  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<Footer />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
