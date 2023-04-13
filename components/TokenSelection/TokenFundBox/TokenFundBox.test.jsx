/**
 * @vi-environment jsdom
 */
import React from 'react';
import TokenFundBox from '.';
import Constants from '../../../test-utils/constant';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('TokenFundBox', () => {
  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<TokenFundBox token={Constants.tokenMetadata} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
