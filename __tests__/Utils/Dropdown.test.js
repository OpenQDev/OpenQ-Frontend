/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Dropdown from '../../components/Utils/Dropdown';
import userEvent from '@testing-library/user-event';
import nextRouter from 'next/router';
import renderer from 'react-test-renderer';

nextRouter.useRouter = jest.fn();
describe('Dropdown', () => {
  const mockDropdown = jest.fn();
  const title = 'pizzas';
  beforeEach(() => {});
  const names = ['foo', 'bar'];

  it('should match DOM Snapshot', () => {
    const tree = renderer.create(
      <Dropdown toggleFunc={mockDropdown} title={title} names={names} toggleVal={names[0]} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should be useable dropdown', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Dropdown toggleFunc={mockDropdown} names={names} toggleVal={names[0]} />);
    const defaultTitle = screen.getAllByText(names[0])[0];
    const altName = screen.getByText(names[1]);
    await user.click(defaultTitle);
    await user.click(altName);
    // ACT
    expect(mockDropdown).toHaveBeenCalledWith(names[1]);
  });
});
