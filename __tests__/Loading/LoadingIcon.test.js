/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import LoadingIcon from '../../components/Loading/ButtonLoadingIcon';

describe('LoadingIcon', () => {
  const test = () => {
    it('should render LoadingIcon', () => {
      // ARRANGE
      render(<LoadingIcon />);
      expect(screen.getByTestId('loading'));
    });
  };

  test();
});
