import searchFoundInLabels from '../searchFoundInLabels';
import searchFoundInText from '../searchFoundInText';
import { getTypeFromCategory } from '../../../../services/utils/lib';

const filterBounties = (item, filters, fetchFilters) => {
  const { types } = fetchFilters;
  const { searchText, isReady } = filters;

  const contractTypeRegex = /type:"[^"]+"/gi;

  //regex for letters and spaces but no quotes
  const myRegex = /type:"([\w\s]+)"/gi;
  const contractType = searchText.match(myRegex, '$1')?.[0]?.replace(myRegex, '$1') || '';
  const type = getTypeFromCategory(contractType);
  const orderRegex = /order:(\w+)/gi;
  // copilot, write regex to take label from search text, and extract label as a capture group

  const searchedLabelRegex = /label:"([^"])+"/gi;
  const replaceRegex = /label:"(.*)"/gi;
  const searchedLabelsUnparsed = searchText.match(searchedLabelRegex) || [];
  const searchedLabels = searchedLabelsUnparsed.map((elem) => {
    if (elem) return elem.replace(replaceRegex, '$1');
  });

  const bounty = item;
  const hasLabels =
    searchedLabels.some((searchedLabel) => bounty.labels.some((bountyLabel) => bountyLabel.name === searchedLabel)) ||
    searchedLabels.length === 0;

  let containsSearch = true;

  // Simple search
  let lowerCaseSearch = searchText
    .replace(searchedLabelRegex, '')
    .toLowerCase()
    .replace(orderRegex, '')
    .replace(contractTypeRegex, '')
    .trim();
  const isFoundInText = searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);
  const isFoundInLabels = searchFoundInLabels(bounty, lowerCaseSearch);
  const emptySearchText = searchText.length === 0;

  containsSearch = isFoundInText || isFoundInLabels || emptySearchText;

  //if non-profit type selected in search, make sure bounties filtered per 'non-profit' category, otherwise neglect ('true')
  const isBountyType = types.some((type) => type === bounty.bountyType);
  const isTempType = type === parseInt(bounty.bountyType) || typeof type !== 'number';
  // Criteria: to be respected at all time:
  // => Bounty must contain the searched terms, tags, github labels, and selected bounty type(s)
  // => Bounty must have a valid url and not be blacklisted
  const overallCriteria =
    containsSearch && hasLabels && isBountyType && isTempType && bounty.url && !bounty.blacklisted;

  // Criteria: TVL or Budget condition:
  // => Bounty must have a Budget, or a Total Value locked, or neither if it is a non-profit bounty
  const meetsFundsCriteria =
    bounty.fundingGoalVolume > 0 ||
    bounty.payoutSchedule?.some((payout) => payout > 0) ||
    bounty?.deposits?.some((deposit) => {
      return !deposit.refunded;
    });
  // Criteria: Must still be open:
  // => Bounty must still be open on OpenQ, unassigned and the issue must still be open on Github
  const isStillOpen = bounty.status === '0' && bounty.assignees?.length == 0 && !bounty.closed;

  // Criteria: 'All Issues' or 'Ready For Work' selection:
  // => show all issues when selected 'All issues' or else, if 'Ready for work', meet the funds criteria and be still open.
  const readyOrAllIssues = isReady === 'All issues' || (meetsFundsCriteria && isStillOpen);

  // some auto generated bounties show up as funded but don't display anything, that's because they are funded at really low values.
  // Combine

  // All criteria to filter issues on 'Ready for Work' or 'All Issues':
  return overallCriteria && readyOrAllIssues;
};
export default filterBounties;
