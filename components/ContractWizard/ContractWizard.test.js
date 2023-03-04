/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ContractWizard from '.';
import userEvent from '@testing-library/user-event';
import ShallowRenderer from 'react-test-renderer/shallow';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

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
    expect(await screen.findByText(/we didn't find a suitable contract/i)).toBeInTheDocument();
  });

  it('should open wizard and direct to fixed contest contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(await screen.findByText(/Create a Hackathon Contract to send funds to any GitHub issue/i));
  });
});
