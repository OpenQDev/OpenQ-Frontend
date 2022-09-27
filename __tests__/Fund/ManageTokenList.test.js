/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import ManageTokenList from '../../components/FundBounty/ManageTokenList';

describe('ManageTokenList', () => {
  const test = () => {
    let setLists, setCustomTokens;
    beforeEach(() => {
      setLists = jest.fn();
      setCustomTokens = jest.fn();
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
  };

  test();
});
