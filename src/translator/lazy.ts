import { ServiceLocator } from '@dotos/dui/core/services';
import { TranslationService } from './translation.service';

/** 当前语言；取不到服务时返回空串（当成"还没就绪"，下次再算） */
function currentLang(): string {
  const injector = ServiceLocator.injector;
  if (!injector) {
    return '';
  }
  const service = injector.get(TranslationService, null);
  return service?.translate?.currentLang ?? '';
}

/**
 * 让一份<b>模块顶层的常量</b>跟着语言走。
 *
 * <pre>
 *   export const CLASS_LABEL = i18nLazy(() => ({
 *     oil: t('CROSSSECTION.FLUID_OIL'),
 *     gas: t('CROSSSECTION.FLUID_GAS'),
 *   }));
 * </pre>
 *
 * <p><b>为什么不能直接写 `t()`。</b>顶层常量的值在<b>模块加载那一刻</b>就算出来了，
 * 那时语言可能还没定；而平台切语言是<b>就地生效</b>的（`TranslationService.loadTranslation`
 * 只调 `translate.use(lang)`，不重载页面），所以算过一次就再也不会变 ——
 * 界面上表现为"切了语言，这几个标签还是中文"。全平台这样的常量有九百多条。
 *
 * <p><b>调用方一行都不用改。</b>返回的是个 Proxy：读属性、`Object.keys`、`in`、
 * 展开、`JSON.stringify` 都照常，只是每次读之前会看一眼语言变没变，变了就用工厂重算。
 * 所以 `CLASS_LABEL[k]`、`Object.entries(CLASS_LABEL)` 这些写法原样能用。
 *
 * <p><b>限制。</b>只包对象与数组 —— 字符串常量没法用 Proxy 代理，那种要在用到的
 * 地方调 `t()`。另外别把它的属性值缓存到别处（`const L = CLASS_LABEL.oil`），
 * 那等于又把语言钉死了一次。
 */
export function i18nLazy<T extends object>(factory: () => T): T {
  let cache: T | null = null;
  let lang: string | null = null;

  const target = (): T => {
    const now = currentLang();
    if (cache === null || lang !== now) {
      cache = factory();
      lang = now;
    }
    return cache;
  };

  // Proxy 的 target 只用来决定"这是数组还是对象"，实际读写一律转发到 target()
  const shape = (Array.isArray(factory()) ? [] : {}) as T;

  return new Proxy(shape, {
    get(_t, prop, receiver) {
      return Reflect.get(target() as object, prop, receiver);
    },
    has(_t, prop) {
      return Reflect.has(target() as object, prop);
    },
    ownKeys() {
      return Reflect.ownKeys(target() as object);
    },
    getOwnPropertyDescriptor(_t, prop) {
      const d = Reflect.getOwnPropertyDescriptor(target() as object, prop);
      // Proxy 不变式：报告出去的属性必须是可配置的，否则 Object.keys 会抛
      return d ? { ...d, configurable: true } : d;
    },
    set(_t, prop, value) {
      return Reflect.set(target() as object, prop, value);
    },
    deleteProperty(_t, prop) {
      return Reflect.deleteProperty(target() as object, prop);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(target() as object);
    },
  });
}
