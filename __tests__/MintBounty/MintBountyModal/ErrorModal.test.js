import React from 'react';
import ErrorModal from '../../../components/MintBounty/MintBountyModal/ErrorModal';
import renderer from 'react-test-renderer';

describe('ErrorModal', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<ErrorModal error={{ title: 'Error', message: 'My error message' }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
