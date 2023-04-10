/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import SubMenu from '.';
import userEvent from '@testing-library/user-event';
import Add from '../../svg/add';
import renderer from 'react-test-renderer';
// Test cases for full balances, empty balances, and undefined balances.

describe('SubMenu', () => {
  // Test cases for
  const mockUpdatePage = vi.fn();
  beforeEach(() => {});
  const items = [
    { name: 'View', SVG: Add },
    { name: 'Fund', SVG: Add },
  ];
  it('should match DOM Snapshot and match horizontal style', () => {
    const tree = renderer.create(<SubMenu updatePage={mockUpdatePage} internalMenu={'Fund'} items={items} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should match DOM Snapshot and match vertical style', () => {
    const tree = renderer.create(
      <SubMenu updatePage={mockUpdatePage} vertical={true} internalMenu={'Fund'} items={items} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should display SubMenu', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<SubMenu updatePage={mockUpdatePage} internalMenu={'Fund'} items={items} />);
    // ASSERT
    const view = screen.getByText(items[0].name);
    await user.click(view);
    expect(mockUpdatePage).toHaveBeenCalled();
    expect(view).toBeInTheDocument();
  });
});
