/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Toggle from '../../components/Utils/Toggle';
import userEvent from '@testing-library/user-event';
// Test cases for full balances, empty balances, and undefined balances.

describe('Toggle', () => {
  // Test cases for
  const mockToggle = jest.fn();
  beforeEach(() => {});
  const names = ['foo', 'bar'];

  it('should display toggle', async () => {
    // ARRANGE
    render(<Toggle toggleFunc={mockToggle} names={names} toggleVal={names[0]} />);
    // ASSERT
    expect(screen.getByText(names[0])).toHaveClass('bg-[#21262d]');
    expect(screen.getByText(names[1])).not.toHaveClass('bg-[#21262d]');
  });
  it('should display toggle', async () => {
    // ARRANGE
    render(<Toggle toggleFunc={mockToggle} names={names} toggleVal={names[1]} />);
    // ASSERT
    expect(screen.getByText(names[0])).not.toHaveClass('bg-[#21262d]');
    expect(screen.getByText(names[1])).toHaveClass('bg-[#21262d]');
  });

  it('should display toggle', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Toggle toggleFunc={mockToggle} names={names} toggleVal={names[1]} />);
    // ACT
    await user.click(screen.getByText(names[0]));
    expect(mockToggle).toHaveBeenCalledWith(names[0]);
  });
});
