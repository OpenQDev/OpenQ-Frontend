/**
 * @vi-environment jsdom
 */
import React from 'react';

import BountyClosed from '.';
import Constants from '../../test-utils/constant';
import renderer from 'react-test-renderer';

describe('BountyClosed', () => {
  const bounties = Constants.bounties;

  const test = (bounty) => {
    it('should match DOM Snapshot', () => {
      const tree = renderer.create(<BountyClosed bounty={bounty} showTweetLink={true} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });
  };
  bounties.forEach((elem) => {
    test(elem);
  });
});
