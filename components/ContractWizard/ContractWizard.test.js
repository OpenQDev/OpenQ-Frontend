/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ContractWizard from '.';
import userEvent from '@testing-library/user-event';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('ContractWizard', () => {
  it('should render match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<ContractWizard wizardVisibility={true} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });

  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    expect(await screen.findByText(/we didn't find a suitable contract/i)).toBeInTheDocument();
  });

  it('should open wizard and direct to fixed contest contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(await screen.findByText(/Create a Fixed Contest Contract to send funds to any GitHub issue/i));
  });
  it('should open wizard and direct to  contest contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(await screen.findByText(/Create a Contest Contract to send funds to any GitHub issue/i));
  });

  it('should open wizard and direct to split price contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(await screen.findByText(/Deploy split price contract/i));
    expect(await screen.findByText(/Reward Split/i));
  });
});
