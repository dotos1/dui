/**
 * @fileoverview Module `projects/testdui/src/app/m2-parity/m2-parity.component.ts` providing M2 visual parity showcase component.
 * Covers 16 Material categories, 6 DUI custom components (`ng-scrollbar`, `query-builder`, `toggle-select`, `date-field`,
 * `dui-card-view`, `link-preview`), complete M2 typography scale (`h1~h6`, `display-1`), and downstream `duix`/`sdos` `loadTheme` probes.
 * @zh 模块文件 `projects/testdui/src/app/m2-parity/m2-parity.component.ts`，提供覆盖 16 类 Material 组件、6 类 DUI 自研组件、完整 M2 字阶及下游 `duix`/`sdos` 动态主题探针的 27 组合对齐验收组件。
 */

import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import { CardViewBoolItemModel, CardViewItem, CardViewTextItemModel } from '@dotos1/dui/data/cardview';
import { ToggleHeaderOption } from '@dotos1/dui/form/toggle-select';
import { DotosConfig, DotosConfigService, matColor, matThemeElevation, Theme, ThemeService } from '@dotos1/dui/theme';
import { OpenGraphMetaData } from '@dotos1/dui/ux/link-preview';
import { QueryBuilderConfig, RuleSet } from '@dotos1/dui/ux/query-builder';
import { Observable, of } from 'rxjs';

declare const Zone: { current?: { name?: string } } | undefined;

/**
 * Constant `PARITY_STORAGE_KEY` matching `AppComponent` storage key for cold-start reload verification.
 * @zh 常量 `PARITY_STORAGE_KEY`，对齐宿主 `AppComponent` 读取的本地存储键以验证冷启动一致性。
 */
const PARITY_STORAGE_KEY = 'dotosConfig';

/**
 * Representative downstream `dotos1/duix` `loadTheme` factory reproducing `DuixFlowNodeTheme`, `fileViewerTheme`, and `DuixFlowTheme` selectors verbatim.
 * @zh 复现下游 `dotos1/duix`（`DuixFlowNodeTheme`、`fileViewerTheme`、`DuixFlowTheme`）真实选择器的代表性动态主题探针函数。
 * @param theme - Runtime theme (`Theme`) / 运行时主题对象（`Theme`）
 * @returns Style rule map (`Record<string, unknown>`) / 样式规则对象
 */
function duixParityProbeTheme(theme: Theme): Record<string, unknown> {
  const primary = matColor(theme.primary);
  return {
    '.flow-node': {
      color: matColor(theme.foreground, 'text'),
    },
    '.flow-node .selected, .flow-node:focus,  .flow-node:focus-visible': Object.assign(
      { border: ' 1px solid ' + matColor(theme.foreground, 'slider-off-active') },
      matThemeElevation(2, theme, 1)
    ),
    '.flow-node &.selectable &.selected,&:focus,&:focus-visible': Object.assign({}, matThemeElevation(2, theme, 1)),
    '.flow-node-default,.flow-node-input,.flow-node-output,.flow-node-group': {
      'border-color': matColor(theme.foreground, 'divider'),
      color: matColor(theme.foreground, 'text'),
      'background-color': matColor(theme.background, 'card'),
    },
    '.flow-node-default .selectable :hover': Object.assign({}, matThemeElevation(1, theme, 1)),
    '.cropper-center &::before,&::after': {
      'background-color': matColor(theme.background, 'card'),
    },
    '.cropper-view-box': {
      outline: '1px solid ' + primary,
      'outline-color': matColor(theme.foreground, 'divider'),
    },
    '.checklist-item': {
      color: matColor(theme.foreground, 'text'),
      'background-color': matColor(theme.background, 'card'),
    },
    '.checklist-item &:hover': {
      'background-color': matColor(theme.background, 'hover'),
    },
  };
}

/**
 * Representative downstream `dotos1/sdos` `loadTheme` factory reproducing `sdosMapTheme` selectors verbatim.
 * @zh 复现下游 `dotos1/sdos`（`sdosMapTheme`）真实选择器的代表性动态主题探针函数。
 * @param theme - Runtime theme (`Theme`) / 运行时主题对象（`Theme`）
 * @returns Style rule map (`Record<string, unknown>`) / 样式规则对象
 */
function sdosParityProbeTheme(theme: Theme): Record<string, unknown> {
  const backgroundCardColor: string = matColor(theme.background, 'card', 0.93);
  const shadowColor: string = matColor(theme.foreground, 'disabled-button');
  return {
    '.sdos-menu-container': {
      'background-color': backgroundCardColor,
      'box-shadow': '0px 1px 4px ' + shadowColor,
    },
    '.sdos-menu-container &:hover': {
      'background-color': matColor(theme.background, 'focused-button'),
    },
    '.sdos-cleardraw-button-container': {
      color: matColor(theme.foreground, 'text'),
      'background-color': matColor(theme.background, 'raised-button', 0.93),
      'box-shadow': ' 0px 1px 4px ' + shadowColor,
    },
    '.sdos-cleardraw-button-container &:hover': {
      'background-color': matColor(theme.background, 'selected-button', 0.93),
    },
    '.preview-page': {
      border: ' 1px solid  ' + matColor(theme.foreground, 'divider'),
      'box-shadow': ' 0px 1px 4px ' + shadowColor,
    },
  };
}

