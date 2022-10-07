/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import GrossValueMoved from '../../components/Admin/GrossValueMoved';

describe('GrossValueMoved', () => {
  it('should display the GrossValueMoved interface', async () => {
    // ARRANGE
    render(<GrossValueMoved />);

    // ASSERT
    expect(screen.getByText(/TVL/i)).toBeInTheDocument();
    expect(screen.getByText(/Funded/)).toBeInTheDocument();
    expect(await screen.findByText(/Claimed/)).toBeInTheDocument();
    expect(await screen.findByText(/8.04/)).toBeInTheDocument();
    expect(await screen.findAllByText(/335/)).toHaveLength(2);

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
