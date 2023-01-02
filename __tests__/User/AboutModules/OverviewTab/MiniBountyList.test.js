/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../../test-utils';
import MiniBountyList from '../../../../components/User/OverviewTab/MiniBountyList';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('MiniBountyList', () => {
  const payouts = [
    {
      bounty: {
        bountyId: 'I_kwDOGWnnz85I9Agl',
        issuer: {
          id: '0x46e09468616365256f11f4544e65ce0c70ee624b',
        },
      },
      volume: '600000000000000000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      bounty: {
        bountyId: 'I_kwDOGWnnz85I9Agl',
        issuer: {
          id: '0x46e09468616365256f11f4544e65ce0c70ee624b',
        },
      },
      volume: '900000000000000000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
  ];

  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<MiniBountyList payouts={payouts} title={'example'} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });

  it('should render MiniBountyList with link', async () => {
    // ARRANGE
    render(<MiniBountyList payouts={payouts} title={'example'} />);

    // ASSERT
    expect(await screen.findByText(/0.40/)).toBeInTheDocument();
    expect(await screen.findByText(/0.60/)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
