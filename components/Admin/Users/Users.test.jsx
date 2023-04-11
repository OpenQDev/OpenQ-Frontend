/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Users from '.';
import userEvent from '@testing-library/user-event';

describe('Users', async () => {
  it('should display the Users', async () => {
    const user = userEvent.setup();
    // ARRANGE
    render(<Users />);

    // ASSERT
    expect(screen.getByText('To view user data please input OPENQ_API_SECRET')).toBeInTheDocument();
    const secretField = screen.getByLabelText(/OPENQ_API_SECRET/i);
    await user.type(secretField, 'testSecret');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findAllByText(/Mon Aug 29 2022/i)).toHaveLength(2);
    expect(await screen.findByText(/Github/i)).toBeInTheDocument();
    expect(await screen.findByText(/discord/i)).toBeInTheDocument();
    expect(await screen.findByText(/Christopher-Stevers/)).toBeInTheDocument();
    expect(await screen.findByText(/Voyageur#5630/)).toBeInTheDocument();
  });
});
