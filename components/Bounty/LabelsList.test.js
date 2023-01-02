/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import LabelsList from '../../components/Bounty/LabelsList';
import Constants from '../../test-utils/constant';

describe('LabelsList', () => {
  const bounty = Constants.bounty;

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render at least one label', () => {
    // ARRANGE
    render(<LabelsList bounty={bounty} />);
    if (bounty.labels[0]) {
      // ASSERT
      expect(screen.getByText(bounty.labels[0].name));
    }

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
