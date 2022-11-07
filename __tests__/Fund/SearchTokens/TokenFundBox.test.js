/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import TokenFundBox from '../../../components/FundBounty/SearchTokens/TokenFundBox';

describe('TokenFundBox', () => {
  it('should display the TokenFundBox interface', async () => {
    // ARRANGE
    render(<TokenFundBox token={{ symbol: 'MATIC' }} />);

    // ASSERT
    expect(screen.getByText(/MATIC/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
