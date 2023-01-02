import React from 'react';
import SmallToggle from '../../components/Utils/SmallToggle';
import renderer from 'react-test-renderer';

const names = ['Ready for work', 'All issues'];

describe('SmallToggle', () => {
  it('should atch DOM Snapshot', () => {
    const tree = renderer.create(<SmallToggle names={names} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
