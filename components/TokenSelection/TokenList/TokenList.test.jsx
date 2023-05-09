/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import TokenList from '.';
import openqDefaultTokens from '../../../constants/openq-local-enumerable.json';
import polygonDefaultTokens from '../../../constants/openq-polygon-mainnet-enumerable.json';

beforeEach(() => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  window.IntersectionObserver = vi.fn(() => ({
    observe,
    disconnect,
  }));
});
describe('TokenList', () => {
  it('should display the TokenList interface', async () => {
    // ARRANGE

    render(
      <TokenList
        customTokens={[]}
        lists={{ openq: true }}
        polygonDefaultTokens={polygonDefaultTokens}
        openqDefaultTokens={openqDefaultTokens}
      />
    );

    // ASSERT
    expect(screen.getByText(/derc20/i)).toBeInTheDocument();
    expect(await screen.getAllByRole('img').length).toBeGreaterThan(1);

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
