/**
 * @fileoverview Module `src/core/dynamic/dynamic.component.ts` providing AOT Schema, Safe Micro-Template, and lazy-JIT `<dui-dynamic>`.
 * @zh 模块文件 `src/core/dynamic/dynamic.component.ts`，提供支持 AOT 卡片 Schema、安全微模板无 JIT 渲染及复杂 Angular 模板按需异步加载 `@angular/compiler` 的动态渲染组件。
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  ɵcompileComponent,
} from '@angular/core';
import { SafeurlPipe } from './safeurl.pipe';

/**
 * Status badge tone options for `DuiDynamicCardSchema`.
 * @zh `DuiDynamicCardSchema` 状态徽标色调枚举联合类型。
 */
export type DuiDynamicCardTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/**
 * Rendering pipeline mode selected by `DynamicComponent`.
 * @zh `DynamicComponent` 当前激活的渲染管线模式。
 */
export type DuiDynamicRenderMode = 'idle' | 'schema' | 'micro-template' | 'jit';

/**
 * Key-value field item inside `DuiDynamicCardSchema`.
 * @zh `DuiDynamicCardSchema` 中的字段键值网格项定义。
 */
export interface DuiDynamicCardField {
  /**
   * Property path read from `data` when `value` is omitted (e.g. `'assignee'` or `'meta.owner'`).
   * @zh 当未直接指定 `value` 时从 `data` 读取的安全属性路径（如 `'assignee'` 或 `'meta.owner'`）。
   */
  readonly key: string;
  /**
   * Human-readable field label.
   * @zh 字段展示标签名。
   */
  readonly label: string;
  /**
   * Optional explicit static/interpolated display value overriding `data[key]`.
   * @zh 可选显式展示值（支持覆盖 `data[key]`）。
   */
  readonly value?: string | number | boolean | null;
}

/**
 * Declarative AOT card schema rendered by `<dui-dynamic>` without invoking `ɵcompileComponent` or `@angular/compiler`.
 * @zh 由 `<dui-dynamic>` 纯 AOT 渲染的声明式卡片 Schema 契约（零 `@angular/compiler` 与零 `ɵcompileComponent` 开销）。
 */
export interface DuiDynamicCardSchema {
  /**
   * Schema discriminator `'dui-card'`.
   * @zh 卡片 Schema 固定类型标识 `'dui-card'`。
   */
  readonly type: 'dui-card';
  /**
   * Static or `{{ path }}`-interpolated card title.
   * @zh 卡片主标题（支持静态文本或 `{{ path }}` 插值）。
   */
  readonly title?: string;
  /**
   * Property path on `data` used to read card title when `title` is omitted.
   * @zh 从 `data` 读取卡片主标题的属性路径。
   */
  readonly titleField?: string;
  /**
   * Static or `{{ path }}`-interpolated card subtitle.
   * @zh 卡片副标题（支持静态文本或 `{{ path }}` 插值）。
   */
  readonly subtitle?: string;
  /**
   * Property path on `data` used to read card subtitle when `subtitle` is omitted.
   * @zh 从 `data` 读取卡片副标题的属性路径。
   */
  readonly subtitleField?: string;
  /**
   * Static or `{{ path }}`-interpolated status badge text.
   * @zh 状态徽标文本（支持静态文本或 `{{ path }}` 插值）。
   */
  readonly status?: string;
  /**
   * Property path on `data` used to read status badge text when `status` is omitted.
   * @zh 从 `data` 读取状态徽标文本的属性路径。
   */
  readonly statusField?: string;
  /**
   * Visual semantic tone of the status badge.
   * @zh 状态徽标的视觉语义色调。
   */
  readonly statusTone?: DuiDynamicCardTone;
  /**
   * Key-value metadata rows rendered in the card grid.
   * @zh 卡片键值网格字段集合。
   */
  readonly fields?: ReadonlyArray<DuiDynamicCardField>;
}

/**
 * Resolved view-model consumed by `dynamic.component.html` in AOT Schema mode.
 * @zh AOT Schema 渲染模式下供模板直接绑定的解析后卡片视图模型。
 */
