/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ClaimTotals from '../../components/Claim/ClaimTotals';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});

describe('ClaimTotals', () => {
  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  const valueDisplay = 200;
  const totalDepositValue = 1000;

  it('should display percentage and value', async () => {
    // ARRANGE
    render(<ClaimTotals valueDisplay={valueDisplay} totalDepositValue={totalDepositValue} />);

    // ASSERT
    const percentage = await screen.findByText('20.0 %');
    expect(percentage).toBeInTheDocument();

    const value = await screen.findByText('$200.00');
    expect(value).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
