/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../../test-utils';
import nextRouter from 'next/router';
import SetTierValues from '.';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('SetTier', () => {
  it.skip('should render match DOM Snapshot', () => {
    // ARRANGE
    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
    }));
    const mockSum = jest.fn();
    const mockEnabler = jest.fn();
    const mockSetFinalVolumes = jest.fn();
    const shallow = new ShallowRenderer();
    shallow.render(
      <SetTierValues
        category={'Contest'}
        sum={9}
        currentSum={9}
        setSum={mockSum}
        setEnableContest={mockEnabler}
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
    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
    }));
    const mockSum = jest.fn();
    const mockEnabler = jest.fn();
    const mockSetFinalVolumes = jest.fn();
    render(
      <SetTierValues
        bountyType={'3'}
        sum={9}
        setSum={mockSum}
        setEnableContest={mockEnabler}
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
