/**
 * @fileoverview Module `src/ux/windows/scroll-view/components/scroll-view/scroll-view.component.ts` providing scroll view component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/scroll-view/components/scroll-view/scroll-view.component.ts`，提供滚动视图组件相关的定义与实现。
 */

import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Injector,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';

/**
 * Angular component `ScrollViewComponent` (selector: 'dui-scroll-view') providing scroll view component presentation and interaction in `src/ux/windows/scroll-view/components/scroll-view`.
 * @zh Angular 组件 `ScrollViewComponent`（selector: 'dui-scroll-view'），提供滚动视图组件的视图渲染与交互逻辑（位于 `src/ux/windows/scroll-view/components/scroll-view`）。
 */
@Component({
    selector: 'dui-scroll-view',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-scroll-view'
    },
    styleUrls: ['./scroll-view.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ScrollViewComponent extends ɵOsBaseComponent {
    /**
     * Is vertical scroll enabled?
     * @zh 输入属性 `isVerticalScrollEnabled`（类型：`boolean`），用于配置是否为垂直滚动已启用（默认值：`true`）。
     */
    @Input()
    public isVerticalScrollEnabled: boolean = true;

    /**
     * Is horizontal scroll enabled?
     * @zh 输入属性 `isHorizontalScrollEnabled`（类型：`boolean`），用于配置是否为水平滚动已启用（默认值：`false`）。
     */
    @Input()
    public isHorizontalScrollEnabled: boolean = false;

    /**
     * Does the vertical scroll hide when it is not needed?
     * @zh 输入属性 `isVerticalScrollHiding`（类型：`boolean`），用于配置是否为垂直滚动隐藏（默认值：`false`）。
     */
    @Input()
    public isVerticalScrollHiding: boolean = false;

    /**
     * Does the horizontal scroll hide when it is not needed?
     * @zh 输入属性 `isHorizontalScrollHiding`（类型：`boolean`），用于配置是否为水平滚动隐藏（默认值：`false`）。
     */
    @Input()
    public isHorizontalScrollHiding: boolean = false;

    /**
     * Host-bound getter `_hostOverflowX` (`string`) computing host overflow x.
     * @zh 宿主绑定读取器 `_hostOverflowX`（绑定至 `style.overflow-x`），计算并返回宿主OverflowX坐标。
     */
    @HostBinding('style.overflow-x')
    public get _hostOverflowX(): string {
        if (!this.isHorizontalScrollHiding) {
            return (this.isHorizontalScrollEnabled) ? 'auto' : 'hidden';
        }
        return (this.isHorizontalScrollEnabled) ? 'scroll' : 'hidden';
    }

    /**
     * Host-bound getter `_hostOverflowY` (`string`) computing host overflow y.
     * @zh 宿主绑定读取器 `_hostOverflowY`（绑定至 `style.overflow-y`），计算并返回宿主OverflowY坐标。
     */
    @HostBinding('style.overflow-y')
    public get _hostOverflowY(): string {
        if (!this.isVerticalScrollHiding) {
            return (this.isVerticalScrollEnabled) ? 'auto' : 'hidden';
        }
        return (this.isVerticalScrollEnabled) ? 'scroll' : 'hidden';
    }

    /**
     * Creates an instance of `ScrollViewComponent` and initializes its dependencies and internal state.
     * @zh 创建 `ScrollViewComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    /**
     * Executes `scrollTo` to handle scroll to.
     * @zh 执行 `scrollTo`，用于滚动转换为。
     * @param left - left parameter (`number`) / 左侧位置参数（`number`）
     * @param top - top parameter (`number`) / 顶部位置参数（`number`）
     */
    public scrollTo(left: number, top: number): void {
        this.hostRef.nativeElement.scrollTo({ left, top });
    }
}
