import React from 'react';
import ButtonLoadingIcon from '../../components/Loading/ButtonLoadingIcon';
import renderer from 'react-test-renderer';

describe('ButtonLoadingIcon', () => {
  it('should show graph and match DOM Snapshot', () => {
    const tree = renderer.create(<ButtonLoadingIcon graph={true} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should show purple border when no graph and bg white and match DOM Snapshot', () => {
    const tree = renderer.create(<ButtonLoadingIcon graph={false} bg={'white'} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should show white border when no graph and bg not white and match DOM Snapshot', () => {
    const tree = renderer.create(<ButtonLoadingIcon graph={false} bg={'other'} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