/**
 * Interface `ParityTableRow` defining sample row structure for `mat-table` parity inspection.
 * @zh 接口 `ParityTableRow`，定义用于 `mat-table` 外观对齐验收的示例行数据结构。
 */
export interface ParityTableRow {
  /**
   * Property `code` (`string`) storing row code.
   * @zh 属性 `code`（类型：`string`），存储编码列文本。
   */
  code: string;
  /**
   * Property `name` (`string`) storing row name.
   * @zh 属性 `name`（类型：`string`），存储名称列文本。
   */
  name: string;
  /**
   * Property `status` (`string`) storing row status.
   * @zh 属性 `status`（类型：`string`），存储状态列文本。
   */
  status: string;
}

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
    __persistParityConfig?: (opts: ParityThemeOptions) => void;
    __closeParityDialogs?: () => void;
    __toggleParityPanel?: () => void;
    __triggerParityZoneAsync?: () => void;
  }
}

/**
 * Angular component `M2ParityDialogComponent` providing dialog transition and surface probe in `projects/testdui/src/app/m2-parity`.
 * @zh Angular 组件 `M2ParityDialogComponent`，用于验证弹窗容器主题表面、标题/正文默认文本色与开合动画过渡。
 */
@Component({
  selector: 'app-m2-parity-dialog',
  template: `<h2 mat-dialog-title data-parity="dialog-title">Parity Dialog</h2><mat-dialog-content data-parity="dialog-content">Dialog Body</mat-dialog-content>`,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class M2ParityDialogComponent {}

/**
 * Angular component `M2ParityComponent` (selector: 'app-m2-parity') providing Material + DUI + duix/sdos M2 parity showcase.
 * @zh Angular 组件 `M2ParityComponent`（selector: 'app-m2-parity'），提供覆盖 Material 16 类、DUI 6 类组件及下游 `duix`/`sdos` 动态主题的对比视图。
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
   * Property `displayedColumns` (`string[]`) storing `mat-table` column identifiers.
   * @zh 属性 `displayedColumns`（类型：`string[]`），定义 `mat-table` 展示列键名。
   */
  readonly displayedColumns: string[] = ['code', 'name', 'status'];

  /**
   * Property `tableRows` (`ParityTableRow[]`) storing deterministic `mat-table` sample rows.
   * @zh 属性 `tableRows`（类型：`ParityTableRow[]`），存储 `mat-table` 固定验收数据行。
   */
  readonly tableRows: ParityTableRow[] = [
    { code: 'DUI-01', name: 'M2 Sentinel', status: 'Active' },
    { code: 'DUI-02', name: 'Zone Default', status: 'Ready' },
  ];

  /**
   * Property `queryData` (`RuleSet`) storing deterministic `query-builder` ruleset data.
   * @zh 属性 `queryData`（类型：`RuleSet`），存储 `query-builder` 固定查询规则树数据。
   */
  queryData: RuleSet = {
    condition: 'and',
    rules: [
      { field: 'status', operator: '=', value: 'active' },
      {
        condition: 'or',
        rules: [{ field: 'priority', operator: '>=', value: 2 }],
      },
    ],
  };

  /**
   * Property `queryConfig` (`QueryBuilderConfig`) storing `query-builder` field configuration.
   * @zh 属性 `queryConfig`（类型：`QueryBuilderConfig`），存储 `query-builder` 字段定义配置。
   */
  readonly queryConfig: QueryBuilderConfig = {
    fields: {
      status: { name: 'Status', type: 'string', operators: ['=', '!='] },
      priority: { name: 'Priority', type: 'number', operators: ['>=', '<='] },
    },
  };

  /**
   * Property `toggleVal` (`string`) storing active `toggle-select` value.
   * @zh 属性 `toggleVal`（类型：`string`），存储 `toggle-select` 当前选中项值。
   */
  toggleVal = 'day';

  /**
   * Property `toggleOptions` (`ToggleHeaderOption[]`) storing `toggle-select` option items.
   * @zh 属性 `toggleOptions`（类型：`ToggleHeaderOption[]`），存储 `toggle-select` 选项列表。
   */
  readonly toggleOptions: ToggleHeaderOption[] = [
    { name: 'Day', value: 'day' },
    { name: 'Week', value: 'week' },
  ];

  /**
   * Property `fixedParityDate` (`Date`) storing deterministic calendar date (`2026-01-15T10:30:00`).
   * @zh 属性 `fixedParityDate`（类型：`Date`），存储固定验收日期（`2026-01-15T10:30:00`），避免系统时钟导致截图抖动。
   */
  readonly fixedParityDate: Date = new Date(2026, 0, 15, 10, 30, 0);

  /**
   * Property `dateFormConfig` (`Record<string, unknown>`) storing `date-field` dynamic form configuration.
   * @zh 属性 `dateFormConfig`（类型：`Record<string, unknown>`），存储 `date-field` 动态表单项配置。
   */
  readonly dateFormConfig: Record<string, unknown> = {
    items: [
      {
        xtype: 'date-field',
        name: 'scheduleDate',
        label: 'Schedule Date',
        type: 'date',
        wrappers: ['form-field'],
        defaultValue: new Date(2026, 0, 15, 10, 30, 0),
      },
    ],
  };

  /**
   * Property `cardViewProperties` (`CardViewItem[]`) storing `dui-card-view` item models.
   * @zh 属性 `cardViewProperties`（类型：`CardViewItem[]`），存储 `dui-card-view` 属性项模型数组。
   */
  readonly cardViewProperties: CardViewItem[] = [
    new CardViewTextItemModel({
      label: 'Application',
      value: 'DotOS Platform',
      key: 'appName',
      editable: true,
      clickable: false,
    }),
    new CardViewTextItemModel({
      label: 'Portal Link',
      value: 'Open Console',
      key: 'portalLink',
      editable: false,
      clickable: true,
      icon: 'open_in_new',
    }),
    new CardViewBoolItemModel({
      label: 'Audit Enabled',
      value: true,
      key: 'auditEnabled',
      editable: true,
    }),
  ];

  /**
   * Property `previewLinks` (`string[]`) storing deterministic URL list for `link-preview`.
   * @zh 属性 `previewLinks`（类型：`string[]`），存储用于 `link-preview` 的固定离线链接列表。
   */
  readonly previewLinks: string[] = ['https://dotos.internal/docs'];

  /**
   * Property `mockLinkPreviewEndpoint$` (`(link: string) => Observable<Partial<OpenGraphMetaData>>`) providing offline deterministic OpenGraph metadata.
   * @zh 属性 `mockLinkPreviewEndpoint$`，提供零外部网络请求的固定 OpenGraph 预览数据流。
   */
  readonly mockLinkPreviewEndpoint$ = (link: string): Observable<Partial<OpenGraphMetaData>> =>
    of({
      title: 'DotOS Architecture Guide',
      description: 'Offline deterministic M2 link preview card.',
      url: link,
      'og:site_name': 'DotOS Docs',
      'og:title': 'DotOS Architecture Guide',
      'og:description': 'Offline deterministic M2 link preview card.',
      'og:url': link,
    });

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
   * @zh 创建 `M2ParityComponent` 实例并注入主题、配置、存储与弹窗服务。
   * @param themeService - Injected theme service (`ThemeService`) / 注入的主题服务（`ThemeService`）
   * @param dotosConfigService - Injected DotOS config service (`DotosConfigService`) / 注入的配置服务（`DotosConfigService`）
   * @param localStore - Injected local storage service (`LocalStorageService`) / 注入的本地存储服务（`LocalStorageService`）
   * @param dialog - Injected Material dialog service (`MatDialog`) / 注入的弹窗服务（`MatDialog`）
   * @param ngZone - Injected Angular Zone (`NgZone`) / 注入的 Angular Zone（`NgZone`）
   */
  constructor(
    public readonly themeService: ThemeService,
    private readonly dotosConfigService: DotosConfigService,
    private readonly localStore: LocalStorageService,
    private readonly dialog: MatDialog,
    private readonly ngZone: NgZone
  ) {}

  /**
   * Angular lifecycle hook registering component/downstream dynamic themes and browser parity control hooks on `window`.
   * @zh Angular 生命周期钩子：加载组件与下游 `duix`/`sdos` 动态主题并在 `window` 上注册自动化切换与冷启动钩子。
   */
  ngOnInit(): void {
    this.zoneName = typeof Zone !== 'undefined' && Zone?.current?.name ? Zone.current.name : String(NgZone.isInAngularZone());
    this.themeService.loadTheme((theme: Theme) => ({
      '.m2-parity-jss-probe': {
        borderColor: theme.primary['default'],
      },
    }));
    this.themeService.loadTheme(duixParityProbeTheme);
    this.themeService.loadTheme(sdosParityProbeTheme);

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

    window.__persistParityConfig = (opts: ParityThemeOptions): void => {
      this.ngZone.run(() => {
        const baseCfg = this.dotosConfigService.defaultConfig;
        const nextCfg: DotosConfig = {
          ...baseCfg,
          theme: {
            primary: opts.primary,
            accent: opts.accent,
            warn: opts.warn,
            type: opts.type,
            formType: opts.formType || 'fill',
          },
          layout: {
            ...baseCfg.layout,
            pagemodel: opts.typography,
          },
        };
        this.localStore.set(PARITY_STORAGE_KEY, nextCfg);
        this.dotosConfigService.config = nextCfg;
      });
    };

    window.__closeParityDialogs = (): void => {
      this.ngZone.run(() => {
        this.dialog.closeAll();
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
    this.dialog.open(M2ParityDialogComponent, { width: '320px', autoFocus: false });
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
    delete window.__persistParityConfig;
    delete window.__closeParityDialogs;
    delete window.__toggleParityPanel;
    delete window.__triggerParityZoneAsync;
  }
}
