import React from 'react';
import FirstTimeBanner from '.';
import renderer from 'react-test-renderer';

let mockIsFirstLaunch = false;
vi.mock('../../hooks/useCheckFirstLaunch', () => {
  return vi.fn(() => [mockIsFirstLaunch, vi.fn()]);
});

describe('FirstTimeBanner', () => {
  it('should show nothing', () => {
    const tree = renderer.create(<FirstTimeBanner />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should show the Banner and match DOM Snapshot', () => {
    mockIsFirstLaunch = true;
    const tree = renderer.create(<FirstTimeBanner />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
