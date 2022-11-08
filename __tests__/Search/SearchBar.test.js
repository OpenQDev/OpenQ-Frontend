/**
 * @jest-environment jsdom
 */
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import SearchBar from '../../components/Search/SearchBar';
import InitialState from '../../store/Store/InitialState';

describe('SearchBar', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  const onKeyUp = jest.fn();
  const test = () => {
    it('should render allow user to type into searchbar', async () => {
      const user = userEvent.setup();
      // ARRANGE
      render(<SearchBar onKeyUp={onKeyUp} placeholder='test' searchText={''} />);

      // ACT
      const text = screen.getByRole('textbox');
      await user.type(text, 'testing');
      expect(onKeyUp).toHaveBeenCalledTimes(7);
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  test();
});
