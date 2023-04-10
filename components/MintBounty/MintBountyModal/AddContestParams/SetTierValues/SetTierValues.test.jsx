/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../../test-utils';
import nextRouter from 'next/router';
import SetTierValues from '.';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('SetTier', () => {
  it.skip('should render match DOM Snapshot', () => {
    // ARRANGE
    nextRouter.useRouter = vi.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: vi.fn(() => {
        return { catch: vi.fn };
      }),
    }));
    const mockSetFinalVolumes = vi.fn();
    const shallow = new ShallowRenderer();
    shallow.render(
      <SetTierValues
        finalTierVolumes={['2', '3', '4']}
        tierArr={['0', '1', '2']}
        setFinalTierVolumes={mockSetFinalVolumes}
        initialVolumes={['2', '3', '4']}
      />
    );
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });

  it('should display initial values for volume inputs on', async () => {
    // ARRANGE
    nextRouter.useRouter = vi.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: vi.fn(() => {
        return { catch: vi.fn };
      }),
    }));

    const mockSetFinalVolumes = vi.fn();
    render(
      <SetTierValues
        finalTierVolumes={['2', '3', '4']}
        tierArr={['1', '2', '3']}
        setFinalTierVolumes={mockSetFinalVolumes}
        initialVolumes={['2', '3', '4']}
      />
    );

    // ACT
    expect(screen.getByPlaceholderText(/1st winner/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/2nd winner/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/3rd winner/i)).toBeInTheDocument();
  });
});
