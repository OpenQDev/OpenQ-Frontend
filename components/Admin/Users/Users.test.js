/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Users from '.';

describe('Users', () => {
  it('should display the Users', async () => {
    // ARRANGE
    render(<Users />);

    // ASSERT
    expect(await screen.findByText(/Github/i)).toBeInTheDocument();
    expect(await screen.findByText(/discord/i)).toBeInTheDocument();
    expect(await screen.findByText(/Created At/)).toBeInTheDocument();
    expect(await screen.findByText(/Current Products/)).toBeInTheDocument();
  });
});
