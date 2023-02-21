import {
  checkHackathonDates,
  getNonBlacklisted,
  shortenAddress,
  parseVolume,
  listWordsWithAnd,
  capitalize,
  getBigNumberVol,
  checkFixedAndSplit,
  checkTiered,
  getBountyMarker,
} from './lib';
import Constants from '../../test-utils/constant';

describe('getNonBlacklisted', () => {
  it('should return an array of non-blacklisted repos', async () => {
    const repoName = Constants.repoName;
    const getPrs = jest.fn().mockReturnValue({ repoPrs: [{ id: 'a' }, { id: 'b' }], totalCount: 0 });
    const getSubmissions = jest.fn().mockReturnValue([{ id: 'a', blacklisted: true }]);
    const githubRepository = { getPrs };
    const openQPrismaClient = { getSubmissions };
    const mockAppState = { githubRepository, openQPrismaClient };
    const org = Constants.orgName;
    const limit = Constants.limit;
    const value = await getNonBlacklisted(mockAppState, repoName, org, limit);
    expect(value).toEqual({ nonBlacklisted: [{ id: 'b' }], totalCount: 0 });
  });
});
describe('shortenAddress', () => {
  it('return empty string if undefined', async () => {
    expect(shortenAddress(undefined)).toEqual('');
  });
  it('return shortened address if not null', async () => {
    expect(shortenAddress('0x1234567890123456789012345678901234567890')).toEqual('0x12...7890');
  });
});
describe('parseVolume', () => {
  it('should return null if input is not a number', () => {
    expect(parseVolume('a')).toBe(null);
  });
  it('should return null if input is not a number', () => {
    expect(parseVolume('aasdfasdf234rf.234')).toBe(null);
  });
  it('should return number if input is mixed', () => {
    expect(parseVolume('12.0123')).toBe('12.0123');
  });
  it('should return number if input is mixed', () => {
    expect(parseVolume('.0123')).toBe('.0123');
  });
});
describe('listWordsWithAnd', () => {
  it('should return empty string if empty array', () => {
    expect(listWordsWithAnd([])).toBe('');
  });
  it('should return empty string if empty array', () => {
    expect(listWordsWithAnd(['a'])).toBe('a');
  });
  it('should return empty string if empty array', () => {
    expect(listWordsWithAnd(['a', 'b'])).toBe('a and b');
  });
  it('should return empty string if empty array', () => {
    expect(listWordsWithAnd(['a', 'b', 'c'])).toBe('a, b, and c');
  });
});
describe('capitalize', () => {
  it('should return empty string if undefined', () => {
    expect(capitalize(undefined)).toEqual('');
  });
  it('should return empty string if null', () => {
    expect(capitalize(null)).toEqual('');
  });
  it('should return capitalized string', () => {
    expect(capitalize('hello')).toEqual('Hello');
  });
  it('should return capitalized string', () => {
    expect(capitalize('Hello')).toEqual('Hello');
  });
});

describe('getBigNumberVol', () => {
  it('should return 1', () => {
    const volume = '1';
    const token = {
      decimals: 18,
    };
    const result = getBigNumberVol(volume, token);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('1000000000000000000');
  });
  it('should return 1', () => {
    const volume = '1';
    const decimal6 = { decimals: 6 };
    const result = getBigNumberVol(volume, decimal6);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('1000000');
  });
  it('should return 0 when given .', () => {
    const volume = '.';
    const token = {
      decimals: 18,
    };
    const result = getBigNumberVol(volume, token);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('0');
  });
});
describe('checkHackathonDates', () => {
  const today = new Date('01-01-2023');
  it('should be able to register without defining dates', () => {
    const result = checkHackathonDates(undefined, undefined, today);
    expect(result).toBe(true);
  });
  it('should return true when Start Date < End Date and both dates are in the future', () => {
    const result = checkHackathonDates('02-02-2023', '12-12-2023', today);
    expect(result).toBe(true);
  });
  it('should return false when Start Date > End Date', () => {
    const result = checkHackathonDates('12-12-2023', '02-02-2023', today);
    expect(result).toBe(false);
  });
  it('should return false when Start Date < today', () => {
    const result = checkHackathonDates('12-12-2022', '02-02-2023', today);
    expect(result).toBe(false);
  });
  it('should return true when Start Date > today & End date not defined yet', () => {
    const result = checkHackathonDates('12-12-2023', undefined, today);
    expect(result).toBe(true);
  });
  it('should return true when End Date > today & Start date not defined yet', () => {
    const result = checkHackathonDates(undefined, '12-12-2023', today);
    expect(result).toBe(true);
  });
  it('should return false when Start Date < today & End date not defined yet', () => {
    const result = checkHackathonDates('12-12-2022', undefined, today);
    expect(result).toBe(false);
  });
  it('should return false when End Date < today & Start date not defined yet', () => {
    const result = checkHackathonDates(undefined, '12-12-2022', today);
    expect(result).toBe(false);
  });
});

describe('checkFixedAndSplit', () => {
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      status: '0',
      claims: [{ claimantAsset: 'claimantAsset' }],
      prs: [{ source: { url: 'claimantAsset', merged: true, author: { id: currentUser } } }],
    };
    const result = checkFixedAndSplit(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimed' });
  });
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      status: '0',
      claims: [{ claimantAsset: 'claimaasdfntAsset' }],
      prs: [{ source: { url: 'claimantasdAsset', merged: true, author: { id: currentUser } } }],
    };
    const result = checkFixedAndSplit(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimable' });
  });
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      tierWinners: [currentUser],
      claims: [{ tier: '0', claimantAsset: 'claimantAsset' }],
    };

    const result = checkTiered(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimed' });
  });
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      tierWinners: [currentUser],
      claims: [{ tier: '1', claimantAsset: 'claimantAsset' }],
    };

    const result = checkTiered(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimable' });
  });
});
describe('getBountyMarker', () => {
  const statusFunc = () => null;

  it('return closed if closed', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      closed: true,
    };

    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ colour: 'bg-danger', fill: 'fill-danger', status: 'Closed' });
  });
  it('return claim available if available', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      closed: false,
    };

    const statusFunc = () => {
      return { status: 'Claimable' };
    };
    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ colour: 'bg-closed', fill: 'fill-closed', status: 'Claim Available' });
  });
  it('return claimed', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      closed: false,
    };

    const statusFunc = () => {
      return { status: 'Claimed' };
    };
    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ colour: 'bg-closed', fill: 'fill-closed', status: 'Claimed' });
  });
});
