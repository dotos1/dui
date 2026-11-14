/**
 * @fileoverview Module `src/ux/windows/core/classes/base-components/component.ts` providing component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/classes/base-components/component.ts`，提供组件相关的定义与实现。
 */


import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Injector,
    Input,
    Output
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { filter, share, switchMap } from 'rxjs/operators';
import { ɵOsBaseViewComponent } from './view';

/**
 * Angular component `ɵOsBaseComponent` providing ɵos base component presentation and interaction in `src/ux/windows/core/classes/base-components`.
 * @zh Angular 组件 `ɵOsBaseComponent`，提供ɵOs基础组件的视图渲染与交互逻辑（位于 `src/ux/windows/core/classes/base-components`）。
 */
@Component({
    template: '',
    host: {
        class: 'dui-element'
    },
    standalone: false
})
export abstract class ɵOsBaseComponent
    extends ɵOsBaseViewComponent
    implements AfterViewInit {
    /**
     * Property `_targetInternalElement$` (`BehaviorSubject<HTMLElement>`) storing target internal element (default: `new BehaviorSubject<HTMLElement>(null)`).
     * @zh 属性 `_targetInternalElement$`（类型：`BehaviorSubject<HTMLElement>`），用于存储或配置目标内部元素（默认值：`new BehaviorSubject<HTMLElement>(null)`）。
     */
    private _targetInternalElement$ = new BehaviorSubject<HTMLElement>(null);

    /**
     * Target internal element stylelist
     * @zh 输入属性 `style`（类型：`object`），用于配置样式。
     */
    @Input()
    @HostBinding('style')
    public style: object;

    /**
     * Target internal element classList
     * @zh 输入属性 `styleClass`（类型：`string | object | string[]`），用于配置样式类名。
     */
    @Input()
    @HostBinding('class')
    public styleClass: string | string[] | object;

    /**
     * Target internal element id
     * @zh 输入属性 `id`（类型：`string`），用于配置唯一标识。
     */
    @Input()
    @HostBinding('attr.id')
    public id: string;

    /**
     * Target internal element click event
     * @zh 输出事件 `osClick`（类型：`Observable<PointerEvent>`），当触发os点击时向外发出事件。
     */
    @Output()
    public osClick: Observable<PointerEvent> = this.createEvent('click');

    /**
     * Target internal element dblclick event
     * @zh 输出事件 `osDblClick`（类型：`Observable<PointerEvent>`），当触发osDbl点击时向外发出事件。
     */
    @Output()
    public osDblClick: Observable<PointerEvent> = this.createEvent('dblclick');

    /**
     * Target internal element mousedown event
     * @zh 输出事件 `osMouseDown`（类型：`Observable<PointerEvent>`），当触发os鼠标向下时向外发出事件。
     */
    @Output()
    public osMouseDown: Observable<PointerEvent> = this.createEvent('mousedown');

    /**
     * Target internal element mouseup event
     * @zh 输出事件 `osMouseUp`（类型：`Observable<PointerEvent>`），当触发os鼠标向上时向外发出事件。
     */
    @Output()
    public osMouseUp: Observable<PointerEvent> = this.createEvent('mouseup');

    /**
     * Target internal element mousemove event
     * @zh 输出事件 `osMouseMove`（类型：`Observable<PointerEvent>`），当触发os鼠标移动时向外发出事件。
     */
    @Output()
    public osMouseMove: Observable<PointerEvent> = this.createEvent('mousemove');

    /**
     * Target internal element mouseout event
     * @zh 输出事件 `osMouseOut`（类型：`Observable<PointerEvent>`），当触发os鼠标输出时向外发出事件。
     */
    @Output()
    public osMouseOut: Observable<PointerEvent> = this.createEvent('mouseout');

    /**
     * Target internal element mouseover event
     * @zh 输出事件 `osMouseOver`（类型：`Observable<PointerEvent>`），当触发os鼠标越过时向外发出事件。
     */
    @Output()
    public osMouseOver: Observable<PointerEvent> = this.createEvent('mouseover');

    /**
     * Target internal element wheel event
     * @zh 输出事件 `osWheel`（类型：`Observable<WheelEvent>`），当触发os滚轮时向外发出事件。
     */
    @Output()
    public osWheel: Observable<WheelEvent> = this.createEvent('wheel');

    /**
     * Target internal element keydown event
     * @zh 输出事件 `osKeyDown`（类型：`Observable<KeyboardEvent>`），当触发os键向下时向外发出事件。
     */
    @Output()
    public osKeyDown: Observable<KeyboardEvent> = this.createEvent('keydown');

    /**
     * Target internal element keyup event
     * @zh 输出事件 `osKeyUp`（类型：`Observable<KeyboardEvent>`），当触发os键向上时向外发出事件。
     */
    @Output()
    public osKeyUp: Observable<KeyboardEvent> = this.createEvent('keyup');

    /**
     * Gets the current target internal element (`targetInternalElement: HTMLElement`).
     * @zh 获取当前目标内部元素（`targetInternalElement: HTMLElement`）。
     */
    protected get targetInternalElement(): HTMLElement {
        return this._targetInternalElement$.getValue();
    }

    /**
     * Gets the current target internal element (`targetInternalElement$: Observable<HTMLElement>`).
     * @zh 获取当前目标内部元素（`targetInternalElement$: Observable<HTMLElement>`）。
     */
    protected get targetInternalElement$(): Observable<HTMLElement> {
        return this._targetInternalElement$.asObservable();
    }


    /**
     * Property `targetInternalElementSelector` (`string`) storing target internal element selector.
     * @zh 属性 `targetInternalElementSelector`（类型：`string`），用于存储或配置目标内部元素选择器。
     */
    protected readonly targetInternalElementSelector: string;
    /**
     * Property `hostRef` (`ElementRef<HTMLElement>`) storing host ref.
     * @zh 属性 `hostRef`（类型：`ElementRef<HTMLElement>`），用于存储或配置宿主引用。
     */
    protected readonly hostRef: ElementRef<HTMLElement>;
    /**
     * Property `changeDetector` (`ChangeDetectorRef`) storing change detector.
     * @zh 属性 `changeDetector`（类型：`ChangeDetectorRef`），用于存储或配置变更检测器。
     */
    protected readonly changeDetector: ChangeDetectorRef;

    /**
     * Creates an instance of `ɵOsBaseComponent` and initializes its dependencies and internal state.
     * @zh 创建 `ɵOsBaseComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super();

        this.hostRef = injector.get(ElementRef);
        this.changeDetector = injector.get(ChangeDetectorRef);
    }

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public override ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.initTargetInternalElement();
    }

    /**
     * Executes `createEvent` to handle create event.
     * @zh 执行 `createEvent`，用于创建事件。
     * @param eventName - event name parameter (`keyof HTMLElementEventMap`) / 事件名称参数（`keyof HTMLElementEventMap`）
     * @returns Result of type `Observable<T>` / 类型为 `Observable<T>` 的返回值
     */
    protected createEvent<T = Event>(eventName: keyof HTMLElementEventMap): Observable<T> {
        return this.targetInternalElement$
            .pipe(
                filter((element) => !!element),
                switchMap((element) => fromEvent<T>(element, eventName as string)),
                share()
            );
    }

    /**
     * Executes `initTargetInternalElement` to handle init target internal element.
     * @zh 执行 `initTargetInternalElement`，用于初始化目标内部元素。
     */
    private initTargetInternalElement(): void {
        const hostElement = this.hostRef.nativeElement;
        const selector = this.targetInternalElementSelector;
        const element = (selector) ? hostElement.querySelector<HTMLElement>(selector) : hostElement;
        this._targetInternalElement$.next(element);
    }
}
