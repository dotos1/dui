import { FeatureService } from './feature.service';

/**
 * 功能开关的判定。
 *
 * <p>这一族<b>错了都不报错</b>:判错方向只是客户现场多显示或少显示一个功能,
 * 而"多出来的东西"没人会来报。所以只能靠用例守 —— 尤其是通配的优先级
 * 和"忘了登记"时的落点。
 */
describe('功能开关', () => {

  /** 只用到 getSettings,给个最小的桩,不必拖起整个 ConfigService */
  const svc = (settings: any) => {
    const config: any = {
      getSettings: (key: string) =>
        key.split('.').reduce((acc: any, k: string) => acc && acc[k], settings),
    };
    return new FeatureService(config);
  };

  describe('阶段闸位', () => {

    it('客户现场只开 stable', () => {
      const f = svc({ features: { stage: 'stable' } });
      f.declare({ 'a.stable': 'stable', 'a.preview': 'preview', 'a.exp': 'experimental' });

      expect(f.isEnabled('a.stable')).toBe(true);
      expect(f.isEnabled('a.preview')).toBe(false);
      expect(f.isEnabled('a.exp')).toBe(false);
    });

    it('内部环境开到 experimental 就全放行', () => {
      const f = svc({ features: { stage: 'experimental' } });
      f.declare({ 'a.stable': 'stable', 'a.preview': 'preview', 'a.exp': 'experimental' });

      expect(f.isEnabled('a.preview')).toBe(true);
      expect(f.isEnabled('a.exp')).toBe(true);
    });

    /** 没有 features 这一段的老配置不能把现有功能全关掉 */
    it('没配 features 时按 stable 算,stable 的照常显示', () => {
      const f = svc({});
      f.declare({ 'a.stable': 'stable', 'a.preview': 'preview' });

      expect(f.isEnabled('a.stable')).toBe(true);
      expect(f.isEnabled('a.preview')).toBe(false);
    });

    /** 闸位写错(拼错、写了个不认识的词)不能变成"全放行" */
    it('闸位配错按 stable 算,不放行更多', () => {
      const f = svc({ features: { stage: 'beta' } });
      f.declare({ 'a.preview': 'preview' });

      expect(f.stage()).toBe('stable');
      expect(f.isEnabled('a.preview')).toBe(false);
    });

  });

  describe('忘了登记', () => {

    /**
     * <b>宁可少显示。</b>没登记的按 preview 算,客户现场(stable)就看不见。
     * 反过来按 stable 算的话,新加的功能会自动出现在每个现场,
     * 而没人会发现 —— 多出来的东西不报错。
     */
    it('没登记的功能在客户现场不显示', () => {
      const f = svc({ features: { stage: 'stable' } });

      expect(f.stageOf('never.declared')).toBeUndefined();
      expect(f.isEnabled('never.declared')).toBe(false);
    });

    it('内部环境里没登记的照样看得见', () => {
      const f = svc({ features: { stage: 'preview' } });

      expect(f.isEnabled('never.declared')).toBe(true);
    });

  });

  describe('逐项覆盖', () => {

    /** 合同是硬的,阶段只是批量默认值 —— 覆盖必须压过阶段 */
    it('覆盖压过阶段:客户现场也能单独放行一个 preview 功能', () => {
      const f = svc({ features: { stage: 'stable', overrides: { 'a.preview': true } } });
      f.declare({ 'a.preview': 'preview' });

      expect(f.isEnabled('a.preview')).toBe(true);
    });

    it('覆盖也能关掉一个 stable 功能', () => {
      const f = svc({ features: { stage: 'experimental', overrides: { 'a.stable': false } } });
      f.declare({ 'a.stable': 'stable' });

      expect(f.isEnabled('a.stable')).toBe(false);
    });

  });

  describe('通配', () => {

    it('整组关掉', () => {
      const f = svc({ features: { stage: 'experimental', overrides: { 'sdos.*': false } } });
      f.declare({ 'sdos.contour': 'stable', 'sdos.ai': 'stable' });

      expect(f.isEnabled('sdos.contour')).toBe(false);
      expect(f.isEnabled('sdos.ai')).toBe(false);
    });

    /**
     * <b>细的要压过粗的。</b>「整组关掉、其中一支放行」是最常见的写法;
     * 如果按"先命中先算"就得靠 JSON 里键的顺序,而对象的键序是不该依赖的。
     */
    it('长的通配压过短的', () => {
      const f = svc({
        features: {
          stage: 'experimental',
          overrides: { 'sdos.*': false, 'sdos.contour.*': true },
        },
      });
      f.declare({ 'sdos.contour.run': 'stable', 'sdos.ai.chat': 'stable' });

      expect(f.isEnabled('sdos.contour.run')).toBe(true);
      expect(f.isEnabled('sdos.ai.chat')).toBe(false);
    });

    /**
     * <b>`a.b.*` 不该命中 `a.b` 自己。</b>通配写的是"这底下的" ——
     * 连自己一起关掉的话,「关掉子功能、保留入口」就没法表达了。
     */
    it('通配不命中前缀本身', () => {
      const f = svc({ features: { stage: 'stable', overrides: { 'sdos.contour.*': false } } });
      f.declare({ 'sdos.contour': 'stable', 'sdos.contour.kriging': 'stable' });

      expect(f.isEnabled('sdos.contour')).toBe(true);
      expect(f.isEnabled('sdos.contour.kriging')).toBe(false);
    });

    it('精确覆盖压过通配', () => {
      const f = svc({
        features: { stage: 'stable', overrides: { 'sdos.*': false, 'sdos.contour': true } },
      });
      f.declare({ 'sdos.contour': 'stable' });

      expect(f.isEnabled('sdos.contour')).toBe(true);
    });

  });

  describe('登记与变更', () => {

    it('后登记的阶段为准 —— 功能转正只改登记处一行', () => {
      const f = svc({ features: { stage: 'stable' } });
      f.declare({ 'a.x': 'preview' });
      expect(f.isEnabled('a.x')).toBe(false);

      f.declare({ 'a.x': 'stable' });
      expect(f.isEnabled('a.x')).toBe(true);
    });

    /** 各库是模块初始化时才登记的,可能晚于指令第一次求值 —— 必须发变更 */
    it('登记会发一次变更通知', () => {
      const f = svc({ features: { stage: 'stable' } });
      let n = 0;
      f.changed.subscribe(() => n++);   // BehaviorSubject:订阅时先来一次

      f.declare({ 'a.x': 'stable' });

      expect(n).toBe(2);
    });

    it('list 列出已登记的功能与当前状态', () => {
      const f = svc({ features: { stage: 'stable' } });
      f.declare({ 'b.y': 'preview', 'a.x': 'stable' });

      expect(f.list()).toEqual([
        { key: 'a.x', stage: 'stable', enabled: true },
        { key: 'b.y', stage: 'preview', enabled: false },
      ]);
    });

  });

  /** 空 key 一律放行:模板里 *duiFeature="expr" 而 expr 还没算出来时不该整块消失 */
  it('空 key 放行', () => {
    const f = svc({ features: { stage: 'stable' } });

    expect(f.isEnabled('')).toBe(true);
    expect(f.isEnabled(undefined)).toBe(true);
  });

});