export interface ResolvedDynamicCardView {
  /**
   * Resolved title text.
   * @zh 解析后的主标题文本。
   */
  readonly title: string;
  /**
   * Resolved subtitle text.
   * @zh 解析后的副标题文本。
   */
  readonly subtitle: string;
  /**
   * Resolved status badge text.
   * @zh 解析后的状态徽标文本。
   */
  readonly status: string;
  /**
   * Resolved badge tone.
   * @zh 解析后的徽标色调。
   */
  readonly statusTone: DuiDynamicCardTone;
  /**
   * Resolved key-value field pairs.
   * @zh 解析后的字段键值数组。
   */
  readonly fields: ReadonlyArray<{ readonly label: string; readonly value: string }>;
}

interface DynamicJitInstance {
  data: unknown;
}

const ALLOWED_MICRO_TEMPLATE_TAGS: ReadonlySet<string> = new Set<string>([
  'div',
  'span',
  'p',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'small',
  'mark',
  'code',
  'pre',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'section',
  'article',
  'header',
  'footer',
  'aside',
  'main',
  'nav',
  'br',
  'hr',
  'img',
  'a',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'label',
  'time',
  'abbr',
  'sup',
  'sub',
]);

const SAFE_PATH_EXPR_RE =
  /^\s*[a-zA-Z_$][\w$]*(?:(?:\.[a-zA-Z_$][\w$]*)|(?:\[\d+\]))*\s*$/;
const INTERPOLATION_TOKEN_RE = /\{\{([\s\S]*?)\}\}/g;
const ANGULAR_CONTROL_FLOW_RE = /@(?:if|for|switch|defer|let|empty|else)\b/;
const BLOCKED_PROTOTYPE_KEYS: ReadonlySet<string> = new Set<string>([
  '__proto__',
  'prototype',
  'constructor',
]);

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDynamicCardSchema(value: unknown): value is DuiDynamicCardSchema {
  return isRecordObject(value) && value['type'] === 'dui-card';
}

function tryParseCardSchemaJson(raw: string): DuiDynamicCardSchema | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return isDynamicCardSchema(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function formatInterpolatedValue(val: unknown): string {
  if (val === null || val === undefined) {
    return '';
  }
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'bigint') {
    return String(val);
  }
  return '';
}

/**
 * Safely reads a dotted/indexed property path (e.g. `data.title` or `user.name`) from `data` without `eval`.
 * @zh 在不使用 `eval` 的前提下安全读取点分或数组下标属性路径（兼容 `data.xxx` 与直接 `xxx` 访问）。
 * @param data - Data context (`unknown`) / 数据上下文（`unknown`）
 * @param rawPath - Property path expression (`string`) / 属性路径表达式（`string`）
 * @returns Resolved property value (`unknown`) / 读取到的属性值
 */
export function readDynamicSafePath(data: unknown, rawPath: string): unknown {
  const trimmed = rawPath.trim();
  if (!SAFE_PATH_EXPR_RE.test(trimmed)) {
    return undefined;
  }
  const normalized = trimmed.replace(/\[(\d+)\]/g, '.$1');
  const segments = normalized.split('.').filter((seg: string): boolean => seg.length > 0);
  if (segments.length === 0) {
    return undefined;
  }

  const rootScope: Record<string, unknown> = isRecordObject(data)
    ? { ...data, data }
    : { data };

  let cursor: unknown = rootScope;
  for (const segment of segments) {
    if (BLOCKED_PROTOTYPE_KEYS.has(segment)) {
      return undefined;
    }
    if (Array.isArray(cursor)) {
      const idx = Number(segment);
      if (!Number.isInteger(idx) || idx < 0 || idx >= cursor.length) {
        return undefined;
      }
      cursor = cursor[idx];
      continue;
    }
    if (!isRecordObject(cursor) || !Object.prototype.hasOwnProperty.call(cursor, segment)) {
      return undefined;
    }
    cursor = cursor[segment];
  }
  return cursor;
}

function interpolateTextWithData(rawText: string, data: unknown): string {
  if (!rawText.includes('{{')) {
    return rawText;
  }
  return rawText.replace(INTERPOLATION_TOKEN_RE, (_full: string, expr: string): string =>
    formatInterpolatedValue(readDynamicSafePath(data, expr)),
  );
}

