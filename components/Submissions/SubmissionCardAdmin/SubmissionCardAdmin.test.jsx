/**
 * @vi-environment jsdom
 */
import React from 'react';

import SubmissionCardAdmin from '.';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../../test-utils/constant';

describe('SubmissionCardAdmin', () => {
  const bounties = [
    { ...Constants.bounty2, prs: Constants.prs },
    { ...Constants.bounty3, prs: Constants.prs },
  ];

  const test = (bounty) => {
    it('should render match DOM Snapshot', () => {
      const shallow = new ShallowRenderer();
      shallow.render(<SubmissionCardAdmin bounty={bounty} pr={bounty.prs[0].source} />);
      const tree = shallow.getRenderOutput();
      expect(tree).toMatchSnapshot();
    });
  };

  bounties.forEach((bounty) => {
    test(bounty);
  });
});
