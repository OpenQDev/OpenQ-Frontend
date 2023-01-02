import React from 'react';
import TweetAbout from '../../components/Utils/TweetAbout';
import renderer from 'react-test-renderer';
import Constants from '../../test-utils/constant';

describe('TweetAbout', () => {
  const bounty = Constants.bounty;
  const tweetText = 'Please tweet me!';
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<TweetAbout tweetText={tweetText} bounty={bounty} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
