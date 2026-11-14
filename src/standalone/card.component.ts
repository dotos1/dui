/**
 * @fileoverview Module `src/standalone/card.component.ts` providing Zoneless Signal `DuiCardComponent`.
 * @zh 模块文件 `src/standalone/card.component.ts`，提供纯 Signal + 原生 CSS Grid/Flexbox + M3 表面令牌驱动的 `DuiCardComponent` 卡片容器组件。
 */

import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  input,
} from '@angular/core';

/**
 * Type alias `DuiCardPadding` enumerating card interior spacing presets.
 * @zh 类型别名 `DuiCardPadding`，枚举卡片内容区内边距档位。
 */
export type DuiCardPadding = 'none' | 'compact' | 'normal' | 'loose';

/**
 * Standalone Zoneless card component `<dui-standalone-card>` supporting Signal inputs and header/body/footer projection slots.
 * @zh 独立 Zoneless 卡片容器组件 `<dui-standalone-card>`，支持 `title`、`subtitle`、`elevated`、`padding` Signal 输入及头部附加区、主体、底部投影插槽。
 */
@Component({
  selector: 'dui-standalone-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="dui-s-card"
      [class.dui-s-card--elevated]="elevated()"
      [class.dui-s-card--pad-none]="padding() === 'none'"
      [class.dui-s-card--pad-compact]="padding() === 'compact'"
      [class.dui-s-card--pad-normal]="padding() === 'normal'"
      [class.dui-s-card--pad-loose]="padding() === 'loose'">
      @if (title() || subtitle()) {
        <header class="dui-s-card__header">
          <div class="dui-s-card__titles">
            @if (title()) {
              <h3 class="dui-s-card__title">{{ title() }}</h3>
            }
            @if (subtitle()) {
              <p class="dui-s-card__subtitle">{{ subtitle() }}</p>
            }
          </div>
          <div class="dui-s-card__extra">
            <ng-content select="[duiCardHeaderExtra]"></ng-content>
          </div>
        </header>
      }
      <div class="dui-s-card__body">
        <ng-content></ng-content>
      </div>
      <footer class="dui-s-card__footer">
        <ng-content select="[duiCardFooter]"></ng-content>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .dui-s-card {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background-color: var(--dui-surface-container, var(--mat-sys-surface-container, #f0f4f4));
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
        border: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
        overflow: hidden;
      }
      .dui-s-card--elevated {
        box-shadow: 0 6px 20px -4px color-mix(in srgb, var(--mat-sys-shadow, #000000) 18%, transparent);
      }
      .dui-s-card__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px 8px;
        border-bottom: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
      }
      .dui-s-card__titles {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .dui-s-card__title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.35;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-card__subtitle {
        margin: 0;
        font-size: 12px;
        line-height: 1.4;
        color: var(--mat-sys-on-surface-variant, #3f4948);
      }
      .dui-s-card--pad-none .dui-s-card__body {
        padding: 0;
      }
      .dui-s-card--pad-compact .dui-s-card__body {
        padding: 10px 12px;
      }
      .dui-s-card--pad-normal .dui-s-card__body {
        padding: 16px;
      }
      .dui-s-card--pad-loose .dui-s-card__body {
        padding: 24px;
      }
      .dui-s-card__footer:empty {
        display: none;
      }
      .dui-s-card__footer:not(:empty) {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 10px 16px;
        border-top: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
      }
    `,
  ],
})
export class DuiCardComponent {
  /**
   * Signal input `title` (`InputSignal<string>`) configuring card header title.
   * @zh Signal 输入 `title`（默认值 `''`），配置卡片主标题。
   */
  readonly title: InputSignal<string> = input<string>('');

  /**
   * Signal input `subtitle` (`InputSignal<string>`) configuring card header subtitle.
   * @zh Signal 输入 `subtitle`（默认值 `''`），配置卡片副标题说明。
   */
  readonly subtitle: InputSignal<string> = input<string>('');

  /**
   * Signal input `elevated` (`InputSignal<boolean>`) toggling elevation shadow.
   * @zh Signal 输入 `elevated`（默认值 `false`），控制是否开启海拔投影。
   */
  readonly elevated: InputSignal<boolean> = input<boolean>(false);

  /**
   * Signal input `padding` (`InputSignal<DuiCardPadding>`) configuring interior body spacing.
   * @zh Signal 输入 `padding`（默认值 `'normal'`），配置卡片主体内边距档位。
   */
  readonly padding: InputSignal<DuiCardPadding> = input<DuiCardPadding>('normal');
}
