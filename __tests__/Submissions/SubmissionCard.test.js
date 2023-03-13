/**
 * @jest-environment jsdom
 */
import React from 'react';

import SubmissionCard from '../../components/Submissions/SubmissionCard';
import Constants from '../../test-utils/constant';
import { render } from '../../test-utils/';

describe('SubmissionCard', () => {
  const bounty = { ...Constants.bounty3, claims: [], payoutSchedule: Constants.payoutSchedule3 };

  xit('should match DOM Snapshot', () => {
    const { asFragment } = render(
      <SubmissionCard bounty={bounty} pr={bounty.prs[0].source} refreshBounty={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
