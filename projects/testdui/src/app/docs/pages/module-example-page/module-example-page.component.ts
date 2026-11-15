/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/module-example-page/module-example-page.component.ts` providing the interactive example studio for `@dotos1/dui` modules.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/module-example-page/module-example-page.component.ts`，提供 `@dotos1/dui` 模块的可交互示例演练工作台组件实现。
 */

import { Component, OnDestroy, OnInit, Optional, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { TranslationService } from '@dotos1/dui/translator';

import { DocsDataService } from '../../services/docs-data.service';
import { ApiExport, ModuleApiFile } from '../../models/api-record.model';
import { preferZh } from '../../util/i18n-text';
import {
  ModuleScenarioPreset,
  resolveModuleScenarioPreset,
  ScenarioActionPreset,
} from './module-example-presets';

/**
 * Interface `EventLogEntry` representing an entry in the live interactive event console.
 * @zh 接口 `EventLogEntry`，表示实时事件与状态监控台中的单条日志记录。
 */
export interface EventLogEntry {
  /**
   * Property `id` (`number`) storing sequential event id.
   * @zh 属性 `id`（类型：`number`），用于存储递增事件序号。
   */
  id: number;
  /**
   * Property `time` (`string`) storing formatted timestamp.
   * @zh 属性 `time`（类型：`string`），用于存储格式化时间戳。
   */
  time: string;
  /**
   * Property `type` (`'action' | 'input' | 'output' | 'lifecycle'`) storing event category.
   * @zh 属性 `type`（类型：`'action' | 'input' | 'output' | 'lifecycle'`），用于存储事件类别。
   */
  type: 'action' | 'input' | 'output' | 'lifecycle';
  /**
   * Property `label` (`string`) storing event summary title.
   * @zh 属性 `label`（类型：`string`），用于存储事件标题摘要。
   */
  label: string;
  /**
   * Property `payload` (`string`) storing serialized payload details.
   * @zh 属性 `payload`（类型：`string`），用于存储序列化事件详情。
   */
  payload: string;
}

/**
 * Interface `CarouselSlideDemo` defining a slide item for the interactive carousel showcase.
 * @zh 接口 `CarouselSlideDemo`，定义轮播走马灯工作台的单页演示数据结构。
 */
export interface CarouselSlideDemo {
  /**
   * Property `title` (`string`) storing slide headline.
   * @zh 属性 `title`（类型：`string`），用于存储轮播页主标题。
   */
  title: string;
  /**
   * Property `subtitle` (`string`) storing slide description.
   * @zh 属性 `subtitle`（类型：`string`），用于存储轮播页副标题描述。
   */
  subtitle: string;
  /**
   * Property `metric` (`string`) storing key telemetry metric.
   * @zh 属性 `metric`（类型：`string`），用于存储关键指标文本。
   */
  metric: string;
  /**
   * Property `gradient` (`string`) storing CSS background gradient.
   * @zh 属性 `gradient`（类型：`string`），用于存储背景渐变样式。
   */
  gradient: string;
  /**
   * Property `icon` (`string`) storing Material icon name.
   * @zh 属性 `icon`（类型：`string`），用于存储图标名称。
   */
  icon: string;
}

/**
 * Interface `SelectableGridItem` defining a card item for the drag-select / DnD showcase.
 * @zh 接口 `SelectableGridItem`，定义拖放与框选工作台中的可交互网格卡片结构。
 */
export interface SelectableGridItem {
  /**
   * Property `id` (`string`) storing card identifier.
   * @zh 属性 `id`（类型：`string`），用于存储卡片唯一标识。
   */
  id: string;
  /**
   * Property `name` (`string`) storing display name.
   * @zh 属性 `name`（类型：`string`），用于存储卡片名称。
   */
  name: string;
  /**
   * Property `zone` (`'source' | 'target'`) storing current dropzone bucket.
   * @zh 属性 `zone`（类型：`'source' | 'target'`），用于存储当前所属拖放区域。
   */
  zone: 'source' | 'target';
  /**
   * Property `selected` (`boolean`) storing selection state.
   * @zh 属性 `selected`（类型：`boolean`），用于存储是否被框选命中。
   */
  selected: boolean;
}

/**
 * Interface `QueryRuleDemo` defining a filter rule in the query-builder showcase.
 * @zh 接口 `QueryRuleDemo`，定义查询构建器工作台中的单条过滤规则。
 */
export interface QueryRuleDemo {
  /**
   * Property `field` (`string`) storing field name.
   * @zh 属性 `field`（类型：`string`），用于存储字段名。
   */
  field: string;
  /**
   * Property `operator` (`string`) storing comparison operator.
   * @zh 属性 `operator`（类型：`string`），用于存储比较运算符。
   */
  operator: string;
  /**
   * Property `value` (`string`) storing target comparison value.
   * @zh 属性 `value`（类型：`string`），用于存储目标比较值。
   */
  value: string;
}

/**
 * Interface `KeyValueDemoEntry` defining an item in the core storage/cache/cookie table.
 * @zh 接口 `KeyValueDemoEntry`，定义核心存储/缓存/Cookie 演示表中的键值对记录。
 */
export interface KeyValueDemoEntry {
  /**
   * Property `key` (`string`) storing entry key.
   * @zh 属性 `key`（类型：`string`），用于存储键名。
   */
  key: string;
  /**
   * Property `value` (`string`) storing entry value.
   * @zh 属性 `value`（类型：`string`），用于存储键值。
   */
  value: string;
  /**
   * Property `ttl` (`string`) storing expiration or scope label.
   * @zh 属性 `ttl`（类型：`string`），用于存储有效期或作用域标签。
   */
  ttl: string;
}

/**
 * Angular component `ModuleExamplePageComponent` (selector: 'app-module-example-page') providing a rich interactive studio for all `@dotos1/dui` modules.
 * @zh Angular 组件 `ModuleExamplePageComponent`（selector: 'app-module-example-page'），为全量 `@dotos1/dui` 模块提供高冲击力的可交互示例工作台。
 */
@Component({
  selector: 'app-module-example-page',
  templateUrl: './module-example-page.component.html',
  styleUrls: ['./module-example-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ModuleExamplePageComponent implements OnInit, OnDestroy {
  /**
   * Property `categoryId` (`string`) storing current category id.
   * @zh 属性 `categoryId`（类型：`string`），用于存储当前分类标识。
   */
  categoryId = '';

  /**
   * Property `moduleId` (`string`) storing current module id.
   * @zh 属性 `moduleId`（类型：`string`），用于存储当前模块标识。
   */
  moduleId = '';

  /**
   * Property `api` (`ModuleApiFile | null`) storing loaded module API metadata.
   * @zh 属性 `api`（类型：`ModuleApiFile | null`），用于存储已加载的模块 API 元数据。
   */
  api: ModuleApiFile | null = null;

  /**
   * Property `preset` (`ModuleScenarioPreset`) storing resolved interactive scenario preset.
   * @zh 属性 `preset`（类型：`ModuleScenarioPreset`），用于存储当前模块匹配的可交互场景预设。
   */
  preset: ModuleScenarioPreset = resolveModuleScenarioPreset('common', 'index', '@dotos1/dui/common');

  /**
   * Property `selectedExport` (`ApiExport | null`) storing currently inspected export symbol.
   * @zh 属性 `selectedExport`（类型：`ApiExport | null`），用于存储当前选中的导出符号。
   */
  selectedExport: ApiExport | null = null;

  /**
   * Property `canvasTheme` (`'light' | 'dark' | 'blueprint'`) storing preview stage background theme.
   * @zh 属性 `canvasTheme`（类型：`'light' | 'dark' | 'blueprint'`），用于存储预览画布背景主题。
   */
  canvasTheme: 'light' | 'dark' | 'blueprint' = 'blueprint';

  /**
   * Property `primaryText` (`string`) storing live primary text input.
   * @zh 属性 `primaryText`（类型：`string`），用于存储主文本输入控件的实时值。
   */
  primaryText = '';

  /**
   * Property `numericValue` (`number`) storing live numeric slider value.
   * @zh 属性 `numericValue`（类型：`number`），用于存储数值滑块的实时值。
   */
  numericValue = 32;

  /**
   * Property `selectedOption` (`string`) storing currently active option string.
   * @zh 属性 `selectedOption`（类型：`string`），用于存储当前选中的模式/枚举项。
   */
  selectedOption = '';

  /**
   * Property `booleanToggle` (`boolean`) storing boolean toggle state.
   * @zh 属性 `booleanToggle`（类型：`boolean`），用于存储布尔开关状态。
   */
  booleanToggle = true;

  /**
   * Property `selectedColor` (`string`) storing active color hex in color studio mode.
   * @zh 属性 `selectedColor`（类型：`string`），用于存储拾色器工作台当前选中的 HEX 色值。
   */
  selectedColor = '#1976D2';

  /**
   * Property `colorPalette` (`string[]`) storing preset color swatches.
   * @zh 属性 `colorPalette`（类型：`string[]`），用于存储预设高对比度色板。
   */
  readonly colorPalette: string[] = [
    '#1976D2',
    '#00ACC1',
    '#00897B',
    '#43A047',
    '#FB8C00',
    '#E53935',
    '#8E24AA',
    '#3949AB',
  ];

  /**
   * Property `animationPulse` (`boolean`) storing animation trigger state.
   * @zh 属性 `animationPulse`（类型：`boolean`），用于控制动画演示卡片的触发状态。
   */
  animationPulse = false;

  /**
   * Property `carouselIndex` (`number`) storing active slide index.
   * @zh 属性 `carouselIndex`（类型：`number`），用于存储轮播图当前激活页索引。
   */
  carouselIndex = 0;

  /**
   * Property `carouselSlides` (`CarouselSlideDemo[]`) storing interactive carousel slides.
   * @zh 属性 `carouselSlides`（类型：`CarouselSlideDemo[]`），用于存储轮播演示页集合。
   */
  readonly carouselSlides: CarouselSlideDemo[] = [
    {
      title: '三维地震体实时体渲染引擎',
      subtitle: '支持 TB 级地震数据切片秒级加载与多属性融合着色',
      metric: '99.4 FPS · GPU 加速',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #0284c7 100%)',
      icon: 'layers',
    },
    {
      title: '智能钻完井随钻工程监控中心',
      subtitle: '多井筒轨迹防碰扫描、摩阻扭矩预测与异常工况实时预警',
      metric: '128 口在钻井在线',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 55%, #10b981 100%)',
      icon: 'insights',
    },
    {
      title: '油气藏数值模拟与生产优化平台',
      subtitle: '分布式网格求解器与自动历史拟合工作流调度',
      metric: '吞吐率提升 4.2x',
      gradient: 'linear-gradient(135deg, #311042 0%, #7e22ce 55%, #c026d3 100%)',
      icon: 'auto_awesome',
    },
    {
      title: '企业级多端协同微前端工作台',
      subtitle: '基于 @dotos1/dui 停靠布局、动态表单与运行时 JSS 主题系统构建',
      metric: '102 个子模块全量就绪',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 55%, #f59e0b 100%)',
      icon: 'view_quilt',
    },
  ];

  /**
   * Property `gridItems` (`SelectableGridItem[]`) storing interactive DnD / DragSelect cards.
   * @zh 属性 `gridItems`（类型：`SelectableGridItem[]`），用于存储拖放与框选网格卡片数据。
   */
  gridItems: SelectableGridItem[] = [
    { id: 'WELL-A01', name: '渤中 19-6 先导试验井 A01', zone: 'source', selected: true },
    { id: 'WELL-A02', name: '渤中 19-6 高压气井 A02', zone: 'source', selected: false },
    { id: 'WELL-B08', name: '旅大 21-2 水平开发井 B08', zone: 'target', selected: true },
    { id: 'WELL-C14', name: '曹妃甸 11-1 注采联动井 C14', zone: 'source', selected: false },
    { id: 'WELL-D05', name: '锦州 25-1 南区评价井 D05', zone: 'target', selected: false },
    { id: 'WELL-E19', name: '绥中 36-1 加密调整井 E19', zone: 'source', selected: true },
  ];

  /**
   * Property `uploadedFiles` (`Array<{ name: string; sizeKb: number; progress: number }>`) storing simulated upload queue.
   * @zh 属性 `uploadedFiles`（类型：`Array<{ name: string; sizeKb: number; progress: number }>`），用于存储文件上传队列演示数据。
   */
  uploadedFiles: Array<{ name: string; sizeKb: number; progress: number }> = [
    { name: 'BZ19-6_3D_PostStack_Migrated.segy', sizeKb: 48200, progress: 100 },
    { name: 'Well_A01_Composite_Log_Curves.las', sizeKb: 1840, progress: 85 },
  ];

  /**
   * Property `kvEntries` (`KeyValueDemoEntry[]`) storing live key-value store rows for core modules.
   * @zh 属性 `kvEntries`（类型：`KeyValueDemoEntry[]`），用于存储核心存储/缓存/配置演示表记录。
   */
  kvEntries: KeyValueDemoEntry[] = [
    { key: 'dui.theme.mode', value: '"darkblue"', ttl: 'Persistent (localStorage)' },
    { key: 'dui.auth.principal', value: '"chief.engineer@dotos.cn"', ttl: 'Session (JWT 45m)' },
    { key: 'dui.cache.seismicTile', value: 'Uint8Array(65536) [HIT]', ttl: 'LRU Cache (TTL 300s)' },
  ];

  /**
   * Property `queryRules` (`QueryRuleDemo[]`) storing interactive query builder rules.
   * @zh 属性 `queryRules`（类型：`QueryRuleDemo[]`），用于存储查询构建器规则列表。
   */
  queryRules: QueryRuleDemo[] = [
    { field: 'wellStatus', operator: '=', value: 'drilling' },
    { field: 'measuredDepthM', operator: '>=', value: '3000' },
    { field: 'porosityPct', operator: '>', value: '12.5' },
  ];

  /**
   * Property `rangeBegin` (`number`) storing lower bound for range control demo.
   * @zh 属性 `rangeBegin`（类型：`number`），用于存储区间控件演示的起始下界。
   */
  rangeBegin = 1200;

  /**
   * Property `copiedBanner` (`boolean`) storing whether clipboard copy feedback is visible.
   * @zh 属性 `copiedBanner`（类型：`boolean`），用于存储剪贴板复制成功反馈提示状态。
   */
  copiedBanner = false;

  /**
   * Property `eventLogs` (`EventLogEntry[]`) storing live interactive console entries.
   * @zh 属性 `eventLogs`（类型：`EventLogEntry[]`），用于存储实时交互控制台日志列表。
   */
  eventLogs: EventLogEntry[] = [];

  /**
   * Property `logSeq` (`number`) storing monotonic event counter.
   * @zh 属性 `logSeq`（类型：`number`），用于存储事件日志自增序号。
   */
  private logSeq = 1;

  /**
   * Property `destroy$` (`Subject<void>`) managing subscription cleanup.
   * @zh 属性 `destroy$`（类型：`Subject<void>`），用于在组件销毁时清理 RxJS 订阅。
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Creates an instance of `ModuleExamplePageComponent`.
   * @zh 创建 `ModuleExamplePageComponent` 实例并注入路由、文档数据与国际化服务。
   * @param route - Injected `ActivatedRoute` / 注入的当前激活路由（`ActivatedRoute`）
   * @param docsData - Injected `DocsDataService` / 注入的文档数据服务（`DocsDataService`）
   * @param translation - Optional injected `TranslationService` / 可选注入的翻译服务（`TranslationService`）
   */
  constructor(
    private route: ActivatedRoute,
    private docsData: DocsDataService,
    @Optional() private translation?: TranslationService
  ) {}

  /**
   * Subscribes to route parameters and loads the module's API metadata and scenario preset.
   * @zh 组件初始化时订阅路由参数，加载对应模块的 API 元数据并初始化可交互场景预设。
   */
  ngOnInit(): void {
    const paramMap$ = this.route.parent ? this.route.parent.paramMap : this.route.paramMap;

    paramMap$
      .pipe(
        map((params) => ({
          category: params.get('category') || 'common',
          moduleId: params.get('module') || 'index',
        })),
        switchMap(({ category, moduleId }) =>
          combineLatest([
            this.docsData.getModuleApi(category, moduleId),
          ]).pipe(map(([api]) => ({ category, moduleId, api })))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ category, moduleId, api }) => {
        this.categoryId = category;
        this.moduleId = moduleId;
        this.api = api;
        const importPath = api?.importPath || `@dotos1/dui/${category}/${moduleId}`;
        this.preset = resolveModuleScenarioPreset(category, moduleId, importPath);

        this.primaryText = this.preset.primaryDefault;
        this.numericValue = this.preset.numericDefault;
        this.selectedOption = this.preset.options[0] || 'default';
        this.booleanToggle = true;
        if (this.preset.mode === 'color' && this.primaryText.startsWith('#')) {
          this.selectedColor = this.primaryText;
        }

        const exportsList = api?.exports || [];
        this.selectedExport =
          exportsList.find((e) => e.kind === 'component' || e.kind === 'directive' || e.kind === 'pipe' || e.kind === 'service') ||
          exportsList[0] ||
          null;

        this.eventLogs = [];
        this.logSeq = 1;
        this.appendLog(
          'lifecycle',
          `已挂载 ${importPath} 可交互演练台`,
          `mode=${this.preset.mode}, exports=${exportsList.length}, primarySymbol=${this.selectedExport?.name || 'N/A'}`
        );
      });
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   * @zh 组件销毁时释放所有 RxJS 订阅。
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Counts exported symbols by kind categories for the hero metric banner.
   * @zh 统计当前模块中组件/指令、服务/管道及类型工具的数量，用于顶部指标卡展示。
   * @param group - Metric group key (`'ui' | 'logic' | 'types'`) / 统计分组键（`'ui' | 'logic' | 'types'`）
   * @returns Count of matching exports (`number`) / 匹配导出项数量（`number`）
   */
  countExportsByGroup(group: 'ui' | 'logic' | 'types'): number {
    const list = this.api?.exports || [];
    if (group === 'ui') {
      return list.filter((e) => e.kind === 'component' || e.kind === 'directive' || e.kind === 'module').length;
    }
    if (group === 'logic') {
      return list.filter((e) => e.kind === 'service' || e.kind === 'pipe' || e.kind === 'class' || e.kind === 'function').length;
    }
    return list.filter((e) => e.kind === 'interface' || e.kind === 'type' || e.kind === 'enum' || e.kind === 'constant').length;
  }

  /**
   * Returns localized summary for an exported symbol.
   * @zh 返回导出符号的中英双语摘要说明。
   * @param item - Export record (`ApiExport`) / API 导出项（`ApiExport`）
   * @returns Localized summary string / 本地化摘要文本
   */
  summaryOf(item: ApiExport): string {
    return preferZh(item.summaryZh, item.summary, this.translation?.userLang) || `${item.name} (${item.kind})`;
  }

  /**
   * Selects an exported symbol in the workbench and logs the selection.
   * @zh 在工作台中切换当前检视的导出符号，并同步更新动态代码生成器。
   * @param item - Export symbol (`ApiExport`) / 目标导出符号（`ApiExport`）
   */
  selectExport(item: ApiExport): void {
    this.selectedExport = item;
    this.appendLog('input', `切换检视符号: ${item.name}`, `kind=${item.kind}, selector=${item.selector || item.pipeName || 'N/A'}`);
  }

  /**
   * Updates the preview stage background theme.
   * @zh 切换左侧可交互预览舞台的背景主题模式。
   * @param theme - Target canvas theme (`'light' | 'dark' | 'blueprint'`) / 画布背景主题（`'light' | 'dark' | 'blueprint'`）
   */
  setCanvasTheme(theme: 'light' | 'dark' | 'blueprint'): void {
    this.canvasTheme = theme;
    this.appendLog('input', `切换预览舞台画布背景`, `canvasTheme="${theme}"`);
  }

  /**
   * Handles changes to the primary text control.
   * @zh 处理主文本输入框的实时变更事件。
   * @param event - DOM input event (`Event`) / DOM 输入事件（`Event`）
   */
  onPrimaryTextInput(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.primaryText = value;
    if (this.preset.mode === 'color' && /^#[0-9a-fA-F]{3,8}$/.test(value.trim())) {
      this.selectedColor = value.trim();
    }
    this.appendLog('input', `更新参数 [${this.preset.primaryLabel}]`, `value="${value}"`);
  }

  /**
   * Handles changes to the numeric slider control.
   * @zh 处理数值滑块控件的实时变更事件。
   * @param event - DOM input event (`Event`) / DOM 输入事件（`Event`）
   */
  onNumericInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement)?.value ?? this.numericValue);
    this.numericValue = Number.isFinite(raw) ? raw : this.preset.numericDefault;
    this.appendLog('input', `调整数值 [${this.preset.numericLabel}]`, `value=${this.numericValue}`);
  }

  /**
   * Selects one of the scenario's option presets.
   * @zh 切换场景预设中的枚举选项，并在特定模式下联动舞台状态。
   * @param option - Selected option (`string`) / 选中的枚举项（`string`）
   */
  selectOption(option: string): void {
    this.selectedOption = option;
    if (this.preset.mode === 'color' && option.startsWith('#')) {
      this.selectedColor = option.split(' ')[0];
      this.primaryText = this.selectedColor;
    }
    if (this.preset.mode === 'animation') {
      this.triggerAnimationPulse();
    }
    this.appendLog('input', `切换选项 [${this.preset.optionLabel}]`, `selected="${option}"`);
  }

  /**
   * Toggles the scenario boolean switch.
   * @zh 切换布尔配置开关状态。
   */
  toggleBoolean(): void {
    this.booleanToggle = !this.booleanToggle;
    this.appendLog('input', `切换开关 [${this.preset.toggleLabel}]`, `enabled=${this.booleanToggle}`);
  }

  /**
   * Executes a preset scenario action button and updates the visual stage state.
   * @zh 执行场景快捷交互动作，驱动左侧预览舞台状态变化并记录输出日志。
   * @param action - Preset action (`ScenarioActionPreset`) / 快捷动作配置（`ScenarioActionPreset`）
   */
  runScenarioAction(action: ScenarioActionPreset): void {
    if (this.preset.mode === 'animation' || action.id === 'play' || action.id === 'bounce' || action.id === 'runCurve') {
      this.triggerAnimationPulse();
    } else if (this.preset.mode === 'carousel') {
      if (action.id === 'prev') {
        this.prevSlide();
        return;
      }
      if (action.id === 'next') {
        this.nextSlide();
        return;
      }
      if (action.id === 'slide0') {
        this.carouselIndex = 0;
      }
    } else if (this.preset.mode === 'color') {
      if (action.id === 'sample1') {
        this.pickSwatch('#1976D2');
      } else if (action.id === 'sample2' || action.id === 'pickCyan') {
        this.pickSwatch('#00897B');
      } else if (action.id === 'sample3') {
        this.pickSwatch('#FB8C00');
      } else if (action.id === 'pickPrimary') {
        this.pickSwatch('#7B1FA2');
      }
    } else if (action.id === 'inc' || action.id === 'incAction') {
      this.numericValue = Math.min(this.preset.numericMax, this.numericValue + 5);
    } else if (action.id === 'overflow') {
      this.numericValue = 120;
    } else if (action.id === 'zero') {
      this.numericValue = 0;
    } else if (action.id === 'selectAll') {
      this.gridItems = this.gridItems.map((item) => ({ ...item, selected: true }));
    } else if (action.id === 'invert') {
      this.gridItems = this.gridItems.map((item) => ({ ...item, selected: !item.selected }));
    } else if (action.id === 'clear') {
      this.gridItems = this.gridItems.map((item) => ({ ...item, selected: false }));
    } else if (action.id === 'copy') {
      this.copyTextToClipboard(this.primaryText);
    } else if (action.id === 'addFile') {
      this.addSimulatedFile();
    } else if (action.id === 'uploadAll') {
      this.uploadedFiles = this.uploadedFiles.map((f) => ({ ...f, progress: 100 }));
    } else if (action.id === 'clearQueue') {
      this.uploadedFiles = [];
    } else if (action.id === 'addRule') {
      this.addQueryRule();
    } else if (action.id === 'putCache' || action.id === 'setCookie' || action.id === 'setItem') {
      this.upsertKvEntry();
    } else if (action.id === 'clearCache' || action.id === 'clearAll') {
      this.kvEntries = [];
    }

    this.appendLog('action', `触发动作: ${action.label}`, action.payload);
  }

  /**
   * Selects a color swatch in the color picker studio.
   * @zh 在拾色器工作台中点选预设色块，同步更新主色值与事件日志。
   * @param hex - Selected hex color (`string`) / 选中的 HEX 色值（`string`）
   */
  pickSwatch(hex: string): void {
    this.selectedColor = hex;
    this.primaryText = hex;
    this.appendLog('output', `ColorChange 事件触发`, `{ hex: "${hex}", alpha: ${(this.numericValue / 100).toFixed(2)} }`);
  }

  /**
   * Triggers a visible animation pulse on the animation stage.
   * @zh 触发动画预览舞台的过渡脉冲效果。
   */
  triggerAnimationPulse(): void {
    this.animationPulse = false;
    setTimeout(() => {
      this.animationPulse = true;
    }, 20);
  }

  /**
   * Advances the interactive carousel to the previous slide.
   * @zh 切换轮播图至上一帧。
   */
  prevSlide(): void {
    this.carouselIndex = (this.carouselIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
    this.appendLog('output', `轮播切换至第 ${this.carouselIndex + 1} 帧`, this.carouselSlides[this.carouselIndex].title);
  }

  /**
   * Advances the interactive carousel to the next slide.
   * @zh 切换轮播图至下一帧。
   */
  nextSlide(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.carouselSlides.length;
    this.appendLog('output', `轮播切换至第 ${this.carouselIndex + 1} 帧`, this.carouselSlides[this.carouselIndex].title);
  }

  /**
   * Jumps to a specific carousel slide index.
   * @zh 跳转至指定索引的轮播帧。
   * @param idx - Target slide index (`number`) / 目标轮播索引（`number`）
   */
  goToSlide(idx: number): void {
    this.carouselIndex = idx;
    this.appendLog('output', `点击指示器跳转至第 ${idx + 1} 帧`, this.carouselSlides[idx].title);
  }

  /**
   * Toggles selection or transfers a card between drag-and-drop zones.
   * @zh 在拖放/框选工作台中切换卡片选中态或跨区域转移卡片。
   * @param item - Target grid card (`SelectableGridItem`) / 目标网格卡片（`SelectableGridItem`）
   * @param transfer - Whether to transfer between source and target zones (`boolean`) / 是否跨区转移（`boolean`）
   */
  toggleGridItem(item: SelectableGridItem, transfer = false): void {
    if (transfer) {
      item.zone = item.zone === 'source' ? 'target' : 'source';
      this.appendLog('output', `dndDrop 跨区转移卡片 [${item.id}]`, `newZone="${item.zone}"`);
    } else {
      item.selected = !item.selected;
      this.appendLog('output', `切换框选状态 [${item.id}]`, `selected=${item.selected}`);
    }
  }

  /**
   * Adds a simulated file item to the fileupload queue.
   * @zh 向文件上传队列追加一条模拟测井/地震数据文件。
   */
  addSimulatedFile(): void {
    const seq = this.uploadedFiles.length + 1;
    const item = {
      name: `Well_Trajectory_Survey_0${seq}.las`,
      sizeKb: 640 + seq * 310,
      progress: 100,
    };
    this.uploadedFiles = [...this.uploadedFiles, item];
    this.appendLog('output', `FileUploader.onAfterAddingFile`, `${item.name} (${item.sizeKb} KB)`);
  }

  /**
   * Copies text to the clipboard and shows visual confirmation.
   * @zh 将指定文本复制到剪贴板并展示复制成功徽标反馈。
   * @param text - Content to copy (`string`) / 待复制文本（`string`）
   */
  copyTextToClipboard(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    this.copiedBanner = true;
    setTimeout(() => {
      this.copiedBanner = false;
    }, 1800);
    this.appendLog('output', `ClipboardService.copyFromContent()`, `已复制 ${text.length} 个字符到系统剪贴板`);
  }

  /**
   * Inserts or updates an entry in the live key-value store table.
   * @zh 向核心存储/缓存演示表中写入或更新当前输入的键值对。
   */
  upsertKvEntry(): void {
    const raw = this.primaryText.trim() || 'dui.custom.key = "active"';
    const parts = raw.split('=');
    const key = (parts[0] || 'dui.custom.key').trim();
    const val = parts.slice(1).join('=').trim() || `"${this.selectedOption}"`;
    const existingIdx = this.kvEntries.findIndex((e) => e.key === key);
    const entry: KeyValueDemoEntry = {
      key,
      value: val,
      ttl: `Updated · TTL ${this.numericValue}s`,
    };
    if (existingIdx >= 0) {
      const next = [...this.kvEntries];
      next[existingIdx] = entry;
      this.kvEntries = next;
    } else {
      this.kvEntries = [entry, ...this.kvEntries];
    }
  }

  /**
   * Removes an entry from the live key-value store table.
   * @zh 从核心存储/缓存演示表中移除指定键。
   * @param key - Key to remove (`string`) / 待移除的键名（`string`）
   */
  removeKvEntry(key: string): void {
    this.kvEntries = this.kvEntries.filter((e) => e.key !== key);
    this.appendLog('output', `移除存储键: ${key}`, `remaining=${this.kvEntries.length}`);
  }

  /**
   * Adds a new filter condition to the query-builder demo.
   * @zh 在查询构建器演示区新增一条过滤规则。
   */
  addQueryRule(): void {
    const fields = ['wellDepthM', 'reservoirPressureMpa', 'dailyOilTon', 'waterCutPct'];
    const field = fields[this.queryRules.length % fields.length];
    this.queryRules = [
      ...this.queryRules,
      {
        field,
        operator: '>=',
        value: String(this.numericValue),
      },
    ];
  }

  /**
   * Removes a filter condition from the query-builder demo.
   * @zh 从查询构建器演示区删除指定索引的过滤规则。
   * @param index - Rule index (`number`) / 规则索引（`number`）
   */
  removeQueryRule(index: number): void {
    this.queryRules = this.queryRules.filter((_, idx) => idx !== index);
    this.appendLog('output', `删除查询条件 #${index + 1}`, `rulesCount=${this.queryRules.length}`);
  }

  /**
   * Computes human-readable byte size for the pipe workbench.
   * @zh 计算可读字节容量字符串（用于 `util/pipes` 的 `bytes` 管道实时预览）。
   * @param bytes - Raw byte count (`number`) / 原始字节数（`number`）
   * @returns Formatted byte size string / 格式化后的容量字符串
   */
  formatBytes(bytes: number): string {
    if (bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const exp = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    const val = bytes / Math.pow(1024, exp);
    return `${val.toFixed(this.booleanToggle ? 2 : 0)} ${units[exp]}`;
  }

  /**
   * Converts camelCase identifiers to kebab-case for the pipe workbench.
   * @zh 将驼峰字符串转换为连字符格式（用于 `camelCaseToDash` 管道实时预览）。
   * @param input - Input string (`string`) / 输入字符串（`string`）
   * @returns Dash-separated string / 转换后的连字符字符串
   */
  toKebabCase(input: string): string {
    return input
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Encodes input string to Base64 safely for the crypt/codec workbench.
   * @zh 将输入字符串安全编码为 Base64 字符串（用于 `core/crypt` 与 `util` 实时预览）。
   * @param input - Plain text (`string`) / 明文字符串（`string`）
   * @returns Base64 encoded string / Base64 编码结果
   */
  toBase64Preview(input: string): string {
    try {
      return typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(input))) : input;
    } catch {
      return 'RG90T1MtRFVJLUVudGVycHJpc2U=';
    }
  }

  /**
   * Computes initials for the avatar UX showcase.
   * @zh 从姓名字符串提取头像首字母缩写（用于 `ux/avatar` 实时预览）。
   * @param name - Full display name (`string`) / 用户姓名（`string`）
   * @returns Initials string / 提取的首字母缩写
   */
  avatarInitials(name: string): string {
    const clean = name.trim();
    if (!clean) return 'DUI';
    if (/[\u4e00-\u9fa5]/.test(clean)) {
      return clean.slice(0, 1);
    }
    const parts = clean.split(/\s+/);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('');
  }

  /**
   * Computes SVG stroke-dasharray for the line-style UX showcase.
   * @zh 根据选中的线型返回 SVG `stroke-dasharray` 属性值。
   * @returns SVG dasharray string / SVG 虚线阵列配置值
   */
  lineDashArray(): string {
    if (this.selectedOption.includes('dashed')) return '10, 6';
    if (this.selectedOption.includes('dotted')) return '2, 6';
    if (this.selectedOption.includes('dash-dot')) return '12, 5, 2, 5';
    return 'none';
  }

  /**
   * Computes SQL WHERE preview for the query-builder UX showcase.
   * @zh 根据当前查询规则列表生成实时 SQL 过滤子句预览。
   * @returns SQL WHERE string / 生成的 SQL 条件表达式
   */
  generatedQuerySql(): string {
    const joiner = this.selectedOption.startsWith('OR') ? ' OR ' : ' AND ';
    if (!this.queryRules.length) {
      return 'SELECT * FROM well_telemetry WHERE 1 = 1;';
    }
    const clauses = this.queryRules.map((r) => `${r.field} ${r.operator} '${r.value}'`).join(joiner);
    return `SELECT well_id, depth_m, status FROM well_telemetry WHERE (${clauses});`;
  }

  /**
   * Counts selected items in the DragSelect / DnD grid.
   * @zh 统计当前框选/拖放网格中被选中的卡片数量。
   * @returns Selected card count (`number`) / 已选中卡片数（`number`）
   */
  selectedGridCount(): number {
    return this.gridItems.filter((i) => i.selected).length;
  }

  /**
   * Dynamically generates live TypeScript & HTML usage code reflecting current interactive controls.
   * @zh 根据当前选中的导出符号与用户在工作台中调节的实时参数，动态生成可直接复制的 TypeScript / HTML 示例代码。
   * @returns Formatted usage snippet (`string`) / 实时生成的用法代码片段（`string`）
   */
  get dynamicUsageCode(): string {
    const importPath = this.api?.importPath || `@dotos1/dui/${this.categoryId}/${this.moduleId}`;
    const exp = this.selectedExport;
    const allModules = (this.api?.exports || []).filter((e) => e.kind === 'module').map((e) => e.name);
    const ngModuleName = allModules[0] || '';

    const importNames: string[] = [];
    if (ngModuleName) importNames.push(ngModuleName);
    if (exp && !importNames.includes(exp.name)) importNames.push(exp.name);
    if (importNames.length === 0) importNames.push('/* exports */');

    const header = `import { ${importNames.join(', ')} } from '${importPath}';\n`;

    if (exp?.kind === 'component' && exp.selector) {
      const tag = exp.selector.split(',')[0].trim().replace(/^\[|\]$/g, '');
      const inputBindings = exp.inputs
        .slice(0, 3)
        .map((inp) => `[${inp.alias || inp.name}]="${this.sampleBindingForInput(inp.name, inp.type)}"`)
        .join('\n  ');
      const outputBindings = exp.outputs
        .slice(0, 2)
        .map((out) => `(${out.name})="on${this.capitalize(out.name)}($event)"`)
        .join('\n  ');
      const attrs = [inputBindings, outputBindings].filter(Boolean).join('\n  ');

      return `${header}
// 1. 模板交互用法 (实时同步当前演练台参数)
<${tag}${attrs ? '\n  ' + attrs : ''}
  [attr.data-option]="${this.selectedOption}"
  [attr.data-enabled]="${this.booleanToggle}">
  ${this.primaryText}
</${tag}>

// 2. 组件控制器状态
export class DemoHostComponent {
  primaryValue = ${JSON.stringify(this.primaryText)};
  numericParam = ${this.numericValue};
  modeOption = ${JSON.stringify(this.selectedOption)};
  enabled = ${this.booleanToggle};
}`;
    }

    if (exp?.kind === 'directive' && exp.selector) {
      const rawSel = exp.selector.split(',')[0].trim();
      const attrName = rawSel.replace(/^\[|\]$/g, '');
      return `${header}
// 指令宿主绑定示例 (实时同步当前演练台参数)
<div ${attrName}
     [attr.data-config]="${this.selectedOption}"
     [style.min-height.px]="${this.numericValue}">
  ${this.primaryText}
</div>`;
    }

    if (exp?.kind === 'pipe' && exp.pipeName) {
      return `${header}
// 模板管道实时转换示例
<div>原始输入：{{ ${JSON.stringify(this.primaryText)} }}</div>
<div>数值参数：{{ ${this.numericValue} | ${exp.pipeName} }}</div>`;
    }

    if (exp?.kind === 'service' || exp?.kind === 'class') {
      const firstMethod = exp.methods[0]?.name || 'execute';
      return `${header}
@Component({
  selector: 'app-feature-demo',
  template: \`<div>{{ statusText }}</div>\`
})
export class FeatureDemoComponent {
  statusText = ${JSON.stringify(this.primaryText)};

  constructor(private readonly target: ${exp.name}) {
    // 实时参数注入: ${this.preset.numericLabel} = ${this.numericValue}, 模式 = "${this.selectedOption}"
    console.log('${exp.name}.${firstMethod}() ready', {
      value: this.statusText,
      numeric: ${this.numericValue},
      option: ${JSON.stringify(this.selectedOption)},
      enabled: ${this.booleanToggle},
    });
  }
}`;
    }

    return `${header}
// 实时参数配置快照 (${importPath})
const workbenchConfig = {
  targetSymbol: ${JSON.stringify(exp?.name || this.moduleId)},
  primaryInput: ${JSON.stringify(this.primaryText)},
  numericParam: ${this.numericValue},
  selectedOption: ${JSON.stringify(this.selectedOption)},
  enabled: ${this.booleanToggle},
};
${this.api?.suggestedUsageSnippet ? '\n' + this.api.suggestedUsageSnippet : ''}`;
  }

  /**
   * Clears all entries in the interactive event console.
   * @zh 清空实时事件与状态监控台日志。
   */
  clearLogs(): void {
    this.eventLogs = [];
    this.appendLog('lifecycle', '已清空事件监控台', 'Ready for new interactive events');
  }

  /**
   * Appends a new entry to the top of the live event console.
   * @zh 向实时事件监控台顶部追加一条带时间戳的交互日志。
   * @param type - Event category (`'action' | 'input' | 'output' | 'lifecycle'`) / 事件类型
   * @param label - Event title (`string`) / 事件标题
   * @param payload - Serialized details (`string`) / 详情负载
   */
  private appendLog(
    type: 'action' | 'input' | 'output' | 'lifecycle',
    label: string,
    payload: string
  ): void {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8) + '.' + String(now.getMilliseconds()).padStart(3, '0');
    this.eventLogs = [
      {
        id: this.logSeq++,
        time,
        type,
        label,
        payload,
      },
      ...this.eventLogs.slice(0, 19),
    ];
  }

  /**
   * Generates a sample template binding value based on an `@Input` name and type.
   * @zh 根据 `@Input` 属性名称与类型生成示例绑定表达式。
   * @param name - Input name (`string`) / 输入属性名
   * @param type - Input type string (`string`) / 输入类型描述
   * @returns Binding expression string / 模板绑定表达式字符串
   */
  private sampleBindingForInput(name: string, type: string): string {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('boolean')) return String(this.booleanToggle);
    if (lowerType.includes('number')) return String(this.numericValue);
    if (name.toLowerCase().includes('color')) return `'${this.selectedColor}'`;
    return `'${this.primaryText.replace(/'/g, "\\'")}'`;
  }

  /**
   * Capitalizes the first character of a string.
   * @zh 将字符串首字母转为大写。
   * @param str - Input string (`string`) / 输入字符串
   * @returns Capitalized string / 首字母大写字符串
   */
  private capitalize(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }
}
