/**
 * @vi-environment jsdom
 */
import React from 'react';
import ToolTipNew from '.';
import renderer from 'react-test-renderer';
// Test cases for full balances, empty balances, and undefined balances.
const Child = () => {
  return <div></div>;
};

describe('ToolTipNew', () => {
  it('should match DOM Snapshot & display tooltip with styles', () => {
    const tree = renderer.create(
      <ToolTipNew toolTipText='sample text' outerStyles={'outerStyles'} innerStyles={'innerStyles'} hideToolTip={false}>
        <Child />
      </ToolTipNew>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match DOM Snapshot & hide tooltip', () => {
    const tree = renderer.create(
      <ToolTipNew hideToolTip={true} toolTipText='sample text'>
        <Child />
      </ToolTipNew>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
