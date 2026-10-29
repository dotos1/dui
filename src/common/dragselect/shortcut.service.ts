/**
 * @fileoverview Module `src/common/dragselect/shortcut.service.ts` providing shortcut service definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/shortcut.service.ts`，提供快捷键服务相关的定义与实现。
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { KeyboardEventsService } from './keyboard-events.service';
import { DragToSelectConfig } from './models';
import { CONFIG } from './tokens';

/**
 * Constant/variable `SUPPORTED_META_KEYS` defining supported meta keys in `src/common/dragselect`.
 * @zh 常量/变量 `SUPPORTED_META_KEYS`，定义 `src/common/dragselect` 中的SUPPORTED元数据键列表。
 */
const SUPPORTED_META_KEYS = {
  alt: true,
  shift: true,
  meta: true,
  ctrl: true,
};

/**
 * Constant/variable `SUPPORTED_KEYS` defining supported keys in `src/common/dragselect`.
 * @zh 常量/变量 `SUPPORTED_KEYS`，定义 `src/common/dragselect` 中的SUPPORTED键列表。
 */
const SUPPORTED_KEYS = /[a-z]/;

/**
 * Constant/variable `META_KEY` defining meta key in `src/common/dragselect`.
 * @zh 常量/变量 `META_KEY`，定义 `src/common/dragselect` 中的元数据键。
 */
const META_KEY = 'meta';

/**
 * Constant/variable `KEY_ALIASES` defining key aliases in `src/common/dragselect`.
 * @zh 常量/变量 `KEY_ALIASES`，定义 `src/common/dragselect` 中的键ALIASES。
 */
const KEY_ALIASES = {
  [META_KEY]: ['ctrl', 'meta'],
};

/**
 * Constant/variable `SUPPORTED_SHORTCUTS` defining supported shortcuts in `src/common/dragselect`.
 * @zh 常量/变量 `SUPPORTED_SHORTCUTS`，定义 `src/common/dragselect` 中的SUPPORTED快捷键列表。
 */
const SUPPORTED_SHORTCUTS = {
  moveRangeStart: true,
  disableSelection: true,
  toggleSingleItem: true,
  addToSelection: true,
  removeFromSelection: true,
};

/**
 * Constant/variable `ERROR_PREFIX` defining error prefix in `src/common/dragselect`.
 * @zh 常量/变量 `ERROR_PREFIX`，定义 `src/common/dragselect` 中的错误前缀。
 */
const ERROR_PREFIX = '[ShortcutService]';

/**
 * Interface `KeyState` defining the contract and properties for key state.
 * @zh 接口 `KeyState`，定义键状态的数据结构契约与属性规范。
 */
interface KeyState {
  /**
   * Property `code` (`string`) storing code.
   * @zh 属性 `code`（类型：`string`），用于存储或配置编码。
   */
  code: string;
  /**
   * Property `pressed` (`boolean`) storing pressed.
   * @zh 属性 `pressed`（类型：`boolean`），用于存储或配置按下。
   */
  pressed: boolean;
}

/**
 * Parses the drag-to-select config's keyboard shortcut strings (e.g. `"ctrl+shift"`) and
 * exposes methods to check whether a given shortcut is currently held during an event.
 * @zh 解析拖拽框选配置中的键盘快捷键字符串（如 `"ctrl+shift"`），
 * 并提供方法判断某个快捷键在事件发生时是否处于按下状态。
 */
@Injectable()
export class ShortcutService {
  /**
   * Property `_shortcuts` (`{ [key: string]: string[][]; }`) storing shortcuts (default: `{}`).
   * @zh 属性 `_shortcuts`（类型：`{ [key: string]: string[][]; }`），用于存储或配置快捷键列表（默认值：`{}`）。
   */
  private _shortcuts: { [key: string]: string[][] } = {};

  /**
   * Property `_latestShortcut` (`Map<string, boolean>`) storing latest shortcut (default: `new Map()`).
   * @zh 属性 `_latestShortcut`（类型：`Map<string, boolean>`），用于存储或配置latest快捷键（默认值：`new Map()`）。
   */
  private _latestShortcut: Map<string, boolean> = new Map();

