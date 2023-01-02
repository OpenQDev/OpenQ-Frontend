/**
 * @jest-environment jsdom
 */
import React from 'react';
import TierResult from '../../../../../components/MintBounty/MintBountyModal/AddContestParams/SetTierValues/TierResult';
import InitialState from '../../../../../store/Store/InitialState';
import renderer from 'react-test-renderer';

InitialState.openQClient.shouldSleep = 200;

describe('Tier Tier Result', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<TierResult sum={100} finalTierVolumes={[20, 80]} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
