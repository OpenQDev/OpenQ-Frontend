/**
 * @jest-environment jsdom
 */
import searchFoundInText from '../../../components/BountyList/searchHelpers/searchFoundInText.js';

//searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);

const bounty = {
  body: 'javascript typescript javascript',
  title: 'priceless ming vase',
};

describe('searchFoundInText', () => {
  it('should render Bounty Status', () => {
    const test = (searchText, result) => {
      const isFoundInLabels = searchFoundInText(bounty.title, bounty.body, searchText);
      expect(isFoundInLabels).toEqual(result);
    };

    test('ta', false);
    test('java', true);
    test('priceless ming vase', true);
  });
});