function isSafeUrlValue(urlValue: string): boolean {
  const compact = urlValue.replace(/[\u0000-\u0020]+/g, '').toLowerCase();
  if (
    compact.startsWith('javascript:') ||
    compact.startsWith('vbscript:') ||
    compact.startsWith('data:text/html')
  ) {
    return false;
  }
  return true;
}

/**
 * Determines whether an HTML template string can be safely rendered via the AOT Micro-Template DOM pipeline
 * without loading `@angular/compiler`.
 * @zh 检测给定 HTML 字符串模板是否仅含标准 HTML 标签与安全属性插值 `{{ path }}`，可走零 `@angular/compiler` 的安全微模板路径。
 * @param rawTemplate - Template HTML string (`string`) / 待检测模板字符串（`string`）
 * @returns `true` if eligible for AOT Micro-Template rendering (`boolean`) / 是否可走安全微模板路径
 */
export function isSafeMicroTemplate(rawTemplate: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  if (ANGULAR_CONTROL_FLOW_RE.test(rawTemplate)) {
    return false;
  }

  INTERPOLATION_TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null = INTERPOLATION_TOKEN_RE.exec(rawTemplate);
  while (match !== null) {
    if (!SAFE_PATH_EXPR_RE.test(match[1])) {
      return false;
    }
    match = INTERPOLATION_TOKEN_RE.exec(rawTemplate);
  }

  const tpl = document.createElement('template');
  tpl.innerHTML = rawTemplate;

  const checkElementTree = (root: ParentNode): boolean => {
    const children = Array.from(root.children);
    for (const el of children) {
      const tag = el.tagName.toLowerCase();
      if (!ALLOWED_MICRO_TEMPLATE_TAGS.has(tag)) {
        return false;
      }
      if (el instanceof HTMLTemplateElement) {
        return false;
      }
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name;
        const lowerName = name.toLowerCase();
        if (
          name.startsWith('*') ||
          name.startsWith('[') ||
          name.startsWith('(') ||
          name.startsWith('#') ||
          lowerName.startsWith('bind-') ||
          lowerName.startsWith('on-') ||
          lowerName.startsWith('bindon-') ||
          lowerName.startsWith('ng-') ||
          lowerName === 'ngif' ||
          lowerName === 'ngfor' ||
          lowerName === 'ngswitch' ||
          lowerName === 'ngclass' ||
          lowerName === 'ngstyle' ||
          lowerName === 'ngmodel'
        ) {
          return false;
        }
      }
      if (!checkElementTree(el)) {
        return false;
      }
    }
    return true;
  };

  return checkElementTree(tpl.content);
}

function renderSafeMicroTemplateFragment(rawTemplate: string, data: unknown): DocumentFragment {
  const tpl = document.createElement('template');
  tpl.innerHTML = rawTemplate;

  const sanitizeAndInterpolateNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const rawText = node.nodeValue ?? '';
      if (rawText.includes('{{')) {
        node.textContent = interpolateTextWithData(rawText, data);
      }
      return;
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      if (!ALLOWED_MICRO_TEMPLATE_TAGS.has(tag)) {
        el.remove();
        return;
      }
      for (const attr of Array.from(el.attributes)) {
        const lowerName = attr.name.toLowerCase();
        if (lowerName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }
        const nextVal = attr.value.includes('{{')
          ? interpolateTextWithData(attr.value, data)
          : attr.value;
        if (
          (lowerName === 'href' || lowerName === 'src' || lowerName === 'xlink:href') &&
          !isSafeUrlValue(nextVal)
        ) {
          el.removeAttribute(attr.name);
          continue;
        }
        if (nextVal !== attr.value) {
          el.setAttribute(attr.name, nextVal);
        }
      }
      for (const child of Array.from(el.childNodes)) {
        sanitizeAndInterpolateNode(child);
      }
    }
  };

  for (const topChild of Array.from(tpl.content.childNodes)) {
    sanitizeAndInterpolateNode(topChild);
  }
  return tpl.content;
}

