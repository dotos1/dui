/**
 * @fileoverview Module `projects/testdui/src/app/m2-parity/m2-parity.component.ts` providing M2 visual parity showcase component.
 * @zh 模块文件 `projects/testdui/src/app/m2-parity/m2-parity.component.ts`，提供 M2 外观与动态主题 27 组合对齐验收组件。
 */

import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@dotos/dui/theme';

declare const Zone: { current?: { name?: string } } | undefined;

/**
 * Interface `ParityThemeOptions` defining runtime theme switch parameters for browser parity automation.
 * @zh 接口 `ParityThemeOptions`，定义浏览器自动化对比脚本切换主题的输入参数契约。
 */
export interface ParityThemeOptions {
  /**
   * Property `primary` (`string`) storing primary palette hue key.
   * @zh 属性 `primary`（类型：`string`），用于指定主色调色阶键名。
   */
  primary: string;
  /**
   * Property `accent` (`string`) storing accent palette hue key.
   * @zh 属性 `accent`（类型：`string`），用于指定强调色色阶键名。
   */
  accent: string;
  /**
   * Property `warn` (`string`) storing warn palette hue key.
   * @zh 属性 `warn`（类型：`string`），用于指定告警色色阶键名。
   */
  warn: string;
  /**
   * Property `type` (`'light' | 'dark' | 'darkblue'`) storing theme mode.
   * @zh 属性 `type`（类型：`'light' | 'dark' | 'darkblue'`），用于指定主题底色模式。
   */
  type: 'light' | 'dark' | 'darkblue';
  /**
   * Property `typography` (`'loose' | 'normal' | 'compact'`) storing density and typography scale.
   * @zh 属性 `typography`（类型：`'loose' | 'normal' | 'compact'`），用于指定排版与密度档位。
   */
  typography: 'loose' | 'normal' | 'compact';
  /**
   * Property `formType` (`'fill' | 'outline'`) storing form field appearance.
   * @zh 属性 `formType`（类型：`'fill' | 'outline'`），用于指定表单外观模式。
   */
  formType?: 'fill' | 'outline';
}

declare global {
  interface Window {
    __applyParityTheme?: (opts: ParityThemeOptions) => void;
    __toggleParityPanel?: () => void;
    __triggerParityZoneAsync?: () => void;
  }
}

/**
 * Angular component `M2ParityDialogComponent` providing dialog transition probe in `projects/testdui/src/app/m2-parity`.
 * @zh Angular 组件 `M2ParityDialogComponent`，用于验证弹窗开合动画与主题样式渲染。
 */
@Component({
  selector: 'app-m2-parity-dialog',
  template: `<h2 mat-dialog-title>Parity Dialog</h2><mat-dialog-content>Dialog Body</mat-dialog-content>`,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class M2ParityDialogComponent {}

/**
 * Angular component `M2ParityComponent` (selector: 'app-m2-parity') providing M2 parity showcase in `projects/testdui/src/app/m2-parity`.
 * @zh Angular 组件 `M2ParityComponent`（selector: 'app-m2-parity'），提供 M2 组件大观与动态主题对比视图。
 */
@Component({
  selector: 'app-m2-parity',
  templateUrl: './m2-parity.component.html',
  styleUrls: ['./m2-parity.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class M2ParityComponent implements OnInit, OnDestroy {
  /**
   * Property `panelExpanded` (`boolean`) storing expansion panel open state (default: `true`).
   * @zh 属性 `panelExpanded`（类型：`boolean`），用于存储展开面板开合状态（默认值：`true`）。
   */
  panelExpanded = true;

  /**
   * Property `panelOpenedCount` (`number`) storing opened event counter (default: `0`).
   * @zh 属性 `panelOpenedCount`（类型：`number`），用于记录面板打开事件触发次数（默认值：`0`）。
   */
  panelOpenedCount = 0;

  /**
   * Property `zoneName` (`string`) storing active Zone name (default: `'unknown'`).
   * @zh 属性 `zoneName`（类型：`string`），用于存储当前运行 Zone 名称（默认值：`'unknown'`）。
   */
  zoneName = 'unknown';

  /**
   * Property `asyncTick` (`number`) storing async setTimeout refresh counter (default: `0`).
   * @zh 属性 `asyncTick`（类型：`number`），用于验证 setTimeout 自动触发脏检查计数（默认值：`0`）。
   */
  asyncTick = 0;

  /**
   * Creates an instance of `M2ParityComponent` and initializes dependencies.
   * @zh 创建 `M2ParityComponent` 实例并注入主题与弹窗服务。
   * @param themeService - Injected theme service (`ThemeService`) / 注入的主题服务（`ThemeService`）
   * @param dialog - Injected Material dialog service (`MatDialog`) / 注入的弹窗服务（`MatDialog`）
   * @param ngZone - Injected Angular Zone (`NgZone`) / 注入的 Angular Zone（`NgZone`）
   */
  constructor(
    public readonly themeService: ThemeService,
    private readonly dialog: MatDialog,
    private readonly ngZone: NgZone
  ) {}

  /**
   * Angular lifecycle hook registering browser parity control hooks on `window`.
   * @zh Angular 生命周期钩子：初始化 Zone 状态并在 `window` 上注册自动化切换钩子。
   */
  ngOnInit(): void {
    this.zoneName = typeof Zone !== 'undefined' && Zone?.current?.name ? Zone.current.name : String(NgZone.isInAngularZone());

    window.__applyParityTheme = (opts: ParityThemeOptions): void => {
      this.ngZone.run(() => {
        this.themeService.changeTheme(
          opts.primary,
          opts.accent,
          opts.warn,
          opts.type,
          opts.typography,
          opts.formType || 'fill'
        );
      });
    };

    window.__toggleParityPanel = (): void => {
      this.ngZone.run(() => {
        this.panelExpanded = !this.panelExpanded;
      });
    };

    window.__triggerParityZoneAsync = (): void => {
      setTimeout(() => {
        this.asyncTick += 1;
      }, 20);
    };
  }

  /**
   * Opens a sample Material dialog to verify overlay theming and animation transitions.
   * @zh 打开示例弹窗以验证浮层主题与开合过渡动画。
   */
  openSampleDialog(): void {
    this.dialog.open(M2ParityDialogComponent, { width: '320px' });
  }

  /**
   * Triggers a `setTimeout` state mutation inside Angular Zone without manual `detectChanges()`.
   * @zh 在 Angular Zone 事件回调内触发 `setTimeout` 异步状态变更，验证无手动 `detectChanges()` 下视图自动刷新。
   */
  triggerZoneAsync(): void {
    this.zoneName = typeof Zone !== 'undefined' && Zone?.current?.name ? Zone.current.name : String(NgZone.isInAngularZone());
    setTimeout(() => {
      this.asyncTick += 1;
    }, 20);
  }

  /**
   * Angular lifecycle hook cleaning up global browser hooks on destroy.
   * @zh Angular 生命周期钩子：组件销毁时清理全局钩子。
   */
  ngOnDestroy(): void {
    delete window.__applyParityTheme;
    delete window.__toggleParityPanel;
    delete window.__triggerParityZoneAsync;
  }
}
