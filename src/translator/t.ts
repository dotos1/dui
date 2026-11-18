/**
 * @fileoverview Module `src/translator/t.ts` providing t definitions and implementation.
 * @zh 模块文件 `src/translator/t.ts`，提供t相关的定义与实现。
 */

// 次级入口点之间必须走包路径：相对路径会让 ng-packagr 报 rootDir 越界
import { ServiceLocator } from '@dotos1/dui/core/services';
import { TranslationService } from './translation.service';

/**
 * 模块级的取译文入口。
 *
 * <p><b>为什么要有这一个。</b>翻译服务只能靠构造函数注入，于是三类文件没法接进多语言：
 * 描述符数组这样的<b>数据文件</b>（`const PARAMS = [{ label: '…' }]`，根本没有类）、
 * 纯函数模块（推断、算法、格式化），以及那些不是 Angular 组件的老面板。
 * 平台里这类文案有几千条，逐个去改构造函数既改不动、也改不对 —— 数据文件里压根没有构造函数。
 *
 * <p>走的是平台既有的 {@link ServiceLocator} 惯例（`@dotos1/duix/datastore` 早就这么拿
 * HttpClient 与 ToastrService），不新起一套机制。
 *
 * <p><b>取不到服务时返回 key 本身</b>，与 `translate` 管道的行为一致：宁可显示
 * `CROSSSECTION.BOTTOMBOX` 也不要显示 `undefined`，而且一眼就看得出是哪个键没配。
 * 宿主应用在根注入器就绪后要设 `ServiceLocator.injector = injector`，这一条本来就要做。
 *
 * <p><b>什么时候不要用它</b>：组件里能注入就注入 —— 注入的那份能跟着语言切换重新求值，
 * 而这个函数是<b>当场取值</b>。放在模块顶层的常量里（`const LABEL = t('X')`）等于把
 * 启动那一刻的语言钉死了，要在用到的时候才调。

 * @zh 执行 `t`，用于t。
 */
export function t(key: string, params?: Record<string, unknown>): string {
  const injector = ServiceLocator.injector;
  if (!injector) {
    return key;
  }
  const service = injector.get(TranslationService, null);
  if (!service) {
    return key;
  }
  const text = service.instant(key, params);
  return typeof text === 'string' ? text : key;
}
