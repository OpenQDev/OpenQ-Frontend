/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import PieChart from '../../components/Bounty/PieChart';

describe('PieChart', () => {
  it('should render PieChart', async () => {
    // ARRANGE
    render(<PieChart payoutSchedule={[20, 30, 40]} />);

    // ASSERT

    expect(await screen.findByText(/20%/i)).toBeInTheDocument();
    expect(await screen.findByText(/30%/i)).toBeInTheDocument();
    expect(await screen.findByText(/40%/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
