/**
 * @jest-environment jsdom
 */
import React from 'react';
import SearchBar from '.';
import renderer from 'react-test-renderer';

describe('SearchBar', () => {
  const onKeyUp = jest.fn();
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<SearchBar onKeyUp={onKeyUp} placeholder='test' searchText={''} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
