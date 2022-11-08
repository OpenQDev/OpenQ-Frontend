/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyAlreadyMintedMessage from '../../components/MintBounty/BountyAlreadyMintedMessage';

describe('BountyAlreadyMintedMessage', () => {
  it('should display closed with correct link', () => {
    // ARRANGE
    render(
      <BountyAlreadyMintedMessage
        id={'abc'}
        closed={true}
        bountyAddress={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
      />
    );

    expect(screen.getByTestId('link')).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display closed with correct link', () => {
    // ARRANGE
    render(
      <BountyAlreadyMintedMessage
        id={'abc'}
        closed={false}
        bountyAddress={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
      />
    );

    // Assert
    expect(screen.getByText(/Bounty is already minted/i)).toBeInTheDocument();
    expect(screen.getByTestId('link')).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
