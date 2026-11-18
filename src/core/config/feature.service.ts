/**
 * @fileoverview Module `src/core/config/feature.service.ts` providing feature service definitions and implementation.
 * @zh 模块文件 `src/core/config/feature.service.ts`，提供feature服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ConfigService } from './config.service';

/**
 * 功能的成熟阶段。站点配一个闸位,闸位之外的一律不显示。
 *
 * <p><b>为什么用阶段而不是逐项清单。</b>逐项清单要求每加一个功能就去每个客户现场
 * 改一次配置 —— 漏改的那个现场就会突然冒出一个任务书里没有的功能,而没人会发现,
 * 因为"多出来的东西"不报错。按阶段的话新功能默认落在 preview,客户现场的闸位是
 * stable,自动就藏住了;内部环境把闸位开到 experimental 就全看得见。

 * @zh 功能的成熟阶段。站点配一个闸位,闸位之外的一律不显示。
 */
export type FeatureStage = 'stable' | 'preview' | 'experimental';

/**
 * Constant/variable `STAGE_RANK` defining stage rank in `src/core/config`.
 * 闸位高低。配置里的闸位 ≥ 功能的阶段才放行。
 * @zh 闸位高低。配置里的闸位 ≥ 功能的阶段才放行。
 */
const STAGE_RANK: Record<FeatureStage, number> = {
  stable: 0,
  preview: 1,
  experimental: 2,
};