  /**
   * Creates an instance of `ShortcutService` and initializes its dependencies and internal state.
   * @zh 创建 `ShortcutService` 实例，并初始化其依赖项与内部状态。
   * @param platformId - Injected or initial platform id (`Record<string, unknown>`) / 注入或传入的platform唯一标识（`Record<string, unknown>`）
   * @param config - Injected or initial config (`DragToSelectConfig`) / 注入或传入的配置（`DragToSelectConfig`）
   * @param keyboardEvents - Injected or initial keyboard events (`KeyboardEventsService`) / 注入或传入的键盘事件集合（`KeyboardEventsService`）
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Record<string, unknown>,
    @Inject(CONFIG) config: DragToSelectConfig,
    private keyboardEvents: KeyboardEventsService
  ) {
    this._shortcuts = this._createShortcutsFromConfig(config.shortcuts);

    if (isPlatformBrowser(this.platformId)) {
      const keydown$ = this.keyboardEvents.keydown$.pipe(
        map<KeyboardEvent, KeyState>((event) => ({ code: event.code, pressed: true }))
      );

      const keyup$ = this.keyboardEvents.keyup$.pipe(
        map<KeyboardEvent, KeyState>((event) => ({ code: event.code, pressed: false }))
      );
  //@ts-ignore
      merge<KeyState>(keydown$, keyup$)
        .pipe(
          distinctUntilChanged((prev:{ pressed?; code? }, curr:{ pressed?; code? }) => {
            return prev.pressed === curr.pressed && prev.code === curr.code;
          })
        )
        .subscribe((keyState) => {
          if (keyState.pressed) {
            this._latestShortcut.set(keyState.code, true);
          } else {
            this._latestShortcut.delete(keyState.code);
          }
        });
    }
  }

  /**
   * Whether the configured "disable selection" shortcut is currently held.
   * @zh 配置的"禁用选择"快捷键当前是否处于按下状态。
   */
  disableSelection(event: Event) {
    return this._isShortcutPressed('disableSelection', event);
  }

  /**
   * Whether the configured "move range start" shortcut is currently held.
   * @zh 配置的"移动范围起点"快捷键当前是否处于按下状态。
   */
  moveRangeStart(event: Event) {
    return this._isShortcutPressed('moveRangeStart', event);
  }

  /**
   * Whether the configured "toggle single item" shortcut is currently held.
   * @zh 配置的"切换单个条目"快捷键当前是否处于按下状态。
   */
  toggleSingleItem(event: Event) {
    return this._isShortcutPressed('toggleSingleItem', event);
  }

  /**
   * Whether the configured "add to selection" shortcut is currently held.
   * @zh 配置的"添加到选中"快捷键当前是否处于按下状态。
   */
  addToSelection(event: Event) {
    return this._isShortcutPressed('addToSelection', event);
  }

  /**
   * Whether the configured "remove from selection" shortcut is currently held.
   * @zh 配置的"从选中中移除"快捷键当前是否处于按下状态。
   */
  removeFromSelection(event: Event) {
    return this._isShortcutPressed('removeFromSelection', event);
  }

  /**
   * Whether either the "add to selection" or "remove from selection" shortcut is currently held.
   * @zh "添加到选中"或"从选中中移除"快捷键中的任意一个当前是否处于按下状态。
   */
  extendedSelectionShortcut(event: Event) {
    return this.addToSelection(event) || this.removeFromSelection(event);
  }

