/**
 * @fileoverview Module `src/standalone/button.component.ts` providing Zoneless Signal `DuiButtonComponent`.
 * @zh 模块文件 `src/standalone/button.component.ts`，提供纯 Signal + Zoneless + M3 令牌驱动的 `DuiButtonComponent` 按钮组件。
 */

import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

/**
 * Type alias `DuiButtonVariant` enumerating visual button styles.
 * @zh 类型别名 `DuiButtonVariant`，枚举按钮视觉变体类型。
 */
export type DuiButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tonal'
  | 'outlined'
  | 'ghost'
  | 'danger';

/**
 * Type alias `DuiButtonSize` enumerating enterprise button density sizes.
 * @zh 类型别名 `DuiButtonSize`，枚举企业高密度按钮尺寸档位。
 */
export type DuiButtonSize = 'compact' | 'normal' | 'loose';

/**
 * Standalone Zoneless button component `<dui-standalone-button>` driven by Angular Signals and M3 `--dui-*` / `--mat-sys-*` CSS variables.
 * @zh 独立 Zoneless 按钮组件 `<dui-standalone-button>`，基于 Angular Signal 原语与 M3 `--dui-*` / `--mat-sys-*` 变量构建，同时遵循护栏 A 支持命令式读写。
 */
@Component({
  selector: 'dui-standalone-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="dui-s-btn"
      [attr.type]="type()"
      [class.dui-s-btn--primary]="effectiveVariant() === 'primary'"
      [class.dui-s-btn--secondary]="effectiveVariant() === 'secondary'"
      [class.dui-s-btn--tonal]="effectiveVariant() === 'tonal'"
      [class.dui-s-btn--outlined]="effectiveVariant() === 'outlined'"
      [class.dui-s-btn--ghost]="effectiveVariant() === 'ghost'"
      [class.dui-s-btn--danger]="effectiveVariant() === 'danger'"
      [class.dui-s-btn--compact]="effectiveSize() === 'compact'"
      [class.dui-s-btn--normal]="effectiveSize() === 'normal'"
      [class.dui-s-btn--loose]="effectiveSize() === 'loose'"
      [class.dui-s-btn--loading]="effectiveLoading()"
      [disabled]="isInteractionBlocked()"
      [attr.aria-disabled]="isInteractionBlocked()"
      [attr.aria-busy]="effectiveLoading()"
      (click)="handleClick($event)">
      @if (effectiveLoading()) {
        <span class="dui-s-btn__spinner" aria-hidden="true"></span>
      } @else if (effectiveIcon()) {
        <span class="dui-s-btn__icon material-icons" aria-hidden="true">{{ effectiveIcon() }}</span>
      }
      <span class="dui-s-btn__label"><ng-content></ng-content></span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      .dui-s-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-radius: 6px;
        border: 1px solid transparent;
        font-family: inherit;
        font-weight: 500;
        line-height: 1.2;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease, opacity 140ms ease;
      }
      .dui-s-btn:focus-visible {
        outline: 2px solid var(--dui-primary, var(--mat-sys-primary, #006a6a));
        outline-offset: 2px;
      }
      .dui-s-btn--compact {
        height: 28px;
        padding: 0 10px;
        font-size: 12px;
      }
      .dui-s-btn--normal {
        height: 34px;
        padding: 0 14px;
        font-size: 13px;
      }
      .dui-s-btn--loose {
        height: 40px;
        padding: 0 18px;
        font-size: 14px;
      }
      .dui-s-btn--primary {
        background-color: var(--dui-primary, var(--mat-sys-primary, #006a6a));
        color: var(--dui-on-primary, var(--mat-sys-on-primary, #ffffff));
      }
      .dui-s-btn--secondary {
        background-color: var(--mat-sys-secondary, #4a6363);
        color: var(--mat-sys-on-secondary, #ffffff);
      }
      .dui-s-btn--tonal {
        background-color: var(--dui-primary-container, var(--mat-sys-secondary-container, #cce8e7));
        color: var(--mat-sys-on-secondary-container, var(--dui-on-surface, #051f1f));
      }
      .dui-s-btn--outlined {
        background-color: transparent;
        border-color: var(--dui-outline-variant, var(--mat-sys-outline, #6f7979));
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-btn--ghost {
        background-color: transparent;
        color: var(--dui-primary, var(--mat-sys-primary, #006a6a));
      }
      .dui-s-btn--ghost:hover:not(:disabled),
      .dui-s-btn--outlined:hover:not(:disabled) {
        background-color: var(--dui-hover, rgba(0, 0, 0, 0.05));
      }
      .dui-s-btn--danger {
        background-color: var(--dui-warn, var(--mat-sys-error, #ba1a1a));
        color: var(--mat-sys-on-error, #ffffff);
      }
      .dui-s-btn:disabled {
        opacity: 0.48;
        cursor: not-allowed;
      }
      .dui-s-btn__icon {
        font-size: 16px;
        line-height: 1;
      }
      .dui-s-btn__spinner {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid currentColor;
        border-right-color: transparent;
        animation: dui-s-btn-spin 680ms linear infinite;
      }
      @keyframes dui-s-btn-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class DuiButtonComponent {
  /**
   * Signal input `variant` (`InputSignal<DuiButtonVariant>`) configuring visual button variant.
   * @zh Signal 输入 `variant`（默认值 `'primary'`），配置按钮视觉变体。
   */
  readonly variant: InputSignal<DuiButtonVariant> = input<DuiButtonVariant>('primary');

  /**
   * Signal input `size` (`InputSignal<DuiButtonSize>`) configuring density size.
   * @zh Signal 输入 `size`（默认值 `'normal'`），配置按钮高密度尺寸档位。
   */
  readonly size: InputSignal<DuiButtonSize> = input<DuiButtonSize>('normal');

  /**
   * Signal input `disabled` (`InputSignal<boolean>`) configuring disabled state.
   * @zh Signal 输入 `disabled`（默认值 `false`），配置按钮禁用状态。
   */
  readonly disabled: InputSignal<boolean> = input<boolean>(false);

  /**
   * Signal input `loading` (`InputSignal<boolean>`) configuring loading indicator state.
   * @zh Signal 输入 `loading`（默认值 `false`），配置按钮加载忙碌状态。
   */
  readonly loading: InputSignal<boolean> = input<boolean>(false);

  /**
   * Signal input `icon` (`InputSignal<string>`) configuring optional Material icon ligature.
   * @zh Signal 输入 `icon`（默认值 `''`），配置前置图标名称。
   */
  readonly icon: InputSignal<string> = input<string>('');

  /**
   * Signal input `type` (`InputSignal<"button" | "reset" | "submit">`) configuring native button type attribute.
   * @zh Signal 输入 `type`（默认值 `'button'`），配置原生 `button` 的 `type` 属性。
   */
  readonly type: InputSignal<'button' | 'submit' | 'reset'> = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Signal output `clicked` (`OutputEmitterRef<MouseEvent>`) emitting pointer click events when enabled.
   * @zh Signal 输出 `clicked`，在非禁用且非加载态点击时发出 `MouseEvent`。
   */
  readonly clicked: OutputEmitterRef<MouseEvent> = output<MouseEvent>();

  /** 护栏 A：支持外部命令式覆写的内部 WritableSignal */
  private readonly _variantOverride: WritableSignal<DuiButtonVariant | null> = signal<DuiButtonVariant | null>(null);
  private readonly _sizeOverride: WritableSignal<DuiButtonSize | null> = signal<DuiButtonSize | null>(null);
  private readonly _disabledOverride: WritableSignal<boolean | null> = signal<boolean | null>(null);
  private readonly _loadingOverride: WritableSignal<boolean | null> = signal<boolean | null>(null);
  private readonly _iconOverride: WritableSignal<string | null> = signal<string | null>(null);

  /**
   * Computed signal `effectiveVariant` resolving imperative override or Signal input `variant`.
   * @zh 计算属性 `effectiveVariant`，合并命令式覆写与模板输入后的最终按钮变体。
   */
  readonly effectiveVariant: Signal<DuiButtonVariant> = computed<DuiButtonVariant>(
    () => this._variantOverride() ?? this.variant(),
  );

  /**
   * Computed signal `effectiveSize` resolving imperative override or Signal input `size`.
   * @zh 计算属性 `effectiveSize`，合并命令式覆写与模板输入后的最终尺寸档位。
   */
  readonly effectiveSize: Signal<DuiButtonSize> = computed<DuiButtonSize>(
    () => this._sizeOverride() ?? this.size(),
  );

  /**
   * Computed signal `effectiveDisabled` resolving imperative override or Signal input `disabled`.
   * @zh 计算属性 `effectiveDisabled`，合并命令式覆写与模板输入后的禁用态。
   */
  readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this._disabledOverride() ?? this.disabled(),
  );

  /**
   * Computed signal `effectiveLoading` resolving imperative override or Signal input `loading`.
   * @zh 计算属性 `effectiveLoading`，合并命令式覆写与模板输入后的加载态。
   */
  readonly effectiveLoading: Signal<boolean> = computed<boolean>(
    () => this._loadingOverride() ?? this.loading(),
  );

  /**
   * Computed signal `effectiveIcon` resolving imperative override or Signal input `icon`.
   * @zh 计算属性 `effectiveIcon`，合并命令式覆写与模板输入后的前置图标名。
   */
  readonly effectiveIcon: Signal<string> = computed<string>(
    () => this._iconOverride() ?? this.icon(),
  );

  /**
   * Computed signal `isInteractionBlocked` returning `true` when either disabled or loading.
   * @zh 计算属性 `isInteractionBlocked`，当按钮处于禁用或加载中时阻断点击交互。
   */
  readonly isInteractionBlocked: Signal<boolean> = computed<boolean>(
    () => this.effectiveDisabled() || this.effectiveLoading(),
  );

  /**
   * Imperatively overrides or resets button `variant` (Guardrail A compatibility).
   * @zh 命令式设置或重置按钮变体（护栏 A 命令式读写兼容）。
   * @param nextVariant - Variant override or `null` to restore Signal input (`DuiButtonVariant`) / 变体覆写值或 `null`
   */
  setVariant(nextVariant: DuiButtonVariant | null): void {
    this._variantOverride.set(nextVariant);
  }

  /**
   * Imperatively overrides or resets `size` (Guardrail A compatibility).
   * @zh 命令式设置或重置按钮尺寸（护栏 A 命令式读写兼容）。
   * @param nextSize - Size override or `null` (`DuiButtonSize`) / 尺寸覆写值或 `null`
   */
  setSize(nextSize: DuiButtonSize | null): void {
    this._sizeOverride.set(nextSize);
  }

  /**
   * Imperatively overrides or resets `disabled` (Guardrail A compatibility).
   * @zh 命令式设置或重置按钮禁用状态（护栏 A 命令式读写兼容）。
   * @param isDisabled - Disabled override or `null` (`boolean`) / 禁用态覆写值或 `null`
   */
  setDisabled(isDisabled: boolean | null): void {
    this._disabledOverride.set(isDisabled);
  }

  /**
   * Imperatively overrides or resets `loading` (Guardrail A compatibility).
   * @zh 命令式设置或重置按钮加载状态（护栏 A 命令式读写兼容）。
   * @param isLoading - Loading override or `null` (`boolean`) / 加载态覆写值或 `null`
   */
  setLoading(isLoading: boolean | null): void {
    this._loadingOverride.set(isLoading);
  }

  /**
   * Imperatively overrides or resets `icon` (Guardrail A compatibility).
   * @zh 命令式设置或重置按钮图标（护栏 A 命令式读写兼容）。
   * @param nextIcon - Icon override or `null` (`string`) / 图标覆写值或 `null`
   */
  setIcon(nextIcon: string | null): void {
    this._iconOverride.set(nextIcon);
  }

  /**
   * Handles native button click and emits `clicked` when interaction is allowed.
   * @zh 处理原生按钮点击事件，在未禁用且未加载时向外发出 `clicked` 事件。
   * @param event - Mouse click event (`MouseEvent`) / 鼠标点击事件对象（`MouseEvent`）
   */
  handleClick(event: MouseEvent): void {
    if (this.isInteractionBlocked()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
