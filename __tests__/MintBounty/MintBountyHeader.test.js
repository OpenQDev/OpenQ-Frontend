/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MintBountyHeader from '../../components/MintBounty/MintBountyHeader';

describe('MintBountyHeader', () => {
  it('should display atomic header', () => {
    // ARRANGE
    render(<MintBountyHeader category={'Atomic'} />);

    expect(screen.getByText(/Create an Atomic Contract to send funds to any GitHub issue/i)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display repeatable header', () => {
    // ARRANGE
    render(<MintBountyHeader category={'Repeating'} />);

    expect(
      screen.getByText(/Pay out a fixed amount to any contributors who submit work to this bounty/i)
    ).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
  it('should display competition header', () => {
    // ARRANGE
    render(<MintBountyHeader category={'Contest'} />);

    expect(screen.getByText(/Create a Contest Contract to send funds to any GitHub issue/i)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
