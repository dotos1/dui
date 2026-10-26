/**
 * @fileoverview Module `src/ux/windows/utils/directives/append-to-body.directive.ts` providing append to body directive definitions and implementation.
 * @zh 模块文件 `src/ux/windows/utils/directives/append-to-body.directive.ts`，提供追加转换为主体指令相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy
} from '@angular/core';
import { AppendToBodyConfig } from '../classes';

/**
 * Moves element into the `body` element *
 * @zh Angular 指令 `AppendToBodyDirective`（selector: '[osAppendToBody]'），为宿主 DOM 元素附加追加转换为主体指令行为。
 */
@Directive({
    selector: '[osAppendToBody]'
})
export class AppendToBodyDirective implements AfterViewInit, OnDestroy, OnChanges {
    /**
     * Configuration of directive
     * @zh 输入属性 `osAppendToBody`（类型：`AppendToBodyConfig | undefined | ''`），用于配置参数列表。
     */
    @Input('osAppendToBody')
    public parameters: AppendToBodyConfig | undefined | '';

    /**
     * Configuration of directive
     * @zh 获取当前配置（`config: AppendToBodyConfig`）。
     */
    public get config(): AppendToBodyConfig {
        return this._config;
    }

    /**
     * Property `targetElement` (`HTMLElement`) storing target element.
     * @zh 属性 `targetElement`（类型：`HTMLElement`），用于存储或配置目标元素。
     */
    private targetElement: HTMLElement;
    /**
     * Property `parentElement` (`HTMLElement`) storing parent element.
     * @zh 属性 `parentElement`（类型：`HTMLElement`），用于存储或配置父级元素。
     */
    private parentElement: HTMLElement;
    /**
     * Property `initialStylePosition` (`string`) storing initial style position.
     * @zh 属性 `initialStylePosition`（类型：`string`），用于存储或配置初始样式位置。
     */
    private initialStylePosition: string;

    /**
     * Property `_config` (`AppendToBodyConfig`) storing config (default: `new AppendToBodyConfig()`).
     * @zh 属性 `_config`（类型：`AppendToBodyConfig`），用于存储或配置配置（默认值：`new AppendToBodyConfig()`）。
     */
    private _config = new AppendToBodyConfig();

    /**
     * Creates an instance of `AppendToBodyDirective` and initializes its dependencies and internal state.
     * @zh 创建 `AppendToBodyDirective` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
     * @param hostRef - Injected or initial host ref (`ElementRef<HTMLElement>`) / 注入或传入的宿主引用（`ElementRef<HTMLElement>`）
     */
    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly hostRef: ElementRef<HTMLElement>
    ) {}

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public ngAfterViewInit(): void {
        this.targetElement = this.hostRef.nativeElement;
        this.parentElement = this.targetElement.parentElement;

        // When used in pair with `FixedToParentDirective`,
        // this solves the problem of incorrect determining of
        // the parent element by `FixedToParentDirective`.
        queueMicrotask(() => this.processElement());
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public ngOnDestroy(): void {
        this.hostRef?.nativeElement?.remove();
    }

    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     */
    public ngOnChanges(): void {
        this._config = { ...this._config, ...this.parameters };

        if (this.targetElement) {
            this.processElement();
        }
    }

    /**
     * Executes `processElement` to handle process element.
     * @zh 执行 `processElement`，用于处理元素。
     */
    private processElement(): void {
        if (this._config.isEnabled) {
            this.applyNeededStyles();
            this.appendElementToBody();
        } else {
            this.resetAppliedNeededStyles();
            this.appendElementToParent();
        }
    }

    /**
     * Executes `applyNeededStyles` to handle apply needed styles.
     * @zh 执行 `applyNeededStyles`，用于应用Needed样式集合。
     */
    private applyNeededStyles(): void {
        this.initialStylePosition = this.targetElement.style.position;
        this.targetElement.style.position = 'absolute';
    }

    /**
     * Executes `appendElementToBody` to handle append element to body.
     * @zh 执行 `appendElementToBody`，用于追加元素转换为主体。
     */
    private appendElementToBody(): void {
        this.parentElement.removeChild(this.targetElement);
        this.document.body.appendChild(this.targetElement);
    }

    /**
     * Executes `appendElementToParent` to handle append element to parent.
     * @zh 执行 `appendElementToParent`，用于追加元素转换为父级。
     */
    private appendElementToParent(): void {
        try {
            this.document.body?.removeChild?.(this.targetElement);
            this.parentElement?.appendChild?.(this.targetElement);
        } catch (error) {}
    }

    /**
     * Executes `resetAppliedNeededStyles` to handle reset applied needed styles.
     * @zh 执行 `resetAppliedNeededStyles`，用于重置AppliedNeeded样式集合。
     */
    private resetAppliedNeededStyles(): void {
        if (this.initialStylePosition) {
            this.targetElement.style.position = this.initialStylePosition;
        }
    }
}
