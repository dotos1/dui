/**
 * 基础工具。
 *
 * <p>自研,替代 LEGACY 衍生的那份(409 行)。见 duix 的
 * `lib/PEEL-CLEANUP-PLAN.md` §P6。
 *
 * <p><b>行为按旧实现的实测输出对齐,不按"应该怎样"写。</b>
 * 几个反直觉但必须保留的点都在各自函数的注释里,门在 `tools/base/gate.mjs`。
 */

export function isNullOrUndefined(value: unknown): boolean {
  return value === undefined || value === null;
}

export function isUndefined(value: unknown): boolean {
  return value === undefined;
}

/**
 * 是不是"普通对象"。
 *
 * <p><b>数组与 `Date` 都算 false。</b>旧实现用的是
 * `Object.prototype.toString.call(v) === '[object Object]'`,
 * 于是 `[]` / `new Date()` 都不算。调用方(`extend` 的深合并、
 * `mergeDeep` 之类)正是靠这条把数组和日期当叶子节点处理 ——
 * 改成 `typeof v === 'object'` 会让日期被逐字段拆开合并。
 */
export function isObject(value: unknown): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/** 空串算 true;<b>纯空白不算</b>(旧实现不 trim)。 */
export function isBlankString(value: unknown): boolean {
  return value === '';
}

/**
 * 按点分路径取值。
 *
 * <p><b>中途遇到 `null` 会抛,不会返回 undefined。</b>
 * `getValue('n.x', { n: null })` → `TypeError`。这是旧实现的行为
 * (它只在每一步之后判 `undefined`,不判 `null`),而且有调用方靠它
 * 把"配置里显式写了 null"和"这一段不存在"区分开。补一个 null 守卫
 * 看着是修 bug,实际是改语义。
 */
export function getValue(nameSpace: string, obj: unknown): unknown {
  let value: unknown = obj;
  const splits: string[] = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
  for (let i = 0; i < splits.length && !isUndefined(value); i++) {
    value = (value as Record<string, unknown>)[splits[i]];
  }
  return value;
}

function isUnsafeKey(key: string): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

/** 按点分路径赋值。中途缺失的层级会补成空对象。 */
export function setValue(nameSpace: string, value: unknown, obj: Record<string, unknown>): Record<string, unknown> {
  const keys: string[] = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
  const start = obj || {};
  let fromObj: Record<string, unknown> = start;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isUnsafeKey(key)) {
      return start;
    }
    if (i + 1 === keys.length) {
      fromObj[key] = value === undefined ? {} : value;
    } else if (isNullOrUndefined(fromObj[key])) {
      fromObj[key] = {};
    }
    fromObj = fromObj[key] as Record<string, unknown>;
  }
  return start;
}

/**
 * 合并到 `copied`。
 *
 * <p>三处必须照抄的行为:
 *
 * <ol>
 *   <li><b>`undefined` 的值会把键删掉</b>,不是"跳过"。
 *       `extend({a:1}, {a:undefined})` → `{}`。</li>
 *   <li>浅合并时嵌套对象<b>整个替换</b>;深合并才逐键并。</li>
 *   <li>数组按下标并:浅合并 `[1,2] + [3]` → `[3]`(整替),
 *       深合并 → `[3,2]`(只覆盖下标 0)。</li>
 * </ol>
 */
export function extend(
  copied: Record<string, unknown>, first?: unknown, second?: unknown, deep?: boolean | unknown, ...rest: unknown[]
): Record<string, unknown> {
  const 源: unknown[] = [first, second, ...rest].filter((s) => s !== undefined && typeof s !== 'boolean');
  // 第四个位置传 true 表示深合并;更靠后的 boolean 也认(旧签名是变参)。
  const 深 = deep === true || rest.some((r) => r === true);
  const 目标 = copied || {};

  for (const src of 源) {
    if (!src || typeof src !== 'object') { continue; }
    for (const key of Object.keys(src as Record<string, unknown>)) {
      if (isUnsafeKey(key)) { continue; }
      const v = (src as Record<string, unknown>)[key];
      if (v === undefined) { delete 目标[key]; continue; }
      if (深 && (isObject(v) || Array.isArray(v))) {
        const 旧 = 目标[key];
        const 基 = Array.isArray(v)
          ? (Array.isArray(旧) ? 旧 : [])
          : (isObject(旧) ? 旧 : {});
        目标[key] = extend(基 as Record<string, unknown>, v, undefined, true);
      } else {
        目标[key] = v;
      }
    }
  }
  return 目标;
}

/** 浅合并到 `first`。`extend` 的两参数快捷方式。 */
export function merge(first: Record<string, unknown>, second: unknown): void {
  extend(first, second);
}

/** `key=value&…`,键与值都做百分号编码。`null` / `undefined` 会写成字面量。 */
export function queryParams(data: Record<string, unknown>): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent('' + data[key]))
    .join('&');
}

export function throwError(message: string): never {
  throw new Error(message);
}

let 序号 = 0;
/** 生成一个进程内唯一的 id。 */
export function getUniqueID(prefix?: string): string {
  return (prefix ? prefix + '_' : '') + 序号++ + '_' + Math.random().toString(36).slice(2, 8);
}

/** `12` → `'12px'`;已经带单位的原样返回。 */
export function formatUnit(value: string | number): string {
  const s = String(value);
  return /^[-+]?[0-9]*\.?[0-9]+$/.test(s) ? s + 'px' : s;
}

export function setImmediate(handler: Function): number {
  return window.setTimeout(handler, 0);
}
