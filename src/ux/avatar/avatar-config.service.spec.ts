import { AvatarConfigService } from './avatar-config.service';

/** F8：去掉 @gate-ignore 后的写法，口径与原来的 `a && a.colors && a.colors.length && a.colors || d` 一致 */
describe('AvatarConfigService.getAvatarColors', () => {
  const defaults = ['#111', '#222'];

  it('没有用户配置时用默认色', () => {
    expect(new AvatarConfigService(null).getAvatarColors(defaults)).toBe(defaults);
  });

  it('用户颜色为空数组时用默认色', () => {
    expect(new AvatarConfigService({ colors: [] }).getAvatarColors(defaults)).toBe(defaults);
  });

  it('用户给了颜色就用用户的', () => {
    const colors = ['#abc'];
    expect(new AvatarConfigService({ colors }).getAvatarColors(defaults)).toBe(colors);
  });
});
