/**
 * @fileoverview DOTOS Angular 22 三大包（@dotos/dui、@dotos/duix、@dotos/xdraw）组件目录、
 * Signal API 契约、Headless Command API、CSS 令牌与单文件黄金示例注册表
 */

import type {
  AntiPatternRule,
  ComponentCatalogEntry,
  ComponentApiNotFoundOutput,
  GetComponentApiOutput,
  ListComponentsInput,
  ListComponentsOutput,
  SelectionDecisionRow,
} from './types.js';

/**
 * Angular 22 Zoneless + Standalone 全局强制反模式禁令清单
 */
export const DOTOS_ANTI_PATTERN_BANS: readonly AntiPatternRule[] = [
  {
    id: 'BAN-NGMODULE',
    forbidden: '@NgModule(...) 与传统模块级全量导入',
    replacement: '@Component({ standalone: true, imports: [...] }) 按需导入 @dotos/*/standalone',
    reason: 'DOTOS v8 全面拥抱 Angular 22 Standalone 架构，消除模块级体积膨胀与隐式依赖。',
  },
  {
    id: 'BAN-ZONEJS',
    forbidden: '依赖 Zone.js 自动脏检查、NgZone.runOutsideAngular 假设或 ChangeDetectionStrategy.Default',
    replacement: '100% 声明 ChangeDetectionStrategy.OnPush 并通过 signal() / computed() / model() 驱动视图更新',
    reason: '所有 DOTOS v8 组件默认运行在 provideZonelessChangeDetection() 纯无 Zone 环境中。',
  },
  {
    id: 'BAN-NG-DEEP-AND-MDC',
    forbidden: '::ng-deep、/deep/、>>> 样式穿透及覆写 .mdc-* 内部私有 DOM 类名',
    replacement: '在宿主选择器上覆写公开的 --mat-sys-* 与 --dui-* CSS 自定义属性钩子',
    reason: '内部 DOM 结构与 MDC 类名不属于公共契约，升级小版本即可破坏穿透样式。',
  },
  {
    id: 'BAN-FXLAYOUT',
    forbidden: '@angular/flex-layout 指令（fxLayout、fxFlex、fxLayoutAlign、fxLayoutGap）',
    replacement: '使用原生现代 CSS Grid / Flexbox，复杂可拖拽分栏使用 <dui-standalone-split-dock>',
    reason: 'flex-layout 已停止维护且依赖运行时 JS 计算布局，严重损害首屏渲染与 Zoneless 性能。',
  },
  {
    id: 'BAN-ANY-TYPE',
    forbidden: '在组件状态、Schema 配置或事件回调中使用 any 或 Function 等松散类型',
    replacement: '启用 TypeScript strict: true，导入 @dotos/*/schema 中的强类型泛型接口',
    reason: '零 any 契约是保障编译期类型安全与 AI 代码生成一次编译通过的核心防线。',
  },
  {
    id: 'BAN-LEGACY-DECORATORS',
    forbidden: '传统装饰器 @Input()、@Output()、new EventEmitter()、@ViewChild()',
    replacement: '全面使用 Angular 22 Signal 原语 input()、input.required()、model()、output()、viewChild()',
    reason: '函数式 Signal 端口支持细粒度响应式追踪与严格必填类型推导。',
  },
];

/**
 * 三大包全量核心 Standalone Signal 组件目录（共 11 个核心组件）
 */
