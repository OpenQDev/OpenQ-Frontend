/**
 * @jest-environment jsdom
 */
import React from 'react';

import CopyBountyAddress from '../../components/Bounty/CopyBountyAddress';
import Constants from '../../test-utils/constant';
import renderer from 'react-test-renderer';

describe('CopyBountyAddress', () => {
  const bounty = Constants.bounty;

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render CopyBountyAddress and match DOM Snapshot', () => {
    const tree = renderer.create(<CopyBountyAddress address={bounty.bountyAddress} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
