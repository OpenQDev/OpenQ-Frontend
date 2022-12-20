/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import TotalValue from '../../components/Bounty/TotalValue';
import { waitFor } from '../../test-utils';

describe('TotalValue', () => {
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  const test = (bounty, price) => {
    it('should render 0 in TotalValue', async () => {
      // ARRANGE
      render(<TotalValue bounty={{}} setInternalMenu={() => null} price={price} />);
      await waitFor(() => {
        // ASSERT
        const usdPrice = screen.getByText(/0.00/);
        expect(usdPrice).toBeInTheDocument();

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });

    it('should render >0 in TotalValue', async () => {
      // ARRANGE
      render(<TotalValue bounty={{}} price={90} />);

      // ASSERT
      await waitFor(() => {
        const usdPrice = screen.getByText(/0.00/i);
        expect(usdPrice).toBeInTheDocument();

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  };

  test(19);
});
