/**
 * @vi-environment jsdom
 */
import React from 'react';
import LinkDropdown from '.';
import renderer from 'react-test-renderer';

describe('LinkDropdown', () => {
  // Test cases for

  const items = [
    { name: 'View', url: '/' },
    { name: 'Fund', url: '/asd' },
  ];
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LinkDropdown items={items} />);
    expect(tree.toJSON()).toMatchSnapshot('and should display LinkDropdown');
  });
});
