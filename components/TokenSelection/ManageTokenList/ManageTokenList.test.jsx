/**
 * @vi-environment jsdom
 */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils';
import ManageTokenList from '.';

describe('ManageTokenList', () => {
  const test = () => {
    let setLists, setCustomTokens;
    beforeEach(() => {
      setLists = vi.fn();
      setCustomTokens = vi.fn();
    });
    it('should render ManageTokenList', () => {
      // ARRANGE
      const customTokens = [];
      const lists = {
        openq: true,
        polygon: true,
      };
      render(
        <ManageTokenList
          setLists={setLists}
          setCustomTokens={setCustomTokens}
          customTokens={customTokens}
          lists={lists}
        />
      );
      expect(screen.getByText(/lists/i)).toBeInTheDocument();
      expect(screen.getByText(/tokens/i)).toBeInTheDocument();
      const polygonToggle = screen.getByLabelText(/Polygon.Technology List/);
      expect(polygonToggle).toBeInTheDocument();
      const openqToggle = screen.getByLabelText(/OpenQ List/);
      expect(openqToggle).toBeInTheDocument();
    });
    it('should render ManageTokenList', async () => {
      // ARRANGE
      const customTokens = [];
      const lists = {
        openq: true,
        polygon: true,
      };

      const user = userEvent.setup();
      render(
        <ManageTokenList
          setLists={setLists}
          setCustomTokens={setCustomTokens}
          customTokens={customTokens}
          lists={lists}
        />
      );
      expect(screen.getByText(/lists/i)).toBeInTheDocument();
      const tokenBtn = screen.getByText(/tokens/i);
      await user.click(tokenBtn);
      const input = screen.getByLabelText(/custom tokens/i);
      await user.type(input, '0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b');
      await user.type(input, '{enter}');
      expect(setCustomTokens).toHaveBeenCalledWith([
        {
          address: '0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b',
          symbol: 'CUSTOM',
          name: 'Custom Token',
          decimals: 18,
          path: '/crypto-logos/ERC20.svg',
        },
      ]);
    });
  };

  test();
});
