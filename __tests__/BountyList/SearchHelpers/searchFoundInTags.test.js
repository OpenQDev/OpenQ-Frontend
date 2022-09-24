/**
 * @jest-environment jsdom
 */
import searchTagInBounty from '../../../components/BountyList/searchHelpers/searchTagInBounty.js';

//searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);

const bounty = {
  languages: [{ name: 'javascript' }, { name: 'typescript' }, { name: 'javascript' }],
  labels: [{ name: 'bug' }, { name: 'typescrenvipt' }, { name: 'javascript' }],
};
const tagArr1 = ['dang', 'clojure'];
const tagArr2 = ['bug', 'typescript', 'javascript'];
const tagArr3 = [];

describe('searchTagInBounty', () => {
  it('should render Bounty Status', () => {
    const test = (tagArr, result) => {
      const isFoundInLabels = searchTagInBounty(bounty, tagArr);
      expect(isFoundInLabels).toEqual(result);
    };

    test(tagArr1, false);
    test(tagArr2, true);
    test(tagArr3, true);
  });
});
