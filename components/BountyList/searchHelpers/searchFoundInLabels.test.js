/**
 * @jest-environment jsdom
 */
import searchFoundInLabels from './searchFoundInLabels.js';

//searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);

const bounty = {
  labels: [{ name: 'javascript' }, { name: 'typescript' }, { name: 'javascript' }],
};

describe('searchFoundInLabels', () => {
  it('should render Bounty Status', () => {
    const test = (searchText, result) => {
      const isFoundInLabels = searchFoundInLabels(bounty, searchText);
      expect(isFoundInLabels).toEqual(result);
    };

    test('ta', false);
    test('java', true);
    test('typescript', true);
  });
});
