/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Claimants from '.';

describe('Claimants', () => {
  it('should display the right address', async () => {
    // ARRANGE
    render(<Claimants claimant={'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'} />);

    // ASSERT
    const claimant = await screen.findByText('0x3c...93bc');
    expect(claimant).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
