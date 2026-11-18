/**
 * @fileoverview Module `src/core/dynamic/dynamic.component.ts` providing dynamic component definitions and implementation.
 * @zh 模块文件 `src/core/dynamic/dynamic.component.ts`，提供动态组件相关的定义与实现。
 */

import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  KeyValuePipe,
  LowerCasePipe,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
  PercentPipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
  ViewContainerRef,
  ViewEncapsulation,
  ɵcompileComponent,
} from '@angular/core';
import { SafeurlPipe } from './safeurl.pipe';

/**
 * Constant `DYNAMIC_COMMON_IMPORTS` (`readonly Type<unknown>[]`) listing standalone Angular common directives and pipes preserved under `ngJitMode=false` production builds.
 * @zh 常量 `DYNAMIC_COMMON_IMPORTS`（类型：`readonly Type<unknown>[]`），提供在 `ngJitMode=false` 生产构建下元数据依然完整的 `@angular/common` 独立指令与管道列表。
 */
const DYNAMIC_COMMON_IMPORTS: ReadonlyArray<Type<unknown>> = [
  NgIf,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgClass,
  NgStyle,
  NgTemplateOutlet,
  AsyncPipe,
  JsonPipe,
  DatePipe,
  DecimalPipe,
  PercentPipe,
  CurrencyPipe,
  SlicePipe,
  UpperCasePipe,
  LowerCasePipe,
  TitleCasePipe,
  KeyValuePipe,
];

/**
 * Angular component `DynamicComponent` (selector: 'dui-dynamic') providing dynamic component presentation and interaction in `src/core/dynamic`.
 * @zh Angular 组件 `DynamicComponent`（selector: 'dui-dynamic'），提供动态组件的视图渲染与交互逻辑（位于 `src/core/dynamic`）。
 */
@Component({
  selector: 'dui-dynamic',
  templateUrl: './dynamic.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DynamicComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Input property `tmpl` (`string`) configuring tmpl.
   * @zh 输入属性 `tmpl`（类型：`string`），用于配置模板字符串。
   */
  @Input()
  tmpl: string = '';

  /**
   * Input property `data` (`any`) configuring data.
   * @zh 输入属性 `data`（类型：`any`），用于配置数据。
   */
  @Input()
  data;

  /**
   * Input property `extraImports` (`readonly Type<unknown>[]`) configuring extra imports (default: `[]`).
   * @zh 输入属性 `extraImports`（类型：`readonly Type<unknown>[]`），用于配置动态模板额外导入的独立组件、指令、管道或模块列表（默认值：`[]`）。
   */
  @Input()
  extraImports: ReadonlyArray<Type<unknown>> = [];

  /**
   * Property `template` (`string`) storing template.
   * @zh 属性 `template`（类型：`string`），用于存储或配置已清洗的模板字符串。
   */
  template: string = '';

  /**
   * Property `viewRef` (`ViewContainerRef`) storing view ref (default: `inject(ViewContainerRef)`).
   * @zh 属性 `viewRef`（类型：`ViewContainerRef`），用于存储或配置视图引用（默认值：`inject(ViewContainerRef)`）。
   */
  viewRef: ViewContainerRef = inject(ViewContainerRef);

  /**
   * Property `componentRef` (`ComponentRef<{ data: unknown; }>`) storing component ref.
   * @zh 属性 `componentRef`（类型：`ComponentRef<{ data: unknown; }>`），用于存储或配置动态组件实例引用。
   */
  private componentRef?: ComponentRef<{ data: unknown }>;

  /**
   * Property `initialized` (`boolean`) storing initialized state (default: `false`).
   * @zh 属性 `initialized`（类型：`boolean`），用于存储或配置组件是否已完成首次初始化（默认值：`false`）。
   */
  private initialized: boolean = false;

  /**
   * Creates an instance of `DynamicComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DynamicComponent` 实例，并初始化其依赖项与内部状态。
   * @param safeUrl - Injected or initial safe url (`SafeurlPipe`) / 注入或传入的安全链接地址（`SafeurlPipe`）
   * @param detectChange - Injected or initial detect change (`ChangeDetectorRef`) / 注入或传入的检测变更（`ChangeDetectorRef`）
   */
  constructor(
    private safeUrl: SafeurlPipe,
    public detectChange: ChangeDetectorRef
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.initialized = true;
    this.mountDynamicComponent();
  }

  /**
   * Angular lifecycle hook invoked when one or more data-bound input properties change.
   * @zh Angular 生命周期钩子：当一个或多个数据绑定输入属性发生变化时调用。
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      return;
    }
    if (changes['tmpl'] || changes['extraImports']) {
      this.mountDynamicComponent();
      return;
    }
    if (changes['data'] && this.componentRef) {
      this.componentRef.setInput('data', this.data);
      this.componentRef.instance.data = this.data;
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }

  /**
   * Compiles and mounts the dynamic component into `viewRef` using the current `tmpl`, `extraImports`, and `data`.
   * @zh 使用当前的 `tmpl`、`extraImports` 与 `data` 编译并将动态组件挂载至 `viewRef`。
   */
  private mountDynamicComponent(): void {
    const safe = this.safeUrl.transform(this.tmpl ?? '', 'html') as {
      changingThisBreaksApplicationSecurity?: string;
    };
    this.template = safe.changingThisBreaksApplicationSecurity ?? '';
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
    const component = getComponentFromTemplate(this.template, this.extraImports);
    this.componentRef = this.viewRef.createComponent(component);
    this.componentRef.setInput('data', this.data);
    // 生产构建（ngDevMode=false）不跑 ɵsetClassMetadata，@Input 元数据没了；setInput 静默落空 —— 再直接赋一次
    this.componentRef.instance.data = this.data;
  }
}

/**
 * Executes `getComponentFromTemplate` to compile an ad-hoc standalone component for `template` and `extraImports`.
 * @zh 执行 `getComponentFromTemplate`，根据模板字符串与额外导入项动态编译组件类型。
 * @param template - template parameter (`string`) / 模板参数（`string`）
 * @param extraImports - extraImports parameter (`readonly Type<unknown>[]`) / 额外导入列表参数（`readonly Type<unknown>[]`）
 * @returns Result of type `Type<{ data: unknown; }>` / 类型为 `Type<{ data: unknown; }>` 的返回值
 */
function getComponentFromTemplate(
  template: string,
  extraImports: ReadonlyArray<Type<unknown>> = []
): Type<{ data: unknown }> {
  @Component({
    template: '',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default,
  })
  class CustomComponent {
    /**
     * Input property `data` (`unknown`) configuring data (default: `{}`).
     * @zh 输入属性 `data`（类型：`unknown`），用于配置上下文数据（默认值：`{}`）。
     */
    @Input() data: unknown = {};
  }

  const mergedImports: Type<unknown>[] = [
    ...DYNAMIC_COMMON_IMPORTS,
    ...(extraImports ?? []).filter((item): item is Type<unknown> => Boolean(item)),
  ];

  // inputs 要显式写：@Input() 装饰器的元数据只在开发模式下由 ɵsetClassMetadata 补上，生产构建里运行时编译的组件
  // 没有 data 输入，模板里 {{data.x}} 全是空（2026-10-22：平台看板卡片在生产构建里一片空白）
  ɵcompileComponent(CustomComponent, {
    template,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: mergedImports,
    inputs: ['data'],
  });
  return CustomComponent;
}
