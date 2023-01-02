/**
 * @jest-environment jsdom
 */
import React from 'react';

import SubmissionCardAdmin from '../../components/Submissions/SubmissionCardAdmin';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../test-utils/constant';

describe('SubmissionCardAdmin', () => {
  const bounty = Constants.bounty;

  it('should render match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<SubmissionCardAdmin bounty={bounty} pr={bounty.prs[0].source} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
