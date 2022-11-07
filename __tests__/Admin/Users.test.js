/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Users from '../../components/Admin/Users';
import userEvent from '@testing-library/user-event';

describe('Users', () => {
  it('should display the Users', async () => {
    const user = userEvent.setup();
    // ARRANGE
    render(<Users />);

    // ASSERT
    expect(screen.getByText('To view user data please input OPENQ_API_SECRET')).toBeInTheDocument();
    const secretField = screen.getByLabelText(/OPENQ_API_SECRET/i);
    await user.type(secretField, 'testSecret');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText(/address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Github/i)).toBeInTheDocument();
    expect(await screen.findByText(/discord/i)).toBeInTheDocument();
    expect(await screen.findByText(/0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b/)).toBeInTheDocument();
    expect(await screen.findByText(/Christopher-Stevers/)).toBeInTheDocument();
    expect(await screen.findByText(/Voyageur#5630/)).toBeInTheDocument();
  });
});
