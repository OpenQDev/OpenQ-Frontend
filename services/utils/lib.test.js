import { checkHackathonDates } from './lib';

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
