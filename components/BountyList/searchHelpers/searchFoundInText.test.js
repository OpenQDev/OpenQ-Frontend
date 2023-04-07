/**
 * @jest-environment jsdom
 */
import searchFoundInText from '../../../components/BountyList/searchHelpers/searchFoundInText.js';

//searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);

const bounty = {
  title: 'priceless ming vase javascript typescript javascript',
};

describe('searchFoundInText', () => {
  it('should render Bounty Status', () => {
    const test = (searchText, result) => {
      const isFoundInLabels = searchFoundInText(bounty.title, searchText);
      expect(isFoundInLabels).toEqual(result);
    };

    test('ta', false);
    test('java', true);
    test('priceless ming vase', true);
  });
});
