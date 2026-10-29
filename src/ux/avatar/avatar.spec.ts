import { Avatar } from './avatar';

/** F9：后端给的 name 可能是 null、undefined、数字或 0，取首字母不能抛错 */
describe('Avatar.getAvatar 首字母', () => {
  const initials = (name: unknown, size = 2): string => new Avatar('1', name as string).getAvatar(size);

  it('普通姓名取首字母', () => {
    expect(initials('john smith')).toBe('JS');
  });

  it('null / undefined / 空串返回空串', () => {
    expect(initials(null)).toBe('');
    expect(initials(undefined)).toBe('');
    expect(initials('   ')).toBe('');
  });

  it('数字不抛错，按字符串处理', () => {
    expect(() => initials(42)).not.toThrow();
    expect(initials(42)).toBe('4');
  });

  it('0 不当成空值', () => {
    expect(initials(0)).toBe('0');
  });
});
