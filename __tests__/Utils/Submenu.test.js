// test/component/Utils/UnexpectedError.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import SubMenu from '../../components/Utils/SubMenu';
import userEvent from '@testing-library/user-event';
import Add from '../../components/svg/add.js';
// Test cases for full balances, empty balances, and undefined balances.

describe('SubMenu', () => {
  // Test cases for
  const mockUpdatePage = jest.fn();
  beforeEach(() => {});
  const items = [
    { name: 'View', SVG: Add },
    { name: 'Fund', SVG: Add },
  ];
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
