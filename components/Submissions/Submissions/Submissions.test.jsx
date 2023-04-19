/**
 * @vi-environment jsdom
 */
import React from 'react';

import Submissions from '.';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../../test-utils/constant';

describe('Submissions', () => {
  const bounty = Constants.bounty;

  it('should render match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<Submissions bounty={bounty} pr={bounty.prs[0]} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