/**
 * Angular component `DynamicComponent` (selector: `'dui-dynamic'`) supporting three rendering tiers:
 * 1) AOT `DuiDynamicCardSchema` (via `[schema]` or `{"type":"dui-card",...}` JSON string),
 * 2) AOT Safe Micro-Template (`<div>{{ data.title }}</div>`) without `@angular/compiler`,
 * 3) On-demand async `import('@angular/compiler')` + `ɵcompileComponent` for complex Angular templates (`*ngIf`, `*ngFor`, `[ngClass]`, custom components/pipes).
 * @zh Angular 动态渲染组件 `DynamicComponent`（`<dui-dynamic>`），保持现有 `@Input()` API 100% 向后兼容，
 * 支持 AOT 卡片 Schema、安全微模板零 JIT 渲染及复杂 Angular 模板按需异步加载 `@angular/compiler`。
 */
@Component({
  selector: 'dui-dynamic',
  templateUrl: './dynamic.component.html',
  styles: [
    `
      .dui-dynamic-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 8px;
        background: var(--dui-surface-container, var(--mat-sys-surface-container, #ffffff));
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #1d1b20));
        border: 1px solid var(--mat-sys-outline-variant, rgba(0, 0, 0, 0.12));
        box-sizing: border-box;
      }
      .dui-dynamic-card__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }
      .dui-dynamic-card__title {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.4;
      }
      .dui-dynamic-card__subtitle {
        font-size: 12px;
        opacity: 0.75;
        margin-top: 2px;
      }
      .dui-dynamic-card__badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 500;
        background: var(--mat-sys-secondary-container, #e8def8);
        color: var(--mat-sys-on-secondary-container, #1d192b);
      }
      .dui-dynamic-card__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 6px 12px;
      }
      .dui-dynamic-card__field {
        display: flex;
        flex-direction: column;
        font-size: 12px;
      }
      .dui-dynamic-card__label {
        opacity: 0.68;
      }
      .dui-dynamic-card__value {
        font-weight: 500;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DynamicComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Input property `tmpl` (`string`) configuring template HTML or `"dui-card"` JSON string.
   * @zh 输入属性 `tmpl`（类型：`string`），用于配置动态模板字符串或 `"dui-card"` JSON 描述串。
   */
  @Input()
  tmpl = '';

  /**
   * Optional alias input `html` (`string`) accepted interchangeably with `tmpl`.
   * @zh 可选别名输入属性 `html`（类型：`string`），当未传 `tmpl` 时作为模板或 JSON Schema 字符串来源。
   */
  @Input()
  html?: string;

  /**
   * Input property `data` (`unknown`) configuring template binding context.
   * @zh 输入属性 `data`（类型：`unknown`），用于配置模板插值与组件绑定数据上下文。
   */
  @Input()
  data: unknown;

  /**
   * Optional declarative AOT card schema (`DuiDynamicCardSchema`) rendered without JIT compiler.
   * @zh 可选声明式 AOT 卡片 Schema 输入（零 `ɵcompileComponent` 调用）。
   */
  @Input()
  schema?: DuiDynamicCardSchema;

  /**
   * Sanitized/normalized template string retained for backward compatibility.
   * @zh 保留向后兼容的模板字符串属性。
   */
  template = '';

  /**
   * Active rendering pipeline mode (`'idle' | 'schema' | 'micro-template' | 'jit'`).
   * @zh 当前选用的渲染管线模式（便于诊断与单测断言）。
   */
  renderMode: DuiDynamicRenderMode = 'idle';

  /**
   * Resolved AOT card view-model when `renderMode === 'schema'`.
   * @zh 当处于 `'schema'` AOT 模式时解析出的卡片视图模型。
   */
  resolvedCard: ResolvedDynamicCardView | null = null;

  /**
   * Host `ViewContainerRef` used only when mounting lazy-JIT Angular components.
   * @zh 宿主 `ViewContainerRef`，仅在复杂 Angular 模板按需 JIT 模式下用于创建动态组件。
   */
  viewRef: ViewContainerRef = inject(ViewContainerRef);

  /**
   * Container element for safe AOT Micro-Template DOM nodes.
   * @zh 安全微模板 AOT 渲染模式的内部挂载锚点元素。
   */
  @ViewChild('microHost', { static: true })
  microHostRef?: ElementRef<HTMLDivElement>;

  /**
   * Inner `ViewContainerRef` anchor for lazy-JIT components so rendered DOM resides inside `<dui-dynamic>`.
   * @zh 按需 JIT 模式下的内部视图容器锚点。
   */
  @ViewChild('jitHost', { read: ViewContainerRef, static: true })
  jitHostRef?: ViewContainerRef;

  private componentRef?: ComponentRef<DynamicJitInstance>;
  private _initialized = false;
  private _destroyed = false;
  private _renderSeq = 0;

  /**
   * Creates an instance of `DynamicComponent`.
   * @zh 创建 `DynamicComponent` 实例。
   * @param safeUrl - Safe URL/HTML pipe (`SafeurlPipe`) / 安全管道（`SafeurlPipe`）
   * @param detectChange - Change detector ref (`ChangeDetectorRef`) / 变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    private safeUrl: SafeurlPipe,
    public detectChange: ChangeDetectorRef,
  ) {}

  /**
   * Initializes and executes dynamic rendering based on `schema`, safe micro-template, or lazy JIT.
   * @zh 初始化并根据输入自动分流至 AOT Schema、安全微模板或按需异步 JIT 渲染。
   */
  ngOnInit(): void {
    this._initialized = true;
    void this._render();
  }

  /**
   * Re-renders whenever `schema`, `tmpl`, `html`, or `data` inputs change after initialization.
   * @zh 当输入属性 `schema`、`tmpl`、`html` 或 `data` 发生变更时重新渲染。
   * @param changes - Changed input map (`SimpleChanges`) / 变更属性字典（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this._initialized) {
      return;
    }
    if (changes['schema'] || changes['tmpl'] || changes['html'] || changes['data']) {
      void this._render();
    }
  }

  /**
   * Releases any dynamically mounted component or micro-template DOM nodes on destruction.
   * @zh 组件销毁前释放动态编译组件实例与微模板 DOM 节点。
   */
  ngOnDestroy(): void {
    this._destroyed = true;
    this._renderSeq++;
    this._clearMountedOutputs();
  }

  /**
   * Lazily imports `@angular/compiler` on demand before invoking `ɵcompileComponent`.
   * Exposed as an instance method so tests and subclasses can observe lazy compiler loading.
   * @zh 按需异步加载 `@angular/compiler`，使简单卡片与微模板场景彻底免除编译器常驻体积。
   * @returns Promise resolving once `@angular/compiler` is loaded / 编译器模块加载 Promise
   */
  public async ensureJitCompilerLoaded(): Promise<unknown> {
    const compilerMod: unknown = await import('@angular/compiler');
    return compilerMod;
  }

  private async _render(): Promise<void> {
    const seq = ++this._renderSeq;
    this._clearMountedOutputs();

    const rawSource: string =
      typeof this.tmpl === 'string' && this.tmpl.length > 0
        ? this.tmpl
        : typeof this.html === 'string'
          ? this.html
          : '';

    const activeSchema: DuiDynamicCardSchema | null =
      this.schema ?? (rawSource ? tryParseCardSchemaJson(rawSource) : null);

    if (activeSchema) {
      this.template = rawSource;
      this.renderMode = 'schema';
      this.resolvedCard = this._resolveCardSchema(activeSchema, this.data);
      this.detectChange.markForCheck();
      return;
    }

    if (!rawSource) {
      this.template = '';
      this.renderMode = 'idle';
      this.detectChange.markForCheck();
      return;
    }

    const safe = this.safeUrl.transform(rawSource, 'html') as {
      changingThisBreaksApplicationSecurity?: string;
    };
    const extractedTemplate: string =
      typeof safe?.changingThisBreaksApplicationSecurity === 'string'
        ? safe.changingThisBreaksApplicationSecurity
        : rawSource;
    this.template = extractedTemplate;

    if (isSafeMicroTemplate(extractedTemplate)) {
      this.renderMode = 'micro-template';
      const hostEl = this.microHostRef?.nativeElement;
      if (hostEl) {
        const fragment = renderSafeMicroTemplateFragment(extractedTemplate, this.data);
        hostEl.appendChild(fragment);
      }
      this.detectChange.markForCheck();
      return;
    }

    this.renderMode = 'jit';
    await this.ensureJitCompilerLoaded();
    if (this._destroyed || seq !== this._renderSeq) {
      return;
    }

    const componentType = getComponentFromTemplate(this.template);
    const targetContainer = this.jitHostRef ?? this.viewRef;
    this.componentRef = targetContainer.createComponent(componentType);
    this.componentRef.setInput('data', this.data);
    // 生产构建（ngDevMode=false）不跑 ɵsetClassMetadata，@Input 元数据没了；setInput 静默落空 —— 再直接赋一次
    this.componentRef.instance.data = this.data;
    this.componentRef.changeDetectorRef.detectChanges();
    this.detectChange.markForCheck();
  }

  private _resolveCardSchema(
    schema: DuiDynamicCardSchema,
    data: unknown,
  ): ResolvedDynamicCardView {
    const title =
      schema.title !== undefined
        ? interpolateTextWithData(schema.title, data)
        : schema.titleField
          ? formatInterpolatedValue(readDynamicSafePath(data, schema.titleField))
          : '';
    const subtitle =
      schema.subtitle !== undefined
        ? interpolateTextWithData(schema.subtitle, data)
        : schema.subtitleField
          ? formatInterpolatedValue(readDynamicSafePath(data, schema.subtitleField))
          : '';
    const status =
      schema.status !== undefined
        ? interpolateTextWithData(schema.status, data)
        : schema.statusField
          ? formatInterpolatedValue(readDynamicSafePath(data, schema.statusField))
          : '';
    const statusTone: DuiDynamicCardTone = schema.statusTone ?? 'default';
    const fields: Array<{ readonly label: string; readonly value: string }> = (
      schema.fields ?? []
    ).map((field: DuiDynamicCardField): { readonly label: string; readonly value: string } => {
      let resolvedValue = '';
      if (field.value !== undefined) {
        resolvedValue =
          typeof field.value === 'string'
            ? interpolateTextWithData(field.value, data)
            : formatInterpolatedValue(field.value);
      } else {
        resolvedValue = formatInterpolatedValue(readDynamicSafePath(data, field.key));
      }
      return {
        label: field.label,
        value: resolvedValue,
      };
    });

    return {
      title,
      subtitle,
      status,
      statusTone,
      fields,
    };
  }

  private _clearMountedOutputs(): void {
    this.resolvedCard = null;
    if (this.microHostRef?.nativeElement) {
      this.microHostRef.nativeElement.innerHTML = '';
    }
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}

/**
 * Dynamically compiles a runtime Angular component for complex template syntax after `@angular/compiler` is loaded.
 * @zh 在 `@angular/compiler` 加载完成后，为包含复杂 Angular 语法的模板动态编译组件类。
 * @param template - Angular template string (`string`) / Angular 模板字符串（`string`）
 * @returns Compiled Angular component type (`Type<DynamicJitInstance>`) / 编译后的组件类型
 */
function getComponentFromTemplate(template: string): Type<DynamicJitInstance> {
  @Component({
    template: '',
    standalone: false,
  })
  class CustomComponent implements DynamicJitInstance {
    /**
     * Input property `data` (`unknown`) configuring template binding context.
     * @zh 输入属性 `data`（类型：`unknown`），用于配置数据上下文。
     */
    @Input() data: unknown = undefined;
  }

  // inputs 要显式写：@Input() 装饰器的元数据只在开发模式下由 ɵsetClassMetadata 补上，生产构建里运行时编译的组件
  // 没有 data 输入，模板里 {{data.x}} 全是空（2026-10-22：平台看板卡片在生产构建里一片空白）
  ɵcompileComponent(CustomComponent, {
    template,
    standalone: true,
    imports: [CommonModule],
    inputs: ['data'],
  });
  return CustomComponent;
}
