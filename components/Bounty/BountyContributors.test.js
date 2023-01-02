import React from 'react';
import BountyContributors from '../../components/Bounty/BountyContributors';
import renderer from 'react-test-renderer';
import Constants from '../../test-utils/constant';
import { render, screen } from '../../test-utils';

describe('BountyContributors Snapshot', () => {
  const bounty = Constants.bounty;

  it('should match DOM Snapshot and 0 contribs', () => {
    const tree = renderer.create(<BountyContributors />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should render the list of 1 contrib', () => {
    render(<BountyContributors bounty={bounty} />);
    expect(screen.findByText(/Total: 1/i));
  });
});
