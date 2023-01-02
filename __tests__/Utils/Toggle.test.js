/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Toggle from '../../components/Utils/Toggle';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
// Test cases for full balances, empty balances, and undefined balances.

describe('Toggle', () => {
  // Test cases for
  const mockToggle = jest.fn();
  const names = ['foo', 'bar'];

  it('should match DOM Snapshot & foo should have class bg-[#21262d] while bar should not', () => {
    const tree = renderer.create(<Toggle toggleFunc={mockToggle} names={names} toggleVal={names[0]} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should match DOM Snapshot & foo should not have class bg-[#21262d] while bar should', () => {
    const tree = renderer.create(<Toggle toggleFunc={mockToggle} names={names} toggleVal={names[1]} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call toggleFunc', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Toggle toggleFunc={mockToggle} names={names} toggleVal={names[1]} />);
    // ACT
    await user.click(screen.getByText(names[0]));
    expect(mockToggle).toHaveBeenCalledWith(names[0]);
  });
});