  /**
   * Executes `_createShortcutsFromConfig` to handle create shortcuts from config.
   * @zh 执行 `_createShortcutsFromConfig`，用于创建快捷键列表从配置。
   * @param shortcuts - shortcuts parameter (`{ [key: string]: string; }`) / 快捷键列表参数（`{ [key: string]: string; }`）
   */
  private _createShortcutsFromConfig(shortcuts: { [key: string]: string }) {
    const shortcutMap: { [key: string]: string[][] } = {};

    for (const [key, shortcutsForCommand] of Object.entries(shortcuts)) {
      if (!this._isSupportedShortcut(key)) {
        throw new Error(this._getErrorMessage(`Shortcut ${key} not supported`));
      }

      shortcutsForCommand
        .replace(/ /g, '')
        .split(',')
        .forEach((shortcut) => {
          if (!shortcutMap[key]) {
            shortcutMap[key] = [];
          }

          const combo = shortcut.split('+');
          const cleanCombos = this._substituteKey(shortcut, combo, META_KEY);

          cleanCombos.forEach((cleanCombo) => {
            const unsupportedKey = this._isSupportedCombo(cleanCombo);

            if (unsupportedKey) {
              throw new Error(this._getErrorMessage(`Key '${unsupportedKey}' in shortcut ${shortcut} not supported`));
            }

            shortcutMap[key].push(
              cleanCombo.map((comboKey) => {
                return SUPPORTED_META_KEYS[comboKey] ? `${comboKey}Key` : `Key${comboKey.toUpperCase()}`;
              })
            );
          });
        });
    }

    return shortcutMap;
  }

  /**
   * Executes `_substituteKey` to handle substitute key.
   * @zh 执行 `_substituteKey`，用于substitute键。
   * @param shortcut - shortcut parameter (`string`) / 快捷键参数（`string`）
   * @param combo - combo parameter (`string[]`) / combo参数（`string[]`）
   * @param substituteKey - substitute key parameter (`string`) / substitute键参数（`string`）
   */
  private _substituteKey(shortcut: string, combo: Array<string>, substituteKey: string) {
    const hasSpecialKey = shortcut.includes(substituteKey);
    const substitutedShortcut: string[][] = [];

    if (hasSpecialKey) {
      const cleanShortcut = combo.filter((element) => element !== META_KEY);

      KEY_ALIASES.meta.forEach((alias) => {
        substitutedShortcut.push([...cleanShortcut, alias]);
      });
    } else {
      substitutedShortcut.push(combo);
    }

    return substitutedShortcut;
  }

  /**
   * Executes `_getErrorMessage` to handle get error message.
   * @zh 执行 `_getErrorMessage`，用于获取错误消息。
   * @param message - message parameter (`string`) / 消息参数（`string`）
   */
  private _getErrorMessage(message: string) {
    return `${ERROR_PREFIX} ${message}`;
  }

  /**
   * Executes `_isShortcutPressed` to handle is shortcut pressed.
   * @zh 执行 `_isShortcutPressed`，用于是否为快捷键按下。
   * @param shortcutName - shortcut name parameter (`string`) / 快捷键名称参数（`string`）
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private _isShortcutPressed(shortcutName: string, event: Event) {
    const shortcuts = this._shortcuts[shortcutName];

    return shortcuts.some((shortcut) => {
      return shortcut.every((key) => this._isKeyPressed(event, key));
    });
  }

  /**
   * Executes `_isKeyPressed` to handle is key pressed.
   * @zh 执行 `_isKeyPressed`，用于是否为键按下。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   */
  private _isKeyPressed(event: Event, key: string) {
    return key.startsWith('Key') ? this._latestShortcut.has(key) : event[key];
  }

  /**
   * Executes `_isSupportedCombo` to handle is supported combo.
   * @zh 执行 `_isSupportedCombo`，用于是否为SupportedCombo。
   * @param combo - combo parameter (`string[]`) / combo参数（`string[]`）
   */
  private _isSupportedCombo(combo: Array<string>) {
    let unsupportedKey = null;

    combo.forEach((key) => {
      if (!SUPPORTED_META_KEYS[key] && (!SUPPORTED_KEYS.test(key) || this._isSingleChar(key))) {
        unsupportedKey = key;
        return;
      }
    });

    return unsupportedKey;
  }

  /**
   * Executes `_isSingleChar` to handle is single char.
   * @zh 执行 `_isSingleChar`，用于是否为单个字符。
   * @param key - key parameter (`string`) / 键参数（`string`）
   */
  private _isSingleChar(key: string) {
    return key.length > 1;
  }

  /**
   * Executes `_isSupportedShortcut` to handle is supported shortcut.
   * @zh 执行 `_isSupportedShortcut`，用于是否为Supported快捷键。
   * @param shortcut - shortcut parameter (`string`) / 快捷键参数（`string`）
   */
  private _isSupportedShortcut(shortcut: string) {
    return SUPPORTED_SHORTCUTS[shortcut];
  }
}
