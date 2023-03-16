/**
 * @jest-environment jsdom
 */
import React from 'react';

import RepoTitle from '.';
import ShallowRenderer from 'react-test-renderer/shallow';

// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('RepoTitle', () => {
  it('should render BountyDetails and match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<RepoTitle repo={{ owner: 'testing', name: 'testing' }} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
