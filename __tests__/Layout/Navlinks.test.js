/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Navlinks from '../../components/Layout/NavLinks';
import nextRouter from 'next/router';

describe('Navlinks', () => {
  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
    }));

    render(<Navlinks />);

    // ACT
    expect(await screen.findByText(/fixed price/i)).toBeInTheDocument();
    expect(await screen.findByText(/explore/i)).toBeInTheDocument();
    expect(await screen.findByText(/split price/i)).toBeInTheDocument();
    expect(await screen.findByText(/contests/i)).toBeInTheDocument();
  });
});