/**
 * 功能开关。
 *
 * <p>解决的是两件事:<b>前沿功能不该出现在客户现场</b>,以及
 * <b>项目任务书里没有的功能要能快速关掉</b>。两者判据不同,所以有两层:
 *
 * <ol>
 *   <li><b>阶段闸位</b> —— 站点级的一个开关,把整批未成熟功能一起挡住;</li>
 *   <li><b>逐项覆盖</b> —— 按合同关掉(或额外打开)某个具体功能。</li>
 * </ol>
 *
 * <p>配置放在 {@link ConfigService} 读的那份 JSON 里(部署时改,<b>不用重新构建</b>):
 *
 * <pre>
 * "features": {
 *   "stage": "stable",
 *   "overrides": {
 *     "sdos.contour": true,      // 合同里有,单独放行
 *     "sdos.ai": false,          // 合同里没有,关掉
 *     "sdos.processing.*": false // 整组关掉
 *   }
 * }
 * </pre>
 *
 * <p><b>各库要登记自己的功能</b>({@link declare}),否则这边不知道它是什么阶段,
 * 只能按 {@link FeatureService.unknownStage} 当作 preview 处理 —— 也就是
 * 客户现场默认看不见。这是有意的:忘了登记的后果是"少显示",不是"多显示"。

 * @zh 可注入的 Angular 服务 `FeatureService`，管理 `src/core/config` 中的Feature服务状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class FeatureService {

  /**
   * 没登记过的功能按哪个阶段算。
   *
   * <p>取 preview 而不是 stable:忘了登记时宁可少显示,不要在客户现场
   * 多冒出一个任务书里没有的东西 —— 前者有人会来问,后者没人会发现。

   * @zh 没登记过的功能按哪个阶段算。
   */
  static unknownStage: FeatureStage = 'preview';

  /**
   * Property `declared` (`Map<string, FeatureStage>`) storing declared (default: `new Map<string, FeatureStage>()`).
   * @zh 属性 `declared`（类型：`Map<string, FeatureStage>`），用于存储或配置已声明（默认值：`new Map<string, FeatureStage>()`）。
   */
  private declared = new Map<string, FeatureStage>();

  /**
   * Property `changedSubject` (`BehaviorSubject<void>`) storing changed subject (default: `new BehaviorSubject<void>(undefined)`).
   * @zh 属性 `changedSubject`（类型：`BehaviorSubject<void>`），用于存储或配置已变更主题流（默认值：`new BehaviorSubject<void>(undefined)`）。
   */
  private changedSubject = new BehaviorSubject<void>(undefined);

  /**
   * Property `changed` (`Observable<void>`) storing changed (default: `this.changedSubject.asObservable()`).
   * 开关变化时发一次。菜单一类"算一次就存下来"的地方要订它重算。
   * @zh 开关变化时发一次。菜单一类"算一次就存下来"的地方要订它重算。
   */
  readonly changed: Observable<void> = this.changedSubject.asObservable();

  /**
   * Creates an instance of `FeatureService` and initializes its dependencies and internal state.
   * @zh 创建 `FeatureService` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`ConfigService`) / 注入或传入的配置（`ConfigService`）
   */
  constructor(private readonly config: ConfigService) {
    this.config?.onLoad?.subscribe(() => this.changedSubject.next());
  }

  /**
   * 登记一批功能与它们的阶段。各库在自己的模块里调一次。
   *
   * <p>重复登记以<b>后来的为准</b> —— 功能从 preview 转正到 stable 时
   * 只要改登记处一行,不必动配置。

   * @zh 登记一批功能与它们的阶段。各库在自己的模块里调一次。
   */
  declare(features: Record<string, FeatureStage>): void {
    for (const key of Object.keys(features)) {
      this.declared.set(key, features[key]);
    }
    this.changedSubject.next();
  }

  /**
   * 这个功能登记的阶段;没登记过返回 undefined。
   * @zh 这个功能登记的阶段;没登记过返回 undefined。
   */
  stageOf(key: string): FeatureStage | undefined {
    return this.declared.get(key);
  }

  /**
   * Executes `list` to handle list.
   * 已登记的全部功能,按名字排序。做设置界面或者排查时用。
   * @zh 已登记的全部功能,按名字排序。做设置界面或者排查时用。
   */
  list(): Array<{ key: string; stage: FeatureStage; enabled: boolean }> {
    return Array.from(this.declared.keys()).sort().map((key) => ({
      key,
      stage: this.declared.get(key),
      enabled: this.isEnabled(key),
    }));
  }

  /**
   * Executes `isEnabled` to handle is enabled.
   * 这个功能开不开。
   *
   * <p>判定顺序:<b>逐项覆盖优先于阶段闸位</b> —— 覆盖是按合同写死的,
   * 阶段只是个批量默认值。
   *
   * <ol>
   *   <li>精确匹配 `overrides[key]`;</li>
   *   <li>前缀通配 `overrides["a.b.*"]`,<b>取最长的那条</b>(细的压过粗的,
   *       这样才能写"整组关掉、其中一个放行");</li>
   *   <li>都没有 → 比阶段:功能的阶段 ≤ 站点闸位就放行。</li>
   * </ol>

   * @zh 这个功能开不开。
   */
  isEnabled(key: string): boolean {
    if (!key) {
      return true;
    }
    const overrides = this.overrides();
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      return !!overrides[key];
    }
    const wildcard = this.matchWildcard(key, overrides);
    if (wildcard !== undefined) {
      return wildcard;
    }
    const stage = this.declared.get(key) ?? FeatureService.unknownStage;
    return STAGE_RANK[stage] <= STAGE_RANK[this.stage()];
  }

  /**
   * 站点闸位。配错了(比如写了个不认识的词)按 stable 算,不要放行更多。
   * @zh 站点闸位。配错了(比如写了个不认识的词)按 stable 算,不要放行更多。
   */
  stage(): FeatureStage {
    const v = this.config.getSettings('features.stage');
    return (v === 'preview' || v === 'experimental' || v === 'stable') ? v : 'stable';
  }

  /**
   * Executes `overrides` to handle overrides.
   * @zh 执行 `overrides`，用于overrides。
   * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
   */
  private overrides() {
    return this.config.getSettings('features.overrides') ?? {};
  }

  /**
   * 前缀通配。`"a.b.*"` 命中 `a.b.c` 与 `a.b.c.d`,但**不命中 `a.b` 本身** ——
   * 通配写的是"这底下的",不该把自己也关掉。
   *
   * <p>多条同时命中时取<b>最长</b>的:`{"sdos.*": false, "sdos.contour.*": true}`
   * 要能表达"sdos 整组关掉,但等值线那一支放行"。

   * @zh 前缀通配。`"a.b.*"` 命中 `a.b.c` 与 `a.b.c.d`,但**不命中 `a.b` 本身** ——
   */
  private matchWildcard(key: string, overrides): boolean | undefined {
    let best: string | undefined;
    for (const pattern of Object.keys(overrides)) {
      if (!pattern.endsWith('.*')) {
        continue;
      }
      const prefix = pattern.slice(0, -1);   // "a.b.*" → "a.b."
      if (key.startsWith(prefix) && (best === undefined || pattern.length > best.length)) {
        best = pattern;
      }
    }
    return best === undefined ? undefined : !!overrides[best];
  }

}
