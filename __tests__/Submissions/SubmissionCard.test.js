/**
 * @jest-environment jsdom
 */
import React from 'react';

import SubmissionCard from '../../components/Submissions/SubmissionCard';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../test-utils/constant';

describe('SubmissionCard', () => {
  const bounty = { ...Constants.bounty, claims: [] };

  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<SubmissionCard bounty={bounty} pr={bounty.prs[0].source} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
