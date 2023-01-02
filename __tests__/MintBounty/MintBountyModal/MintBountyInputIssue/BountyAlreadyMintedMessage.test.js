/**
 * @jest-environment jsdom
 */
import React from 'react';
import BountyAlreadyMintedMessage from '../../../../components/MintBounty/MintBountyModal/MintBountyInputIssue/BountyAlreadyMintedMessage';
import renderer from 'react-test-renderer';
import Constants from '../../../../test-utils/constant';

describe('BountyAlreadyMintedMessage', () => {
  const bounty = { ...Constants.bounty, id: Constants.bountyId };
  it('should match DOM Snapshot and msg "is already minted" ', () => {
    const tree = renderer.create(
      <BountyAlreadyMintedMessage id={bounty.id} closed={false} bountyAddress={bounty.bountyAddress} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should match DOM Snapshot and msg "closed" ', () => {
    const tree = renderer.create(
      <BountyAlreadyMintedMessage id={bounty.id} closed={true} bountyAddress={bounty.bountyAddress} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
