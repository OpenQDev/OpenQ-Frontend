// test getBigNumberVol function from lib
import { getBigNumberVol } from '../../services/utils/lib';
describe('getBigNumberVol', () => {
  it('should return 1', () => {
    const volume = '1';
    const token = {
      decimals: 18,
    };
    const result = getBigNumberVol(volume, token);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('1000000000000000000');
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
