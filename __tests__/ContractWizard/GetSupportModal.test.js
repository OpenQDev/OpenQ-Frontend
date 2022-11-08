/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import GetSupportModal from '../../components/ContractWizard/GetSupportModal';

describe('ContractWizard', () => {
  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    render(<GetSupportModal modalVisibility={true} />);

    // ACT
    expect(await screen.findByText(/we didn't find a suitable contract/i)).toBeInTheDocument();
    expect(screen.getByRole('link').href).toBe('https://discord.gg/puQVqEvVXn');
  });
});
