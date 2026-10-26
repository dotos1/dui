/**
 * @fileoverview Module `src/ux/windows/utils/directives/fixed-to-parent.directive.ts` providing fixed to parent directive definitions and implementation.
 * @zh 模块文件 `src/ux/windows/utils/directives/fixed-to-parent.directive.ts`，提供固定转换为父级指令相关的定义与实现。
 */

import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit
} from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ɵEventOutside } from '../../core/helpers/event-outside.helper';
import { ɵIntervalCheckerHelper } from '../../core/helpers/interval-checker.helper';
import { ɵGlobalEvents } from '../../core/services/global-events.service';

import { FixedToParentConfig } from '../classes';

/**
 * Adapts the position of the element to the position of the parent element.
 *
 * Useful when used with the {@link AppendToBodyDirective}.
 *
 * The child element will be appended to the body and "save" position near the parent element
 * as if it continues to be inside the parent element.
 *
 * @zh Angular 指令 `FixedToParentDirective`（selector: '[osFixedToParent]'），为宿主 DOM 元素附加固定转换为父级指令行为。
 */
@Directive({
    selector: '[osFixedToParent]'
})
export class FixedToParentDirective implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    /**
     * Configuration of directive
     * @zh 输入属性 `osFixedToParent`（类型：`FixedToParentConfig | undefined | ''`），用于配置参数列表。
     */
    @Input('osFixedToParent')
    public parameters: FixedToParentConfig | undefined | '';

    /**
     * Configuration of directive
     * @zh 获取当前配置（`config: FixedToParentConfig`）。
     */
    public get config(): FixedToParentConfig {
        return this._config;
    }

    /**
     * Property `_config` (`FixedToParentConfig`) storing config (default: `new FixedToParentConfig()`).
     * @zh 属性 `_config`（类型：`FixedToParentConfig`），用于存储或配置配置（默认值：`new FixedToParentConfig()`）。
     */
    private _config = new FixedToParentConfig();
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
     * Property `intervalChecker` (`ɵIntervalCheckerHelper`) storing interval checker (default: `new ɵIntervalCheckerHelper()`).
     * @zh 属性 `intervalChecker`（类型：`ɵIntervalCheckerHelper`），用于存储或配置间隔定时器检查器（默认值：`new ɵIntervalCheckerHelper()`）。
     */
    private readonly intervalChecker = new ɵIntervalCheckerHelper();
    /**
     * Property `destroyed$` (`Subject`) storing destroyed (default: `new Subject<boolean>()`).
     * @zh 属性 `destroyed$`（类型：`Subject`），用于存储或配置已销毁（默认值：`new Subject<boolean>()`）。
     */
    private readonly destroyed$ = new Subject<boolean>();
    /**
     * Property `isEnabled$` (`BehaviorSubject`) storing is enabled (default: `new BehaviorSubject<boolean>(true)`).
     * @zh 属性 `isEnabled$`（类型：`BehaviorSubject`），用于存储或配置是否为已启用（默认值：`new BehaviorSubject<boolean>(true)`）。
     */
    private readonly isEnabled$ = new BehaviorSubject<boolean>(true);

    /**
     * Gets the current destroyed or disabled (`destroyedOrDisabled$: Observable<boolean>`).
     * @zh 获取当前已销毁Or已禁用（`destroyedOrDisabled$: Observable<boolean>`）。
     */
    private get destroyedOrDisabled$(): Observable<boolean> {
        return merge(
            this.destroyed$,
            this.isEnabled$
                .pipe(filter((isEnabled) => !isEnabled))
        );
    }

    /**
     * Creates an instance of `FixedToParentDirective` and initializes its dependencies and internal state.
     * @zh 创建 `FixedToParentDirective` 实例，并初始化其依赖项与内部状态。
     * @param hostRef - Injected or initial host ref (`ElementRef<HTMLElement>`) / 注入或传入的宿主引用（`ElementRef<HTMLElement>`）
     * @param globalEvents - Injected or initial global events (`ɵGlobalEvents`) / 注入或传入的全局事件集合（`ɵGlobalEvents`）
     */
    constructor(
        private readonly hostRef: ElementRef<HTMLElement>,
        private readonly globalEvents: ɵGlobalEvents
    ) {}

    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     */
    public ngOnChanges(): void {
        this._config = { ...this._config, ...this.parameters };

        this.isEnabled$.next(this._config.isEnabled);
        this.updateIntervalCheckerSettings();
    }

    /**
     * Angular lifecycle hook invoked once after component or directive inputs are initialized.
     * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
     */
    public ngOnInit(): void {
        this.initDocumentWheelObserver();
    }

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public ngAfterViewInit(): void {
        this.targetElement = this.hostRef.nativeElement;
        this.parentElement = this.targetElement.parentElement;

        this.adjustCoordinates();
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public ngOnDestroy(): void {
        this.intervalChecker.reset();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Executes `initDocumentWheelObserver` to handle init document wheel observer.
     * @internal
     * @zh 执行 `initDocumentWheelObserver`，用于初始化文档对象滚轮观察者。
     */
    private initDocumentWheelObserver(): void {
        this.globalEvents.fromDocument('wheel')
            .pipe(
                filter((event) => ɵEventOutside.checkForElement(this.targetElement, event)),
                takeUntil(this.destroyedOrDisabled$)
            )
            .subscribe(() => {
                this.intervalChecker.start({
                    onIteration: () => this.adjustCoordinates()
                });
            });
    }

    /**
     * Executes `adjustCoordinates` to handle adjust coordinates.
     * @zh 执行 `adjustCoordinates`，用于adjust坐标。
     */
    private adjustCoordinates(): void {
        if (this._config.isEnabled) {
            const { left, top, width, height } = this.parentElement.getBoundingClientRect();

            this.targetElement.style.left = `${left}px`;
            this.targetElement.style.top = `${(top + height)}px`;
            this.targetElement.style.width = `${width}px`;
        }
    }

    /**
     * Executes `updateIntervalCheckerSettings` to handle update interval checker settings.
     * @zh 执行 `updateIntervalCheckerSettings`，用于更新间隔定时器检查器设置项。
     */
    private updateIntervalCheckerSettings(): void {
        this.intervalChecker.updateSettings({
            delayBetweenChecksInMs: this._config.recalculationIntervalInMs,
            maxCheckCount: this._config.calculationIterationsCount
        });
    }
}
