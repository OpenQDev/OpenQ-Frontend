/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import LabelsList from '.';
import Constants from '../../../test-utils/constant';

describe('LabelsList', () => {
  const bounty = Constants.bounty;

  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render at least one label', () => {
    // ARRANGE
    render(<LabelsList bounty={bounty} />);
    if (bounty.labels[0]) {
      // ASSERT
      const firstLablel = screen.getByText(bounty.labels[0].name);
      expect(firstLablel).toBeInTheDocument();
      expect(firstLablel).toHaveStyle('background-color: rgba(0, 117, 202, 0.133)');
    }

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
