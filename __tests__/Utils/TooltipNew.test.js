/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ToolTipNew from '../../components/Utils/ToolTipNew';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.
const Child = () => {
  return <div></div>;
};

describe('AccountModal', () => {
  // Test cases for
  let push;
  beforeEach(() => {
    push = jest.fn(() => {
      return { catch: jest.fn };
    });
    process.env.BASE_URL = 'http://localhost:3000';
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));

    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should display tooltip', async () => {
    // ARRANGE
    render(<ToolTipNew toolTipText='sample text' />);
    // ASSERT
    expect(screen.getByText(/sample text/)).toBeInTheDocument();
  });

  it('should hide tooltip', async () => {
    // ARRANGE
    render(
      <ToolTipNew hideToolTip={true} toolTipText='sample text'>
        <Child />
      </ToolTipNew>
    );
    // ASSERT
    expect(screen.queryByText(/sample text/)).not.toBeInTheDocument();
  });
  it('should show tooltip styles', async () => {
    // ARRANGE
    render(
      <ToolTipNew toolTipText='sample text' outerStyles={'outerStyles'} innerStyles={'innerStyles'} hideToolTip={false}>
        <Child />
      </ToolTipNew>
    );
    // ASSERT
    expect(document.querySelector('.innerStyles')).toBeInTheDocument();
    expect(document.querySelector('.outerStyles')).toBeInTheDocument();
  });
});
