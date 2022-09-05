/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import SearchBar from '../../components/Search/SearchBar';
import InitialState from '../../store/Store/InitialState';

describe('ClaimPage', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  const test = () => {
    it('should render search bar with search text', async () => {
      // ARRANGE
      render(<SearchBar onKeyUp={() => null} onEnter={() => null} placeholder='test' searchText={'testing'} />);

      // ACT
      expect(screen.getByRole('textbox')).toHaveValue('testing');

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  test();
});
