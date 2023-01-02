/**
 * @jest-environment jsdom
 */
import React from 'react';
import TokenFundBox from '../../../components/FundBounty/SearchTokens/TokenFundBox';
import Constants from '../../../test-utils/constant';
import renderer from 'react-test-renderer';

describe('TokenFundBox', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<TokenFundBox token={Constants.tokenMetadata} />);
    expect(tree.toJSON()).toMatchSnapshot('shows token symbol, img and input field');
  });
});
