/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../../test-utils';
import MockOpenQPrismaClient from '../../../../services/openq-api/MockOpenQPrismaClient';
import EditableSocial from '../../../../components/User/OverviewTab/EditableSocial';
import userEvent from '@testing-library/user-event';
import InitialState from '../../../../store/Store/InitialState';

describe('EditableSocial', () => {
  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
  });

  const social = {
    link: 'twitter.com/Casdfasdf',
    name: 'twitter',
    parseFunction: (x) => {
      return x;
    },
    icon: () => {
      return <div>Icon</div>;
    },
  };
  describe('is not Owner', () => {
    it('should render filled in ', async () => {
      // ARRANGE
      render(<EditableSocial isOwner={false} social={social} />);

      // ASSERT
      expect(screen.getByText(/Casdfasdf/)).toBeInTheDocument();
    });

    it('should render blank EditableInput', async () => {
      render(<EditableSocial isOwner={false} social={{ ...social, link: '' }} />);
      expect(screen.getByText(/-/)).toBeInTheDocument();
    });
  });
  describe('is Owner', () => {
    it('should be able to edit', async () => {
      const updateUserMockFunc = vi.fn();
      const user = userEvent.setup();
      const customInitialState = {
        ...InitialState,
        openQPrismaClient: new MockOpenQPrismaClient({ updateUserMockFunc }),
      };
      render(<EditableSocial isOwner={true} social={social} />, {}, customInitialState);
      await user.click(screen.getByRole('button', { name: '' }));
      const inputBox = await screen.findByRole('textbox');

      await user.type(inputBox, 'newTwitterHandle');

      await user.click(await screen.findByRole('button', { name: /update/i }));
      await screen.findByRole('button', { name: '' });
      expect(inputBox).not.toBeInTheDocument();
      expect(updateUserMockFunc).toBeCalledWith({
        email: undefined,
        twitter: 'https://twitter.com/twitter.com/CasdfasdfnewTwitterHandle',
      });
    });
  });
});
