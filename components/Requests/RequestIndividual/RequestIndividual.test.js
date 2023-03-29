/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Constants from '../../../test-utils/constant';
import RequestIndividual from '.';
import userEvent from '@testing-library/user-event';
import InitialState from '../../../store/Store/InitialState';
import nextRouter from 'next/router';
import MockOpenQPrismaClient from '../../../services/openq-api/MockOpenQPrismaClient';
import MockOpenQClient from '../../../services/ethers/MockOpenQClient';

InitialState.openQClient.shouldSleep = 200;
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

describe('ReqiestIndividual', () => {
  it('should allow to accept documents on chain', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const item = {
      bounty: Constants.bounty,

      request: {
        requestingUser: Constants.accountData,
      },
    };
    const setSupportingDocumentsComplete = jest.fn();
    render(<RequestIndividual item={item} />, null, {
      ...InitialState,
      openQClient: new MockOpenQClient({ setSupportingDocumentsComplete }),
    });

    // ACT
    const acceptRequestButton = await screen.findByRole('button', { name: /Accept/i });

    await user.click(acceptRequestButton);
    expect(await screen.findByRole('button', { name: /accepted/i })).toBeInTheDocument();
  });
  it('should allow to reject documents on chain', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const item = {
      bounty: Constants.bounty,

      request: {
        id: 1,
        requestingUser: Constants.accountData,
      },
    };
    const updateRequest = jest.fn();
    render(<RequestIndividual item={item} />, null, {
      ...InitialState,
      openQPrismaClient: new MockOpenQPrismaClient({ updateRequest }),
    });

    // ACT
    const rejectRequestButton = await screen.findByRole('button', { name: /Decline/i });

    await user.click(rejectRequestButton);
    expect(await screen.findByText(/Please add/i)).toBeInTheDocument();
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });
});
