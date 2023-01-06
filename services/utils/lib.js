import { ethers } from 'ethers';

export const getNonBlacklisted = async (appState, repoName, org, limit) => {
  const { repoPrs, totalCount } = await appState.githubRepository.getPrs(org, repoName, limit || 3);

  const prs = await appState.openQPrismaClient.getSubmissions();
  const blacklistedPrIds = prs.filter((pr) => pr.blacklisted).map((pr) => pr.id);

  return { nonBlacklisted: repoPrs.filter((pr) => !blacklistedPrIds.includes(pr.id)), totalCount };
};

export const shortenAddress = (address) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, 4)}...${address.slice(38)}`;
};

export const parseVolume = (volume) => {
  const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
  if (numberRegex.test(volume) || volume === '' || volume === '.') {
    return volume.match(numberRegex)[0];
  } else {
    return null;
  }
};
export const listWordsWithAnd = (words) => {
  if (words.length === 1) {
    return words[0];
  }
  if (words.length === 2) {
    return `${words[0]} and ${words[1]}`;
  }
  return `${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}`;
};

export const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1);
};
export const valueToDisplay = (value) => {
  switch (value) {
    case 'invoicingName':
      return 'Invoicing Name';
    case 'invoicingEmail':
      return 'Invoicing Email';
    case 'streetAddress':
      return 'Billing Address';
    case 'postalCode':
      return 'Postal Code';
    case 'phoneNumber':
      return 'Phone Number';
    case 'invoiceNumber':
      return 'Invoice Number';
    case 'taxId':
      return 'Tax ID';
    case 'vatNumber':
      return 'VAT Number';
    case 'vatRate':
      return 'VAT Rate';
    case 'billingName':
      return 'Billing Name';
    default:
      return capitalize(value);
  }
};

export const getBigNumberVol = (volume, token) => {
  const volumeFloat = parseFloat(volume) || 0;
  const volumeInWei = volumeFloat * 10 ** token.decimals;

  return ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));
};
