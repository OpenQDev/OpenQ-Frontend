import React from 'react';
import FirstTimeBanner from '../../components/Layout/FirstTimeBanner';
import renderer from 'react-test-renderer';

let mockIsFirstLaunch = false;
jest.mock('../../hooks/useCheckFirstLaunch', () => {
  return jest.fn(() => [mockIsFirstLaunch, jest.fn()]);
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