export const DOTOS_COMPONENT_CATALOG: readonly ComponentCatalogEntry[] = [
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/schema',
    selector: 'dui-standalone-button',
    tag: '<dui-standalone-button>',
    className: 'DuiButtonStandaloneComponent',
    aliases: [
      'dui-button',
      'button',
      'duibutton',
      'duibuttoncomponent',
      'duistandalonebuttoncomponent',
    ],
    category: 'feedback',
    zonelessCompatible: true,
    scenarios: [
      '表单提交与异步任务触发按钮（内置无抖动 Signal loading 锁定态）',
      '页面主操作、次级操作、危险确认动作按钮',
      '工具栏紧凑图标动作触发器',
    ],
    recommendation:
      '所有交互触发与异步加载反馈场景首选 <dui-standalone-button>，内置防重复点击与无障碍 ARIA 忙碌态。',
    signalContracts: [
      {
        name: 'variant',
        kind: 'input',
        required: false,
        typeSignature: "InputSignal<'filled' | 'tonal' | 'outlined' | 'text' | 'danger'>",
        defaultValue: "'filled'",
        description: 'Material 3 按钮视觉层级变体',
      },
      {
        name: 'loading',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'false',
        description: '异步执行忙碌态，开启时自动渲染进度指示并阻断重复触发',
      },
      {
        name: 'disabled',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'false',
        description: '是否禁用按钮交互',
      },
      {
        name: 'icon',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<string | undefined>',
        defaultValue: 'undefined',
        description: '前置 Material Symbols 图标名称',
      },
      {
        name: 'triggered',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<MouseEvent>',
        description: '在非 disabled 且非 loading 状态下点击或键盘激活时派发',
      },
    ],
    headlessCommands: [
      {
        method: 'focus',
        signature: 'focus(origin?: "keyboard" | "mouse" | "program"): void',
        returnType: 'void',
        description: '以编程方式聚焦宿主内部原生按钮并设置焦点可见态',
      },
      {
        method: 'triggerProgrammatically',
        signature: 'triggerProgrammatically(): boolean',
        returnType: 'boolean',
        description: '受控触发按钮动作（若处于 disabled/loading 则返回 false）',
      },
    ],
    cssTokens: [
      {
        token: '--mat-sys-primary',
        fallback: '#005cbb',
        description: 'filled 主按钮背景主色与 outlined 文本高亮色',
      },
      {
        token: '--mat-sys-on-primary',
        fallback: '#ffffff',
        description: 'filled 主按钮前景文字与加载图标颜色',
      },
      {
        token: '--dui-button-radius',
        fallback: 'var(--mat-sys-corner-full, 9999px)',
        description: '按钮圆角尺寸钩子',
      },
      {
        token: '--dui-button-height',
        fallback: '40px',
        description: '按钮标准高度定制钩子',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DuiButtonStandaloneComponent } from '@dotos/dui/standalone';

@Component({
  selector: 'app-order-submit-action',
  standalone: true,
  imports: [DuiButtonStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: inline-flex;
      --dui-button-radius: 8px;
    }
  \`,
  template: \`
    <dui-standalone-button
      variant="filled"
      icon="send"
      [loading]="submitting()"
      (triggered)="handleSubmit()"
    >
      提交生产工单
    </dui-standalone-button>
  \`,
})
export class OrderSubmitActionComponent {
  protected readonly submitting = signal<boolean>(false);

  protected handleSubmit(): void {
    this.submitting.set(true);
    setTimeout(() => this.submitting.set(false), 600);
  }
}`,
  },
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/schema',
    selector: 'dui-standalone-card',
    tag: '<dui-standalone-card>',
    className: 'DuiCardStandaloneComponent',
    aliases: [
      'dui-card',
      'card',
      'duicard',
      'duicardcomponent',
      'duistandalonecardcomponent',
    ],
    category: 'feedback',
    zonelessCompatible: true,
    scenarios: [
      'KPI 指标概览卡片与状态告警摘要容器',
      '详情页模块化分组信息面板',
      '可折叠企业控制台区块容器',
    ],
    recommendation:
      '需要承载分组信息、KPI 状态徽章或局部骨架屏反馈时选用 <dui-standalone-card>。',
    signalContracts: [
      {
        name: 'title',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<string>',
        description: '卡片主标题文本（必填）',
      },
      {
        name: 'subtitle',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<string | undefined>',
        defaultValue: 'undefined',
        description: '卡片副标题或补充上下文说明',
      },
      {
        name: 'appearance',
        kind: 'input',
        required: false,
        typeSignature: "InputSignal<'elevated' | 'filled' | 'outlined'>",
        defaultValue: "'outlined'",
        description: 'Material 3 卡片表面容器外观风格',
      },
      {
        name: 'collapsed',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<boolean>',
        defaultValue: 'false',
        description: '双向绑定的卡片主体折叠状态',
      },
    ],
    headlessCommands: [
      {
        method: 'expand',
        signature: 'expand(): void',
        returnType: 'void',
        description: '强制展开卡片内容区域',
      },
      {
        method: 'collapse',
        signature: 'collapse(): void',
        returnType: 'void',
        description: '强制收起卡片内容区域',
      },
    ],
    cssTokens: [
      {
        token: '--mat-sys-surface-container-low',
        fallback: '#f7f9fc',
        description: '卡片容器背景色令牌',
      },
      {
        token: '--mat-sys-outline-variant',
        fallback: '#c4c6d0',
        description: 'outlined 模式卡片边框颜色',
      },
      {
        token: '--dui-card-padding',
        fallback: '16px 20px',
        description: '卡片内容区内边距钩子',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DuiCardStandaloneComponent } from '@dotos/dui/standalone';

@Component({
  selector: 'app-node-health-card',
  standalone: true,
  imports: [DuiCardStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      --dui-card-padding: 20px;
    }
  \`,
  template: \`
    <dui-standalone-card
      title="边缘计算网关集群"
      subtitle="在线率 99.98%"
      appearance="outlined"
      [(collapsed)]="isCollapsed"
    >
      <p>当前活跃节点：128 台，全部运行于 Zoneless 模式。</p>
    </dui-standalone-card>
  \`,
})
export class NodeHealthCardComponent {
  protected readonly isCollapsed = signal<boolean>(false);
}`,
  },
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/schema',
    selector: 'dui-standalone-tabs',
    tag: '<dui-standalone-tabs>',
    className: 'DuiTabsStandaloneComponent',
    aliases: [
      'dui-tabs',
      'tabs',
      'duitabs',
      'duitabscomponent',
      'duistandalonetabscomponent',
    ],
    category: 'layout-dock',
    zonelessCompatible: true,
    scenarios: [
      '多维业务视图页签切换与懒加载子面板容器',
      'IDE 风格可关闭多文档工作台标签栏',
      '带未读计数徽章的状态分类切换栏',
    ],
    recommendation:
      '同一视口内多子视图切换且需支持惰性挂载或可关闭文档页签时选用 <dui-standalone-tabs>。',
    signalContracts: [
      {
        name: 'items',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<readonly DuiTabItem[]>',
        description: '页签项定义数组（含 id、label、closable、disabled、badge）',
      },
      {
        name: 'activeTabId',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<string>',
        defaultValue: "''",
        description: '当前激活页签唯一 ID（支持双向 Signal 绑定）',
      },
      {
        name: 'lazyMount',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'true',
        description: '是否仅在首次激活页签时渲染对应面板内容',
      },
      {
        name: 'tabClosed',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<string>',
        description: '用户点击可关闭页签关闭按钮时输出对应 tabId',
      },
    ],
    headlessCommands: [
      {
        method: 'activateTab',
        signature: 'activateTab(tabId: string): boolean',
        returnType: 'boolean',
        description: '编程式切换至目标页签（目标不存在或被禁用时返回 false）',
      },
      {
        method: 'scrollIntoActiveTab',
        signature: 'scrollIntoActiveTab(): void',
        returnType: 'void',
        description: '当页签溢出滚动时将当前激活页签平滑滚入可视区域',
      },
    ],
    cssTokens: [
      {
        token: '--mat-sys-primary',
        fallback: '#005cbb',
        description: '激活页签底部指示条与选中文本主色',
      },
      {
        token: '--dui-tabs-header-height',
        fallback: '44px',
        description: '页签导航栏高度定制钩子',
      },
      {
        token: '--dui-tabs-indicator-height',
        fallback: '3px',
        description: '激活指示条厚度钩子',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DuiTabsStandaloneComponent } from '@dotos/dui/standalone';
import type { DuiTabItem } from '@dotos/dui/schema';

@Component({
  selector: 'app-workspace-tabs',
  standalone: true,
  imports: [DuiTabsStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <dui-standalone-tabs
      [items]="tabs()"
      [(activeTabId)]="activeId"
      (tabClosed)="removeTab($event)"
    />
  \`,
})
export class WorkspaceTabsComponent {
  protected readonly tabs = signal<readonly DuiTabItem[]>([
    { id: 'overview', label: '实时监控', closable: false },
    { id: 'alarms', label: '告警流水', closable: true, badge: '3' },
  ]);
  protected readonly activeId = signal<string>('overview');

  protected removeTab(tabId: string): void {
    this.tabs.update((list) => list.filter((item) => item.id !== tabId));
  }
}`,
  },
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/schema',
    selector: 'dui-standalone-split-dock',
    tag: '<dui-standalone-split-dock>',
    className: 'DuiSplitDockStandaloneComponent',
    aliases: [
      'dui-split-dock',
      'split-dock',
      'duisplitdock',
      'duisplitdockcomponent',
      'duistandalonesplitdockcomponent',
    ],
    category: 'layout-dock',
    zonelessCompatible: true,
    scenarios: [
      '替代废弃 fxLayout 的现代企业级可拖拽多栏工作台布局',
      '左树右表、上画布下属性检查器的 IDE 停靠分栏容器',
      '支持面板一键收起/最大化与尺寸持久化恢复的控制台框架',
    ],
    recommendation:
      '构建可拖拽调节比例的双栏/三栏企业工作台时首选 <dui-standalone-split-dock>，严禁使用废弃的 fxLayout。',
    signalContracts: [
      {
        name: 'direction',
        kind: 'input',
        required: false,
        typeSignature: "InputSignal<'horizontal' | 'vertical'>",
        defaultValue: "'horizontal'",
        description: '主分栏排列方向（水平左右分栏或垂直上下分栏）',
      },
      {
        name: 'panes',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<readonly DuiDockPaneConfig[]>',
        description: '分栏面板配置数组（含 id、initialSizePercent、minSizePx、collapsible）',
      },
      {
        name: 'sizes',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<readonly number[]>',
        description: '各分栏实时百分比尺寸数组（支持双向持久化绑定）',
      },
      {
        name: 'paneCollapsedChange',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<{ readonly paneId: string; readonly collapsed: boolean }>',
        description: '分栏折叠或展开状态变更通知',
      },
    ],
    headlessCommands: [
      {
        method: 'resetLayout',
        signature: 'resetLayout(): void',
        returnType: 'void',
        description: '将所有分栏尺寸与折叠态重置为 panes 初始配置',
      },
      {
        method: 'togglePane',
        signature: 'togglePane(paneId: string, forceCollapsed?: boolean): void',
        returnType: 'void',
        description: '编程式折叠或展开指定分栏面板',
      },
      {
        method: 'maximizePane',
        signature: 'maximizePane(paneId: string): void',
        returnType: 'void',
        description: '临时最大化目标面板并收起其余可折叠同级分栏',
      },
    ],
    cssTokens: [
      {
        token: '--dui-split-gutter-size',
        fallback: '6px',
        description: '分栏拖拽分隔条热区宽度/高度',
      },
      {
        token: '--dui-split-gutter-hover-color',
        fallback: 'var(--mat-sys-primary, #005cbb)',
        description: '分隔条悬停或拖拽激活时的高亮色',
      },
      {
        token: '--mat-sys-surface-container',
        fallback: '#eef1f6',
        description: '工作台停靠容器底色',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { DuiSplitDockStandaloneComponent } from '@dotos/dui/standalone';
import type { DuiDockPaneConfig } from '@dotos/dui/schema';

@Component({
  selector: 'app-studio-workbench',
  standalone: true,
  imports: [DuiSplitDockStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      height: 100vh;
      --dui-split-gutter-size: 6px;
    }
  \`,
  template: \`
    <dui-standalone-split-dock
      #dockRef
      direction="horizontal"
      [panes]="paneConfigs()"
      [(sizes)]="paneSizes"
    />
  \`,
})
export class StudioWorkbenchComponent {
  private readonly dockRef = viewChild.required<DuiSplitDockStandaloneComponent>('dockRef');

  protected readonly paneConfigs = signal<readonly DuiDockPaneConfig[]>([
    { id: 'nav', initialSizePercent: 22, minSizePx: 200, collapsible: true },
    { id: 'main', initialSizePercent: 78, minSizePx: 480, collapsible: false },
  ]);
  protected readonly paneSizes = signal<readonly number[]>([22, 78]);

  protected resetStudioDock(): void {
    this.dockRef().resetLayout();
  }
}`,
  },
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/schema',
    selector: 'dui-standalone-tree',
    tag: '<dui-standalone-tree>',
    className: 'DuiTreeStandaloneComponent',
    aliases: [
      'dui-tree',
      'tree',
      'duitree',
      'duitreecomponent',
      'duistandalonetreecomponent',
    ],
    category: 'navigation-tree',
    zonelessCompatible: true,
    scenarios: [
      '组织架构、设备资产台账层级目录与权限菜单树',
      '万级节点虚拟滚动树与关键词实时高亮过滤树',
      '支持级联勾选与异步懒加载子节点的资源导航器',
    ],
    recommendation:
      '一切层级目录导航、权限勾选树与资产结构浏览场景统一选用 <dui-standalone-tree>。',
    signalContracts: [
      {
        name: 'nodes',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<readonly DuiTreeNode[]>',
        description: '树节点层级数组（含 id、label、children、icon、disabled）',
      },
      {
        name: 'selectedIds',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<readonly string[]>',
        defaultValue: '[]',
        description: '当前选中或勾选的节点 ID 列表（双向绑定）',
      },
      {
        name: 'checkable',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'false',
        description: '是否开启复选框多选与父子级联计算',
      },
      {
        name: 'filterKeyword',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<string>',
        defaultValue: "''",
        description: '实时过滤关键字，自动展开命中路径祖先节点',
      },
      {
        name: 'nodeActivated',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<DuiTreeNode>',
        description: '用户点击激活单个节点时派发节点对象',
      },
    ],
    headlessCommands: [
      {
        method: 'expandAll',
        signature: 'expandAll(): void',
        returnType: 'void',
        description: '一键展开所有非禁用层级节点',
      },
      {
        method: 'collapseAll',
        signature: 'collapseAll(): void',
        returnType: 'void',
        description: '一键收起全部已展开节点',
      },
      {
        method: 'scrollToNode',
        signature: 'scrollToNode(nodeId: string): boolean',
        returnType: 'boolean',
        description: '自动展开目标节点父链并滚动定位至视口中央',
      },
    ],
    cssTokens: [
      {
        token: '--dui-tree-indent',
        fallback: '20px',
        description: '每级子节点的水平缩进距离',
      },
      {
        token: '--dui-tree-row-height',
        fallback: '34px',
        description: '单行树节点高度（虚拟滚动行高基准）',
      },
      {
        token: '--mat-sys-secondary-container',
        fallback: '#d7e3f7',
        description: '当前激活树节点高亮背景色',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DuiTreeStandaloneComponent } from '@dotos/dui/standalone';
import type { DuiTreeNode } from '@dotos/dui/schema';

@Component({
  selector: 'app-asset-hierarchy-nav',
  standalone: true,
  imports: [DuiTreeStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <dui-standalone-tree
      [nodes]="assetTree()"
      [checkable]="true"
      [(selectedIds)]="checkedAssetIds"
      (nodeActivated)="handleNodeClick($event)"
    />
  \`,
})
export class AssetHierarchyNavComponent {
  protected readonly assetTree = signal<readonly DuiTreeNode[]>([
    {
      id: 'plant-sh',
      label: '上海临港智造基地',
      children: [
        { id: 'line-a1', label: 'A1 柔性总装线' },
        { id: 'line-a2', label: 'A2 视觉质检线' },
      ],
    },
  ]);
  protected readonly checkedAssetIds = signal<readonly string[]>(['line-a1']);
  protected readonly activeNodeLabel = signal<string>('');

  protected handleNodeClick(node: DuiTreeNode): void {
    this.activeNodeLabel.set(node.label);
  }
}`,
  },
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/schema',
    selector: 'dui-standalone-form',
    tag: '<dui-standalone-form>',
    className: 'DuiFormStandaloneComponent',
    aliases: [
      'dui-form',
      'form',
      'duiform',
      'duiformcomponent',
      'duistandaloneformcomponent',
    ],
    category: 'form',
    zonelessCompatible: true,
    schemaTarget: 'dui-form',
    scenarios: [
      'Schema 驱动的零模板企业级动态数据录入与搜索筛选表单',
      '多列响应式网格表单、跨字段显隐联动与实时校验反馈',
      'AI/低代码生成的标准 JSON Schema 配置化表单（支持 validate_schema 自愈校验）',
    ],
    recommendation:
      '构建中后台数据录入、弹窗编辑与高级查询表单时首选 <dui-standalone-form>，生成配置后请先调用 validate_schema(target="dui-form") 校验。',
    signalContracts: [
      {
        name: 'schema',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<DuiFormSchema>',
        description: '强类型表单 Schema 定义（含 layout、columns 与 fields 数组）',
      },
      {
        name: 'value',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<Readonly<Record<string, string | number | boolean | null>>>',
        defaultValue: '{}',
        description: '表单字段键值模型（双向 Signal 同步，零 Zone 精准响应）',
      },
      {
        name: 'readonly',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'false',
        description: '全局只读浏览态切换',
      },
      {
        name: 'submitted',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<Readonly<Record<string, string | number | boolean | null>>>',
        description: '全部校验规则通过后提交时派发清洗后的表单值快照',
      },
    ],
    headlessCommands: [
      {
        method: 'validateAll',
        signature: 'validateAll(): Promise<{ readonly valid: boolean; readonly errors: Readonly<Record<string, string>> }>',
        returnType: 'Promise<{ readonly valid: boolean; readonly errors: Readonly<Record<string, string>> }>',
        description: '触发全字段同步与异步规则校验并返回结构化错误字典',
      },
      {
        method: 'resetForm',
        signature: 'resetForm(initialValues?: Readonly<Record<string, string | number | boolean | null>>): void',
        returnType: 'void',
        description: '清空脏状态并将表单重置为默认值或指定初始快照',
      },
      {
        method: 'patchFieldValue',
        signature: 'patchFieldValue(key: string, nextValue: string | number | boolean | null): void',
        returnType: 'void',
        description: '精确更新单个字段值并触发关联计算规则',
      },
    ],
    cssTokens: [
      {
        token: '--dui-form-column-gap',
        fallback: '16px',
        description: '多列表单网格列间距',
      },
      {
        token: '--dui-form-row-gap',
        fallback: '20px',
        description: '表单行垂直间距',
      },
      {
        token: '--mat-sys-error',
        fallback: '#ba1a1a',
        description: '必填缺失与校验失败提示色',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { DuiFormStandaloneComponent } from '@dotos/dui/standalone';
import type { DuiFormSchema } from '@dotos/dui/schema';

@Component({
  selector: 'app-device-register-form',
  standalone: true,
  imports: [DuiFormStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      --dui-form-column-gap: 20px;
    }
  \`,
  template: \`
    <dui-standalone-form
      #formRef
      [schema]="formSchema()"
      [(value)]="formValue"
      (submitted)="onFormSubmit($event)"
    />
  \`,
})
export class DeviceRegisterFormComponent {
  private readonly formRef = viewChild.required<DuiFormStandaloneComponent>('formRef');

  protected readonly formSchema = signal<DuiFormSchema>({
    columns: 2,
    fields: [
      { key: 'deviceCode', label: '设备编码', type: 'text', required: true },
      {
        key: 'protocol',
        label: '采集协议',
        type: 'select',
        required: true,
        options: [
          { label: 'OPC-UA', value: 'opc-ua' },
          { label: 'Modbus-TCP', value: 'modbus-tcp' },
        ],
      },
      { key: 'pollingMs', label: '采样周期(ms)', type: 'number', min: 100, max: 60000 },
    ],
  });

  protected readonly formValue = signal<Readonly<Record<string, string | number | boolean | null>>>({
    deviceCode: 'GW-2026-01',
    protocol: 'opc-ua',
    pollingMs: 1000,
  });

  protected async onFormSubmit(
    payload: Readonly<Record<string, string | number | boolean | null>>
  ): Promise<void> {
    const check = await this.formRef().validateAll();
    if (check.valid && payload['deviceCode']) {
      return;
    }
  }
}`,
  },
  {
    packageName: '@dotos/duix',
    licenseTier: 'Enterprise BI Pro',
    standaloneImportPath: '@dotos/duix/standalone',
    schemaImportPath: '@dotos/duix/schema',
    selector: 'duix-standalone-grid',
    tag: '<duix-standalone-grid>',
    className: 'DuixGridStandaloneComponent',
    aliases: [
      'duix-grid',
      'grid',
      'duixgrid',
      'duixgridcomponent',
      'duixstandalonegridcomponent',
    ],
    category: 'data-grid',
    zonelessCompatible: true,
    schemaTarget: 'duix-grid',
    scenarios: [
      '十万至百万行虚拟滚动高密度企业数据表格',
      '支持列冻结、多列组合排序、复合过滤与单元格内联编辑的台账主表',
      '需要 Headless Command API 一键导出 CSV 与编程式过滤控制的控制台列表',
    ],
    recommendation:
      '高密度结构化表格、海量行虚拟滚动与多条件筛选导出场景必须选用 <duix-standalone-grid>（@dotos/duix/standalone）。',
    signalContracts: [
      {
        name: 'config',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<DuixGridSchema>',
        description: '表格列定义、rowKey、虚拟滚动与分页特性 Schema 配置',
      },
      {
        name: 'rows',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<readonly Readonly<Record<string, string | number | boolean | null>>[]>',
        description: '数据源行记录只读数组（配合 Signal 引用变更实现 O(1) 视图调度）',
      },
      {
        name: 'selectedRowKeys',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<readonly string[]>',
        defaultValue: '[]',
        description: '双向绑定的已勾选主键值集合（依赖 config.rowKey）',
      },
      {
        name: 'sortStateChange',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<readonly DuixGridSortDescriptor[]>',
        description: '用户点击列头切换排序或调用 applySort 时输出排序描述符',
      },
    ],
    headlessCommands: [
      {
        method: 'applyFilter',
        signature: 'applyFilter(field: string, operator: "eq" | "contains" | "gt" | "lt", value: string | number | boolean): void',
        returnType: 'void',
        description: '对指定列应用无头过滤条件并重算可见虚拟行索引',
      },
      {
        method: 'applySort',
        signature: 'applySort(field: string, direction: "asc" | "desc" | null): void',
        returnType: 'void',
        description: '对指定列设置升序、降序或清除单列排序',
      },
      {
        method: 'clearFilters',
        signature: 'clearFilters(): void',
        returnType: 'void',
        description: '一键清空所有列级与全局搜索过滤条件',
      },
      {
        method: 'exportCsv',
        signature: 'exportCsv(options?: { readonly fileName?: string; readonly onlyFiltered?: boolean }): string',
        returnType: 'string',
        description: '生成当前列与过滤视图的 UTF-8 CSV 文本并可选触发下载',
      },
    ],
    cssTokens: [
      {
        token: '--dui-grid-header-bg',
        fallback: 'var(--mat-sys-surface-container-high, #e6e8ee)',
        description: '固定表头区域背景色',
      },
      {
        token: '--dui-grid-row-height',
        fallback: '36px',
        description: '高密度数据行标准高度',
      },
      {
        token: '--dui-grid-row-hover-bg',
        fallback: 'var(--mat-sys-surface-container-low, #f3f5fa)',
        description: '鼠标悬停高亮行底色',
      },
      {
        token: '--mat-sys-outline-variant',
        fallback: '#c4c6d0',
        description: '单元格与表头分割线颜色',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { DuixGridStandaloneComponent } from '@dotos/duix/standalone';
import type { DuixGridSchema } from '@dotos/duix/schema';

@Component({
  selector: 'app-telemetry-data-grid',
  standalone: true,
  imports: [DuixGridStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      height: 520px;
      --dui-grid-row-height: 36px;
    }
  \`,
  template: \`
    <duix-standalone-grid
      #gridRef
      [config]="gridSchema()"
      [rows]="records()"
      [(selectedRowKeys)]="selectedIds"
    />
  \`,
})
export class TelemetryDataGridComponent {
  private readonly gridRef = viewChild.required<DuixGridStandaloneComponent>('gridRef');

  protected readonly gridSchema = signal<DuixGridSchema>({
    rowKey: 'id',
    virtualScroll: true,
    columns: [
      { field: 'id', header: '测点ID', width: 140, pinned: 'left' },
      { field: 'stationName', header: '所属工位', width: '35%', sortable: true },
      { field: 'temperature', header: '实时温度(℃)', width: 160, sortable: true },
    ],
  });

  protected readonly records = signal([
    { id: 'PT-101', stationName: '激光焊接工位', temperature: 68.4 },
    { id: 'PT-102', stationName: '涂胶固化烘道', temperature: 112.0 },
  ] as const);

  protected readonly selectedIds = signal<readonly string[]>([]);

  protected filterHighTemp(): void {
    this.gridRef().applyFilter('temperature', 'gt', 80);
  }

  protected downloadSnapshot(): string {
    return this.gridRef().exportCsv({ fileName: 'telemetry.csv', onlyFiltered: true });
  }
}`,
  },
  {
    packageName: '@dotos/duix',
    licenseTier: 'Enterprise BI Pro',
    standaloneImportPath: '@dotos/duix/standalone',
    schemaImportPath: '@dotos/duix/schema',
    selector: 'duix-standalone-pivot-grid',
    tag: '<duix-standalone-pivot-grid>',
    className: 'DuixPivotGridStandaloneComponent',
    aliases: [
      'duix-pivot-grid',
      'pivot-grid',
      'pivot',
      'duixpivotgrid',
      'duixpivotgridcomponent',
      'duixstandalonepivotgridcomponent',
    ],
    category: 'bi-analytics',
    zonelessCompatible: true,
    schemaTarget: 'duix-pivot-grid',
    scenarios: [
      '企业级多维交叉透视分析报表（行维度 × 列维度 × 多聚合指标）',
      '财务经营小计/总计自动汇总与多层级下钻分析矩阵',
      'BI 自助式探索透视工作台（内置 sum/avg/count/min/max 高速聚合引擎）',
    ],
    recommendation:
      '涉及行列交叉汇总、多维下钻与指标聚合（sum/avg/count/min/max）的 BI 分析场景必选 <duix-standalone-pivot-grid>。',
    signalContracts: [
      {
        name: 'config',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<DuixPivotGridSchema>',
        description: '透视表行维度 rows、列维度 columns 与指标聚合 measures 定义',
      },
      {
        name: 'dataset',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<readonly Readonly<Record<string, string | number | boolean | null>>[]>',
        description: '待交叉聚合的明细事实表数据集',
      },
      {
        name: 'showGrandTotals',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'true',
        description: '是否显示行与列双向总计汇总栏',
      },
      {
        name: 'cellDrilldown',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<DuixPivotDrilldownEvent>',
        description: '点击交叉汇总单元格下钻时派发维度坐标与底层明细切片',
      },
    ],
    headlessCommands: [
      {
        method: 'setAggregator',
        signature: 'setAggregator(measureField: string, aggregator: "sum" | "avg" | "count" | "min" | "max"): void',
        returnType: 'void',
        description: '动态切换指定指标字段的聚合计算函数并增量重算矩阵',
      },
      {
        method: 'expandAllRows',
        signature: 'expandAllRows(): void',
        returnType: 'void',
        description: '展开所有行维度分组层级',
      },
      {
        method: 'collapseAllRows',
        signature: 'collapseAllRows(): void',
        returnType: 'void',
        description: '收起所有行维度分组至顶层汇总',
      },
      {
        method: 'exportSliceJson',
        signature: 'exportSliceJson(): string',
        returnType: 'string',
        description: '导出当前透视切片配置与交叉汇总结果为格式化 JSON 字符串',
      },
    ],
    cssTokens: [
      {
        token: '--dui-pivot-total-bg',
        fallback: 'var(--mat-sys-secondary-container, #d7e3f7)',
        description: '小计与总计汇总行/列强调背景色',
      },
      {
        token: '--dui-pivot-cell-padding',
        fallback: '6px 12px',
        description: '交叉数值单元格内边距',
      },
      {
        token: '--mat-sys-on-surface',
        fallback: '#191c20',
        description: '指标聚合数值主文本色',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { DuixPivotGridStandaloneComponent } from '@dotos/duix/standalone';
import type { DuixPivotGridSchema } from '@dotos/duix/schema';

@Component({
  selector: 'app-yield-pivot-board',
  standalone: true,
  imports: [DuixPivotGridStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <duix-standalone-pivot-grid
      #pivotRef
      [config]="pivotConfig()"
      [dataset]="factRows()"
      [showGrandTotals]="true"
    />
  \`,
})
export class YieldPivotBoardComponent {
  private readonly pivotRef = viewChild.required<DuixPivotGridStandaloneComponent>('pivotRef');

  protected readonly pivotConfig = signal<DuixPivotGridSchema>({
    rows: [{ field: 'region', label: '大区' }],
    columns: [{ field: 'quarter', label: '季度' }],
    measures: [
      { field: 'outputQty', label: '合格产量', aggregator: 'sum' },
      { field: 'defectRate', label: '平均不良率', aggregator: 'avg' },
    ],
  });

  protected readonly factRows = signal([
    { region: '华东智造区', quarter: '2026-Q1', outputQty: 18500, defectRate: 0.002 },
    { region: '华南智造区', quarter: '2026-Q1', outputQty: 14200, defectRate: 0.003 },
  ] as const);

  protected switchToMaxOutput(): void {
    this.pivotRef().setAggregator('outputQty', 'max');
  }
}`,
  },
  {
    packageName: '@dotos/duix',
    licenseTier: 'Enterprise BI Pro',
    standaloneImportPath: '@dotos/duix/standalone',
    schemaImportPath: '@dotos/duix/schema',
    selector: 'duix-standalone-gantt',
    tag: '<duix-standalone-gantt>',
    className: 'DuixGanttStandaloneComponent',
    aliases: [
      'duix-gantt',
      'gantt',
      'duixgantt',
      'duixganttcomponent',
      'duixstandaloneganttcomponent',
    ],
    category: 'gantt-schedule',
    zonelessCompatible: true,
    schemaTarget: 'duix-gantt',
    scenarios: [
      'APS 高级生产排程、产线工序甘特图与里程碑进度追踪',
      '带前置任务依赖拓扑连线（FS/SS/FF）与关键路径高亮的项目计划表',
      '支持小时/天/周/月多粒度时间轴缩放与拖拽调度的工程进度看板',
    ],
    recommendation:
      '一切项目排期、APS 工序排程与任务依赖进度可视化场景统一选用 <duix-standalone-gantt>。',
    signalContracts: [
      {
        name: 'schedule',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<DuixGanttSchema>',
        description: '排程任务数组 tasks、前置依赖与时间轴视口配置（支持 validate_schema 校验）',
      },
      {
        name: 'zoomLevel',
        kind: 'model',
        required: false,
        typeSignature: "ModelSignal<'hour' | 'day' | 'week' | 'month' | 'quarter'>",
        defaultValue: "'day'",
        description: '时间轴刻度缩放粒度（双向 Signal 同步）',
      },
      {
        name: 'showCriticalPath',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'true',
        description: '是否自动计算并高亮关键路径任务与连线',
      },
      {
        name: 'taskRescheduled',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<{ readonly taskId: string; readonly startDate: string; readonly endDate: string }>',
        description: '用户拖拽调整任务起止时间条后派发更新结果',
      },
    ],
    headlessCommands: [
      {
        method: 'scrollToTask',
        signature: 'scrollToTask(taskId: string): boolean',
        returnType: 'boolean',
        description: '将时间轴与任务树同步平滑滚动至指定任务条位置',
      },
      {
        method: 'setZoomLevel',
        signature: 'setZoomLevel(level: "hour" | "day" | "week" | "month" | "quarter"): void',
        returnType: 'void',
        description: '编程式切换甘特图时间轴刻度粒度并保持中心视口锚点',
      },
      {
        method: 'exportSchedule',
        signature: 'exportSchedule(format?: "json" | "csv"): string',
        returnType: 'string',
        description: '导出包含依赖关系与完成度快照的排程数据文本',
      },
    ],
    cssTokens: [
      {
        token: '--dui-gantt-bar-bg',
        fallback: 'var(--mat-sys-primary, #005cbb)',
        description: '标准排程任务进度条填充色',
      },
      {
        token: '--dui-gantt-critical-color',
        fallback: 'var(--mat-sys-error, #ba1a1a)',
        description: '关键路径任务条与依赖箭头警示色',
      },
      {
        token: '--dui-gantt-row-height',
        fallback: '40px',
        description: '甘特图单行任务轨道高度',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { DuixGanttStandaloneComponent } from '@dotos/duix/standalone';
import type { DuixGanttSchema } from '@dotos/duix/schema';

@Component({
  selector: 'app-aps-production-gantt',
  standalone: true,
  imports: [DuixGanttStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      height: 480px;
      --dui-gantt-row-height: 40px;
    }
  \`,
  template: \`
    <duix-standalone-gantt
      #ganttRef
      [schedule]="ganttSchedule()"
      [(zoomLevel)]="zoom"
      [showCriticalPath]="true"
    />
  \`,
})
export class ApsProductionGanttComponent {
  private readonly ganttRef = viewChild.required<DuixGanttStandaloneComponent>('ganttRef');

  protected readonly zoom = signal<'hour' | 'day' | 'week' | 'month' | 'quarter'>('day');

  protected readonly ganttSchedule = signal<DuixGanttSchema>({
    viewMode: 'day',
    tasks: [
      {
        id: 'T-100',
        name: '模具预热与首件标定',
        startDate: '2026-11-15',
        endDate: '2026-11-17',
        progress: 100,
      },
      {
        id: 'T-200',
        name: '批次连续冲压生产',
        startDate: '2026-11-18',
        endDate: '2026-11-24',
        progress: 45,
        dependencies: ['T-100'],
      },
    ],
  });

  protected focusBatchTask(): void {
    this.ganttRef().setZoomLevel('week');
    this.ganttRef().scrollToTask('T-200');
  }
}`,
  },
  {
    packageName: '@dotos/xdraw',
    licenseTier: 'Industrial 2D Topology',
    standaloneImportPath: '@dotos/xdraw/standalone',
    schemaImportPath: '@dotos/xdraw/schema',
    selector: 'xdraw-standalone-canvas',
    tag: '<xdraw-standalone-canvas>',
    className: 'XdrawCanvasStandaloneComponent',
    aliases: [
      'xdraw-canvas',
      'canvas',
      'xdraw',
      'xdrawcanvas',
      'xdrawcanvascomponent',
      'xdrawstandalonecanvascomponent',
    ],
    category: 'diagram-2d',
    zonelessCompatible: true,
    schemaTarget: 'xdraw-canvas',
    scenarios: [
      '2D 工业组态（SCADA）工艺流程图、电力单线图与管网监控画布',
      '微服务调用链拓扑图、网络设备连接关系图与 DAG 工作流编排器',
      '需要自动布局（dagre/grid/circular/force）、节点告警染色与无损 SVG 导出的图形应用',
    ],
    recommendation:
      '一切 2D 工业组态、DAG 工作流编排与节点连线拓扑可视化场景必选 <xdraw-standalone-canvas>（@dotos/xdraw/standalone）。',
    signalContracts: [
      {
        name: 'graph',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<XdrawCanvasSchema>',
        description: '画布图谱定义（含 nodes 坐标节点、edges 有向连线与 layout 算法配置）',
      },
      {
        name: 'selectedNodeIds',
        kind: 'model',
        required: false,
        typeSignature: 'ModelSignal<readonly string[]>',
        defaultValue: '[]',
        description: '当前框选或点选的图元节点 ID 数组（双向绑定）',
      },
      {
        name: 'interactive',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'true',
        description: '是否允许画布平移缩放、节点拖拽与端口连线交互',
      },
      {
        name: 'nodeClicked',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<{ readonly nodeId: string; readonly label: string }>',
        description: '点击画布图元节点时派发节点标识信息',
      },
    ],
    headlessCommands: [
      {
        method: 'highlightNodes',
        signature: 'highlightNodes(ids: readonly string[]): void',
        returnType: 'void',
        description: '高亮指定节点集合及直接关联连线，其余图元自动降噪半透明展示',
      },
      {
        method: 'autoLayout',
        signature: 'autoLayout(algorithm: "dagre" | "grid" | "circular" | "force"): void',
        returnType: 'void',
        description: '基于指定布局算法重算全图节点坐标并平滑过渡',
      },
      {
        method: 'exportSvg',
        signature: 'exportSvg(): string',
        returnType: 'string',
        description: '将当前组态拓扑图完整序列化为独立可打印的矢量 SVG 字符串',
      },
      {
        method: 'fitView',
        signature: 'fitView(paddingPx?: number): void',
        returnType: 'void',
        description: '自动计算包围盒并将全部图元自适应居中缩放至画布可视区域',
      },
    ],
    cssTokens: [
      {
        token: '--dui-xdraw-canvas-bg',
        fallback: 'var(--mat-sys-surface, #faf9fd)',
        description: '组态画布底层背景颜色',
      },
      {
        token: '--dui-xdraw-grid-dot-color',
        fallback: 'var(--mat-sys-outline-variant, #c4c6d0)',
        description: '画布对齐点阵网格颜色',
      },
      {
        token: '--dui-xdraw-node-highlight-stroke',
        fallback: 'var(--mat-sys-primary, #005cbb)',
        description: '选中或 highlightNodes 激活节点的描边光晕颜色',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { XdrawCanvasStandaloneComponent } from '@dotos/xdraw/standalone';
import type { XdrawCanvasSchema } from '@dotos/xdraw/schema';

@Component({
  selector: 'app-scada-topology-view',
  standalone: true,
  imports: [XdrawCanvasStandaloneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      height: 560px;
      --dui-xdraw-node-highlight-stroke: #005cbb;
    }
  \`,
  template: \`
    <xdraw-standalone-canvas
      #canvasRef
      [graph]="topologyGraph()"
      [(selectedNodeIds)]="selectedIds"
    />
  \`,
})
export class ScadaTopologyViewComponent {
  private readonly canvasRef = viewChild.required<XdrawCanvasStandaloneComponent>('canvasRef');

  protected readonly selectedIds = signal<readonly string[]>([]);

  protected readonly topologyGraph = signal<XdrawCanvasSchema>({
    layout: 'dagre',
    nodes: [
      { id: 'plc-01', label: '主控 PLC-01', x: 80, y: 160 },
      { id: 'arm-01', label: '六轴机械臂 #1', x: 340, y: 160 },
    ],
    edges: [
      { id: 'edge-1', source: 'plc-01', target: 'arm-01', label: 'EtherCAT' },
    ],
  });

  protected relayoutAndExport(): string {
    this.canvasRef().autoLayout('dagre');
    this.canvasRef().highlightNodes(['plc-01']);
    this.canvasRef().fitView(24);
      return this.canvasRef().exportSvg();
    }
  }`,
  },
  {
    packageName: '@dotos/dui',
    licenseTier: 'MIT Open Source',
    standaloneImportPath: '@dotos/dui/standalone',
    schemaImportPath: '@dotos/dui/micro-app',
    selector: 'dui-micro-app',
    tag: '<dui-micro-app>',
    className: 'DuiMicroAppComponent',
    aliases: [
      'micro-app',
      'microapp',
      'duimicroapp',
      'duimicroappcomponent',
      'dui-standalone-micro-app',
      'micro-frontend',
    ],
    category: 'layout-dock',
    zonelessCompatible: true,
    scenarios: [
      '跨框架微前端嵌入（在 Angular 22 Zoneless 宿主中挂载 React 18/19、Vue 3 或跨大版本 Angular ESM 子应用）',
      'Native Federation（Import Maps / remoteEntry.json）与 Webpack Module Federation 渐进迁移桥接',
      '宿主 M3 --mat-sys-* / --dui-* 主题令牌自动穿透（含 Shadow DOM 样式隔离）与跨框架事件互通',
    ],
    recommendation:
      '需要在主工作台嵌入独立部署的 React/Vue/跨版本 Angular 微服务并共享 M3 主题变量、多语言、登录态与事件总线时，首选 <dui-micro-app>。',
    signalContracts: [
      {
        name: 'remote',
        kind: 'input',
        required: true,
        typeSignature: 'InputSignal<DuiMicroAppRemoteDescriptor>',
        description: "远程微应用协议描述符（支持 'esm-mount' | 'native-federation' | 'webpack-mf'）",
      },
      {
        name: 'props',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<Record<string, unknown>>',
        defaultValue: '{}',
        description: '同步注入至微应用上下文并在变化时触发 update(el, context) 的业务参数字典',
      },
      {
        name: 'authToken',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<string | null>',
        defaultValue: 'null',
        description: '注入给远程微应用的当前用户 Bearer 认证令牌',
      },
      {
        name: 'locale',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<string>',
        defaultValue: "'zh_CN'",
        description: '当前语言区域代码（切换时响应式触发微应用 update）',
      },
      {
        name: 'useShadowDom',
        kind: 'input',
        required: false,
        typeSignature: 'InputSignal<boolean>',
        defaultValue: 'false',
        description: '是否开启开放式 ShadowRoot 样式隔离并自动穿透注入 M3 CSS 变量',
      },
      {
        name: 'mounted',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<void>',
        description: '远程微应用完成首次加载与挂载时触发',
      },
      {
        name: 'loadError',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<unknown>',
        description: '远程模块加载或挂载生命周期抛错时触发',
      },
      {
        name: 'microEvent',
        kind: 'output',
        required: false,
        typeSignature: 'OutputEmitterRef<{ topic: string; payload: unknown }>',
        description: '接收 DuiMicroAppEventBus 及外部 CustomEvent("dui:micro-app-event") 的跨框架消息',
      },
    ],
    headlessCommands: [
      {
        method: 'DuiMicroAppEventBus.emit',
        signature: 'emit<TPayload = unknown>(topic: string, payload: TPayload): void',
        returnType: 'void',
        description: '向同进程订阅者与浏览器 window CustomEvent("dui:micro-app-event") 广播强类型跨框架事件',
      },
      {
        method: 'DuiMicroAppEventBus.on',
        signature: 'on<TPayload = unknown>(topic: string, handler: (payload: TPayload) => void): () => void',
        returnType: '() => void',
        description: '订阅指定主题的微前端消息并返回取消订阅清理函数',
      },
    ],
    cssTokens: [
      {
        token: '--mat-sys-surface',
        fallback: '#faf9fd',
        description: '自动同步并穿透至微应用挂载容器（含 ShadowRoot）的 M3 表面背景色',
      },
      {
        token: '--dui-primary',
        fallback: 'var(--mat-sys-primary, #00897b)',
        description: '自动同步至微应用宿主容器的品牌主色令牌',
      },
    ],
    goldenExampleTs: `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  DuiMicroAppComponent,
  DuiMicroAppEventBus,
  type DuiMicroAppRemoteDescriptor,
} from '@dotos/dui/standalone';

@Component({
  selector: 'app-ai-copilot-island',
  standalone: true,
  imports: [DuiMicroAppComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: \`
    :host {
      display: block;
      min-height: 360px;
      border: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
      border-radius: 12px;
    }
  \`,
  template: \`
    <dui-micro-app
      [remote]="copilotRemote()"
      [props]="islandProps()"
      [locale]="activeLocale()"
      [useShadowDom]="true"
      (microEvent)="onIslandMessage($event)"
    />
  \`,
})
export class AiCopilotIslandComponent {
  private readonly eventBus = inject(DuiMicroAppEventBus);

  protected readonly activeLocale = signal<string>('zh_CN');
  protected readonly islandProps = signal<Record<string, unknown>>({
    workstationId: 'WS-LINE-04',
  });

  protected readonly copilotRemote = signal<DuiMicroAppRemoteDescriptor>({
    protocol: 'esm-mount',
    name: 'react-copilot-island',
    entryUrl: '/remotes/copilot-island/index.mjs',
  });

  protected notifyRefresh(): void {
    this.eventBus.emit('workstation:refresh', { timestamp: Date.now() });
  }

  protected onIslandMessage(evt: { topic: string; payload: unknown }): void {
    if (evt.topic === 'copilot:ready') {
      this.notifyRefresh();
    }
  }
}`,
  },
];

/**
 * 组件选型决策矩阵（覆盖全部典型企业研发场景）
 */
const SELECTION_DECISION_MATRIX: readonly SelectionDecisionRow[] = [
  {
    scenarioRequirement: '动态数据录入、编辑弹窗、多条件搜索栏',
    recommendedTag: '<dui-standalone-form>',
    importEntry: '@dotos/dui/standalone',
    category: 'form',
    rationale: 'JSON Schema 驱动零模板表单，配合 validate_schema(target="dui-form") 自动消除字段配置幻觉。',
  },
  {
    scenarioRequirement: '海量行数据台账、虚拟滚动、列排序过滤与 CSV 导出',
    recommendedTag: '<duix-standalone-grid>',
    importEntry: '@dotos/duix/standalone',
    category: 'data-grid',
    rationale: '企业级高密度虚拟表格，内置 applyFilter/applySort/exportCsv 等无头控制 API。',
  },
  {
    scenarioRequirement: '多维交叉汇总报表、行×列透视指标聚合与下钻',
    recommendedTag: '<duix-standalone-pivot-grid>',
    importEntry: '@dotos/duix/standalone',
    category: 'bi-analytics',
    rationale: '原生支持 sum/avg/count/min/max 高速多维切片聚合，无需手写分组归约逻辑。',
  },
  {
    scenarioRequirement: 'APS 生产排程、项目里程碑进度、任务前置依赖连线',
    recommendedTag: '<duix-standalone-gantt>',
    importEntry: '@dotos/duix/standalone',
    category: 'gantt-schedule',
    rationale: '专业甘特排程组件，内置关键路径染色、多粒度时间轴缩放与时序依赖拓扑。',
  },
  {
    scenarioRequirement: '2D 工业组态 SCADA、DAG 拓扑编排、矢量 SVG 导出',
    recommendedTag: '<xdraw-standalone-canvas>',
    importEntry: '@dotos/xdraw/standalone',
    category: 'diagram-2d',
    rationale: '内置 dagre/grid/circular/force 自动布局及 highlightNodes/fitView/exportSvg 工业画布引擎。',
  },
  {
    scenarioRequirement: '可拖拽多栏工作台、IDE 左右/上下停靠分栏（替代废弃 fxLayout）',
    recommendedTag: '<dui-standalone-split-dock>',
    importEntry: '@dotos/dui/standalone',
    category: 'layout-dock',
    rationale: '原生 Zoneless 高性能停靠分栏与多视图 <dui-standalone-tabs> 组合，彻底取代废弃 fxLayout。',
  },
  {
    scenarioRequirement: '多页签视图切换与可关闭文档标签栏',
    recommendedTag: '<dui-standalone-tabs>',
    importEntry: '@dotos/dui/standalone',
    category: 'layout-dock',
    rationale: '支持 Signal 双向激活态绑定与面板惰性挂载，降低复杂工作台首屏渲染开销。',
  },
  {
    scenarioRequirement: '组织架构、资产台账层级树与级联复选导航',
    recommendedTag: '<dui-standalone-tree>',
    importEntry: '@dotos/dui/standalone',
    category: 'navigation-tree',
    rationale: '支持关键词高亮过滤、父子级联勾选与节点自动展开定位。',
  },
  {
    scenarioRequirement: '按钮防抖异步加载反馈、KPI 概览与可折叠状态卡片',
    recommendedTag: '<dui-standalone-button> / <dui-standalone-card>',
    importEntry: '@dotos/dui/standalone',
    category: 'feedback',
    rationale: 'MIT 开源核心交互基石，内置 Material 3 令牌体系与无障碍交互保障。',
  },
  {
    scenarioRequirement: '跨框架微前端嵌入（React 18/19、Vue 3、Native Federation / Webpack MF 子应用）',
    recommendedTag: '<dui-micro-app>',
    importEntry: '@dotos/dui/standalone',
    category: 'layout-dock',
    rationale: '统一桥接 esm-mount / native-federation / webpack-mf 协议，自动同步 M3 主题令牌与 DuiMicroAppEventBus 跨框架事件总线。',
  },
];

/**
 * 归一化输入的组件标识字符串（剥离尖括号、空白、大小写、横杠/下划线差异）
 */
function normalizeIdentifier(raw: string): string {
  return raw
    .trim()
    .replace(/^[<\s]+|[>\s]+$/g, '')
    .toLowerCase()
    .replace(/[_\s-]+/g, '');
}

/**
 * 计算两个字符串的 Levenshtein 编辑距离（用于未知组件名的相近候选推荐）
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0)
  );

  for (let i = 0; i <= m; i += 1) {
    const row = dp[i];
    if (row) {
      row[0] = i;
    }
  }
  const firstRow = dp[0];
  if (firstRow) {
    for (let j = 0; j <= n; j += 1) {
      firstRow[j] = j;
    }
  }

  for (let i = 1; i <= m; i += 1) {
    const currentRow = dp[i];
    const prevRow = dp[i - 1];
    if (!currentRow || !prevRow) {
      continue;
    }
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const deletion = (prevRow[j] ?? 0) + 1;
      const insertion = (currentRow[j - 1] ?? 0) + 1;
      const substitution = (prevRow[j - 1] ?? 0) + cost;
      currentRow[j] = Math.min(deletion, insertion, substitution);
    }
  }

  return dp[m]?.[n] ?? Math.max(m, n);
}

/**
 * 执行工具 1：按包名、类别、Zoneless 兼容性与关键词过滤组件目录并生成决策矩阵
 */
export function executeListDotosComponents(input: ListComponentsInput = {}): ListComponentsOutput {
  const pkgFilter = input.package ?? 'all';
  const categoryFilter = input.category;
  const zonelessOnly = input.zonelessOnly ?? false;
  const rawQuery = (input.query ?? '').trim();
  const queryLower = rawQuery.toLowerCase();

  const filtered = DOTOS_COMPONENT_CATALOG.filter((entry) => {
    if (pkgFilter !== 'all' && entry.packageName !== pkgFilter) {
      return false;
    }
    if (categoryFilter !== undefined && entry.category !== categoryFilter) {
      return false;
    }
    if (zonelessOnly && !entry.zonelessCompatible) {
      return false;
    }
    if (queryLower.length > 0) {
      const searchable = [
        entry.packageName,
        entry.selector,
        entry.tag,
        entry.className,
        entry.category,
        entry.recommendation,
        ...entry.aliases,
        ...entry.scenarios,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(queryLower)) {
        return false;
      }
    }
    return true;
  });

  const decisionMatrix = SELECTION_DECISION_MATRIX.filter((row) => {
    if (pkgFilter !== 'all' && !row.importEntry.startsWith(pkgFilter)) {
      return false;
    }
    if (categoryFilter !== undefined && row.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  return {
    totalCount: filtered.length,
    appliedFilters: {
      package: pkgFilter,
      category: categoryFilter ?? 'all',
      zonelessOnly,
      query: rawQuery,
    },
    packageOverview: [
      {
        packageName: '@dotos/dui',
        standaloneEntry: '@dotos/dui/standalone',
        positioning: 'MIT 开源核心交互、布局停靠、层级树与 Schema 动态表单基础包',
        componentCount: DOTOS_COMPONENT_CATALOG.filter((c) => c.packageName === '@dotos/dui').length,
      },
      {
        packageName: '@dotos/duix',
        standaloneEntry: '@dotos/duix/standalone',
        positioning: '企业级高密度虚拟数据表格、多维交叉透视 BI 与 APS 甘特排程 Pro 包',
        componentCount: DOTOS_COMPONENT_CATALOG.filter((c) => c.packageName === '@dotos/duix').length,
      },
      {
        packageName: '@dotos/xdraw',
        standaloneEntry: '@dotos/xdraw/standalone',
        positioning: '2D 工业组态（SCADA）、拓扑连线图与自动布局矢量画布包',
        componentCount: DOTOS_COMPONENT_CATALOG.filter((c) => c.packageName === '@dotos/xdraw').length,
      },
    ],
    components: filtered.map((entry) => ({
      packageName: entry.packageName,
      licenseTier: entry.licenseTier,
      importEntry: entry.standaloneImportPath,
      schemaEntry: entry.schemaImportPath,
      selector: entry.selector,
      tag: entry.tag,
      className: entry.className,
      category: entry.category,
      zonelessCompatible: entry.zonelessCompatible,
      schemaTarget: entry.schemaTarget,
      scenarios: entry.scenarios,
      recommendation: entry.recommendation,
    })),
    decisionMatrix,
  };
}

/**
 * 执行工具 2：智能归一化解析组件名称并返回完整零 any API 契约与黄金源码示例
 */
export function executeGetComponentApiAndExample(rawComponent: string): GetComponentApiOutput {
  const normalizedTarget = normalizeIdentifier(rawComponent);
  // 额外兼容形如 DuiFormComponent -> duiform 的去后缀匹配
  const strippedTarget = normalizedTarget
    .replace(/standalonecomponent$/g, '')
    .replace(/component$/g, '')
    .replace(/standalone/g, '');

  const matched = DOTOS_COMPONENT_CATALOG.find((entry) => {
    const candidateTokens = [
      entry.selector,
      entry.tag,
      entry.className,
      ...entry.aliases,
    ].map(normalizeIdentifier);

    if (candidateTokens.includes(normalizedTarget)) {
      return true;
    }
    if (strippedTarget.length > 0 && candidateTokens.includes(strippedTarget)) {
      return true;
    }
    return false;
  });

  if (matched) {
    return {
      found: true,
      requestedName: rawComponent,
      resolvedSelector: matched.selector,
      tag: matched.tag,
      className: matched.className,
      packageName: matched.packageName,
      category: matched.category,
      zonelessCompatible: matched.zonelessCompatible,
      schemaTarget: matched.schemaTarget,
      imports: {
        standaloneImportPath: matched.standaloneImportPath,
        schemaImportPath: matched.schemaImportPath,
        importStatement: `import { ${matched.className} } from '${matched.standaloneImportPath}';`,
      },
      signalContracts: matched.signalContracts,
      headlessCommandApi: matched.headlessCommands,
      cssTokenHooks: matched.cssTokens,
      antiPatternBans: DOTOS_ANTI_PATTERN_BANS,
      goldenStandaloneExample: matched.goldenExampleTs,
    };
  }

  // 计算相近候选组件（综合子串包含加权与编辑距离排序）
  const rankedCandidates = [...DOTOS_COMPONENT_CATALOG]
    .map((entry) => {
      const keys = [entry.selector, entry.className, ...entry.aliases].map(normalizeIdentifier);
      const bestDistance = Math.min(
        ...keys.map((key) => {
          if (
            normalizedTarget.length > 0 &&
            (key.includes(normalizedTarget) || normalizedTarget.includes(key))
          ) {
            return 0;
          }
          // 语义近义词加分（如 table/datagrid -> grid，graph/diagram -> canvas）
          if (
            /(table|datagrid|list)/.test(normalizedTarget) &&
            entry.selector === 'duix-standalone-grid'
          ) {
            return 1;
          }
          if (
            /(chart|olap|cube|bi)/.test(normalizedTarget) &&
            entry.selector === 'duix-standalone-pivot-grid'
          ) {
            return 1;
          }
          if (
            /(schedule|timeline|plan)/.test(normalizedTarget) &&
            entry.selector === 'duix-standalone-gantt'
          ) {
            return 1;
          }
          if (
            /(graph|flow|scada|topology|diagram)/.test(normalizedTarget) &&
            entry.selector === 'xdraw-standalone-canvas'
          ) {
            return 1;
          }
          if (
            /(input|field|dialogform)/.test(normalizedTarget) &&
            entry.selector === 'dui-standalone-form'
          ) {
            return 1;
          }
          if (
            /(layout|split|dock|flex)/.test(normalizedTarget) &&
            entry.selector === 'dui-standalone-split-dock'
          ) {
            return 1;
          }
          if (
            /(micro|federation|island|remote|react|vue)/.test(normalizedTarget) &&
            entry.selector === 'dui-micro-app'
          ) {
            return 1;
          }
          return levenshteinDistance(normalizedTarget, key);
        })
      );
      return { entry, score: bestDistance };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const topCandidate = rankedCandidates[0]?.entry ?? DOTOS_COMPONENT_CATALOG[0];
  const candidateSummary = rankedCandidates
    .map((item) => `'${item.entry.selector}' (${item.entry.className})`)
    .join('、');

  const notFoundResult: ComponentApiNotFoundOutput = {
    found: false,
    requestedName: rawComponent,
    error: `未在 DOTOS Angular 22 组件库中找到组件 "${rawComponent}"。`,
    hint: topCandidate
      ? `您是否要查找 '${topCandidate.selector}'（类名 ${topCandidate.className}，导入自 '${topCandidate.standaloneImportPath}'）？相近候选组件：${candidateSummary}。也可先调用 list_dotos_components 浏览全量支持列表。`
      : '请调用 list_dotos_components 获取全量标准选择器列表。',
    candidates: rankedCandidates.map(({ entry }) => ({
      selector: entry.selector,
      tag: entry.tag,
      className: entry.className,
      packageName: entry.packageName,
    })),
  };

  return notFoundResult;
}
