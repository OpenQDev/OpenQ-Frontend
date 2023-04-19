/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../../../test-utils';
import MockOpenQPrismaClient from '../../../../services/openq-api/MockOpenQPrismaClient';
import Roles from '../../../../components/User/OverviewTab/Roles';
import userEvent from '@testing-library/user-event';
import InitialState from '../../../../store/Store/InitialState';
import Constants from '../../../../test-utils/constant';

describe('Roles', () => {
  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
  });
  const user = Constants.accountData;
  describe('is not Owner', () => {
    it('should render blank Roles', async () => {
      render(<Roles category='Role' isOwner={false} defaultRoles={[]} user={user} />);
      expect(screen.queryByText(/roles/i)).not.toBeInTheDocument();
    });
    it('should render Roles', async () => {
      // ARRANGE
      render(
        <Roles isOwner={true} defaultRoles={Constants.roles} user={user} />,
        {},
        { ...InitialState, accountData: {} }
      );

      // ASSERT
      expect(screen.getByText(Constants.role0)).toBeInTheDocument();
      expect(screen.getByText(Constants.role1)).toBeInTheDocument();
    });
  });

  describe('is Owner', () => {
    it('should be able to edit', async () => {
      const updateUserMockFunc = vi.fn();
      const user = userEvent.setup();
      const customInitialState = {
        ...InitialState,
        accountData: user,
        openQPrismaClient: new MockOpenQPrismaClient({ updateUserMockFunc }),
      };
      render(
        <Roles isOwner={true} category={'Dev Role'} defaultRoles={Constants.roles} user={user} />,
        {},
        customInitialState
      );

      expect(screen.getByText(/add dev role/i)).toBeInTheDocument();
      const inputBox = await screen.findByRole('textbox');

      await user.type(inputBox, 'newRole');

      await user.click(await screen.findByRole('button', { name: /Add/i }));
      expect(await screen.findByText(/newrole/i)).toBeInTheDocument();
      await waitFor(() => {
        expect(updateUserMockFunc).toBeCalledWith({
          devRoles: ['engineer', 'manager', 'newrole'],
        });
      });
    });
  });
});
