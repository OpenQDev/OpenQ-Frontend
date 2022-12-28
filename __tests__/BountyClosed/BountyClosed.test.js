/**
 * @jest-environment jsdom
 */
import React from 'react';

import BountyClosed from '../../components/BountyClosed/BountyClosed';
import Constants from '../../test-utils/constant';
import renderer from 'react-test-renderer';

describe('BountyClosed', () => {
  const bounty = { ...Constants.bounty, tvc: Constants.tvc };

  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<BountyClosed bounty={bounty} showTweetLink={true} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
