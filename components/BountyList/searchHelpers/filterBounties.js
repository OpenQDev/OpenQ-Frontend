import searchFoundInText from './searchFoundInText';
import searchFoundInLabels from './searchFoundInLabels';
import searchTagInBounty from './searchTagInBounty';

//const [appState] = useContext(StoreContext);
const searchRegex = /label:"[^"]+"/gi;

const filterBounties = (
  bounties,
  options,
  tagArr,
  searchText,
  isReady,
  contractTypeRegex,
  setCurrentSearchedLabels,
  setCurrentContractTypes,
  orderRegex,
  account,
  fetchPage,
  complete,
  appState,
  router
) => {
  const localTagArr = options?.tagArr || tagArr;
  const localSearchText = options?.searchText === undefined ? searchText : options?.searchText;
  const localIsReady = options?.isReady === undefined ? isReady : options?.isReady;

  const searchedLabelsWrapped = localSearchText.match(searchRegex) || [];
  const contractsTypesWrapped = localSearchText.match(contractTypeRegex) || [];
  const searchedLabels = searchedLabelsWrapped.map((elem) => elem.slice(7, -1));
  setCurrentSearchedLabels(searchedLabels);
  const contractType = contractsTypesWrapped.map((elem) => elem.slice(6, -1))[0];
  setCurrentContractTypes([contractType]);
  let types = ['0', '1', '2', '3'];

  switch (contractType) {
    case 'Fixed Price':
      types = ['0'];
      break;
    case 'Contest':
      types = ['2', '3'];
      break;
    case 'Split Price':
      types = ['1'];
      break;
  }

  const displayBounties = bounties.filter((bounty) => {
    const hasLabels =
      searchedLabels.some((searchedLabel) => bounty.labels.some((bountyLabel) => bountyLabel.name === searchedLabel)) ||
      searchedLabels.length === 0;

    let containsSearch = true;

    try {
      // Simple search
      let lowerCaseSearch = localSearchText
        .replace(searchRegex, '')
        .toLowerCase()
        .replace(orderRegex, '')
        .replace(contractTypeRegex, '')
        .trim();
      const isFoundInText = searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);
      const isFoundInLabels = searchFoundInLabels(bounty, lowerCaseSearch);
      const emptySearchText = localSearchText.length === 0;
      containsSearch = isFoundInText || isFoundInLabels || emptySearchText;

      // Tags
      const containsTag = searchTagInBounty(bounty, localTagArr);

      //if non-profit type selected in search, make sure bounties filtered per 'non-profit' category, otherwise neglect ('true')
      const isNonProfitType = router.query.type === 'non-profit' ? bounty.category === 'non-profit' : true;
      const isBountyType = types.some((type) => type === bounty.bountyType);

      // Criteria: to be respected at all time:
      // => Bounty must contain the searched terms, tags, github labels, and selected bounty type(s)
      // => Bounty must have a valid url and not be blacklisted
      const overallCriteria =
        containsSearch &&
        containsTag &&
        hasLabels &&
        isBountyType &&
        isNonProfitType &&
        bounty.url &&
        !bounty.blacklisted;

      // Criteria: TVL or Budget condition:
      // => Bounty must have a Budget, or a Total Value locked, or neither if it is a non-profit bounty
      const meetsFundsCriteria =
        bounty.fundingGoalVolume > 0 ||
        bounty?.deposits?.some((deposit) => {
          return !deposit.refunded;
        }) ||
        bounty.category === 'non-profit';

      // Criteria: Must still be open:
      // => Bounty must still be open on OpenQ, unassigned and the issue must still be open on Github
      const isStillOpen = bounty.status === '0' && bounty.assignees?.length == 0 && !bounty.closed;

      // Criteria: 'All Issues' or 'Ready For Work' selection:
      // => show all issues when selected 'All issues' or else, if 'Ready for work', meet the funds criteria and be still open.
      const readyOrAllIssues = localIsReady === 'All issues' || (meetsFundsCriteria && isStillOpen);

      // some auto generated bounties show up as funded but don't display anything, that's because they are funded at really low values.
      // Combine

      // All criteria to filter issues on 'Ready for Work' or 'All Issues':
      return overallCriteria && readyOrAllIssues;
    } catch (err) {
      appState.logger.error(err, appState?.accountData?.id, 'bountylist1');
    }
  });

  if (displayBounties.length === 0 && !complete) {
    fetchPage();
    return [];
  } else return displayBounties;
};

export default filterBounties;
