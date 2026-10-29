import { ConfigLoader, ConfigStaticLoader } from '../config.loader';
import { ConfigMergeLoader } from './config.merge-loader';

/** lodash/fp → lodash-es 后合并口径不变：深合并、数组整体替换、不改动各 loader 的原对象 */
describe('ConfigMergeLoader 合并', () => {
  it('深合并，数组整体替换，不改原对象', async () => {
    const a = { system: { name: 'a', list: [1, 2, 3] }, keep: true };
    const b = { system: { list: [9], extra: 'x' } };
    const loader = new ConfigMergeLoader([new ConfigStaticLoader(a), new ConfigStaticLoader(b)] as ConfigLoader[]);
    const merged = (await loader.loadSettings()) as typeof a & typeof b;
    expect(merged.system.name).toBe('a');
    expect(merged.system.list).toEqual([9]);
    expect(merged.system.extra).toBe('x');
    expect(merged.keep).toBe(true);
    expect(a.system.list).toEqual([1, 2, 3]);
    expect('extra' in a.system).toBe(false);
  });
});
