import React from 'react';
import PieChart from '../../components/Bounty/PieChart';
import renderer from 'react-test-renderer';

describe('PieChart Snapshot', () => {
  // snapshot only tests the DOM but won't test d3 specific details
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<PieChart payoutSchedule={[50, 30, 20]} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
