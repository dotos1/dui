/**
 * @fileoverview Module `src/container/dock-layout/virtual-layout.ts` providing virtual layout definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/virtual-layout.ts`，提供虚拟滚动布局相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { LayoutConfig } from './config/config';
import { ResolvedComponentItemConfig, ResolvedLayoutConfig, ResolvedPopoutLayoutConfig } from './config/resolved-config';
import { ComponentContainer } from './container/component-container';
import { BindError } from './errors/external-error';
import { UnexpectedUndefinedError } from './errors/internal-error';
import { LayoutManager } from './layout-manager';
import { DomConstants } from './utils/dom-constants';


/**
 * Class `VirtualLayout` encapsulating virtual layout data structures and logic in `src/container/dock-layout`.
 * @public
 * @zh 类 `VirtualLayout`，封装 `src/container/dock-layout` 中的虚拟滚动布局数据结构与处理逻辑。
 */
export class VirtualLayout extends LayoutManager {

    /**
     * Property `getComponentEvent` (`VirtualLayout.GetComponentEventHandler | undefined`) storing get component event.
     * @zh 属性 `getComponentEvent`（类型：`VirtualLayout.GetComponentEventHandler | undefined`），用于存储或配置获取组件事件。
     */
    getComponentEvent: VirtualLayout.GetComponentEventHandler | undefined;

    /**
     * Property `releaseComponentEvent` (`VirtualLayout.ReleaseComponentEventHandler | undefined`) storing release component event.
     * @zh 属性 `releaseComponentEvent`（类型：`VirtualLayout.ReleaseComponentEventHandler | undefined`），用于存储或配置release组件事件。
     */
    releaseComponentEvent: VirtualLayout.ReleaseComponentEventHandler | undefined;

    /**
     * Property `bindComponentEvent` (`VirtualLayout.BindComponentEventHandler | undefined`) storing bind component event.
     * @zh 属性 `bindComponentEvent`（类型：`VirtualLayout.BindComponentEventHandler | undefined`），用于存储或配置绑定组件事件。
     */
    bindComponentEvent: VirtualLayout.BindComponentEventHandler | undefined;
    /**
     * Property `unbindComponentEvent` (`VirtualLayout.UnbindComponentEventHandler | undefined`) storing unbind component event.
     * @zh 属性 `unbindComponentEvent`（类型：`VirtualLayout.UnbindComponentEventHandler | undefined`），用于存储或配置解绑组件事件。
     */
    unbindComponentEvent: VirtualLayout.UnbindComponentEventHandler | undefined;


    /**
     * Property `_bindComponentEventHanlderPassedInConstructor` (`boolean`) storing bind component event hanlder passed in constructor (default: `false`).
     * @zh 属性 `_bindComponentEventHanlderPassedInConstructor`（类型：`boolean`），用于存储或配置绑定组件事件Hanlder已传递在Constructor（默认值：`false`）。
     */
    private _bindComponentEventHanlderPassedInConstructor = false;

    /**
     * Property `_creationTimeoutPassed` (`boolean`) storing creation timeout passed (default: `false`).
     * @zh 属性 `_creationTimeoutPassed`（类型：`boolean`），用于存储或配置creation延时器已传递（默认值：`false`）。
     */
    private _creationTimeoutPassed = false; 

    /**
     * Creates an instance of `VirtualLayout` and initializes its dependencies and internal state.
     * @zh 创建 `VirtualLayout` 实例，并初始化其依赖项与内部状态。
     * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
     * @param container - Injected or initial container (`HTMLElement`) / 注入或传入的容器（`HTMLElement`）
     * @param bindComponentEventHandler - Injected or initial bind component event handler (`VirtualLayout.BindComponentEventHandler`) / 注入或传入的绑定组件事件处理器（`VirtualLayout.BindComponentEventHandler`）
     * @param unbindComponentEventHandler - Injected or initial unbind component event handler (`VirtualLayout.UnbindComponentEventHandler`) / 注入或传入的解绑组件事件处理器（`VirtualLayout.UnbindComponentEventHandler`）
     */
    constructor(
        translator:TranslateService,
        container?: HTMLElement,
        bindComponentEventHandler?: VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
    );
    /**
     * Creates an instance of `VirtualLayout` and initializes its dependencies and internal state.
     * @zh 创建 `VirtualLayout` 实例，并初始化其依赖项与内部状态。
     * @param translator - Injected or initial translator (`any`) / 注入或传入的翻译器（`any`）
     * @param config - Injected or initial config (`LayoutConfig`) / 注入或传入的配置（`LayoutConfig`）
     * @param container - Injected or initial container (`HTMLElement`) / 注入或传入的容器（`HTMLElement`）
     */
    constructor(translator,config: LayoutConfig, container?: HTMLElement);
    /**
     * Creates an instance of `VirtualLayout` and initializes its dependencies and internal state.
     * @zh 创建 `VirtualLayout` 实例，并初始化其依赖项与内部状态。
     * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
     * @param configOrOptionalContainer - Injected or initial config or optional container (`LayoutConfig | HTMLElement | undefined`) / 注入或传入的配置Or可选容器（`LayoutConfig | HTMLElement | undefined`）
     * @param containerOrBindComponentEventH... - Injected or initial container or bind component event h (`HTMLElement | VirtualLayout.BindComponentEventHandler | unde...`) / 注入或传入的容器Or绑定组件事件H（`HTMLElement | VirtualLayout.BindComponentEventHandler | unde...`）
     * @param unbindComponentEventHandler - Injected or initial unbind component event handler (`VirtualLayout.UnbindComponentEventHandler | undefined`) / 注入或传入的解绑组件事件处理器（`VirtualLayout.UnbindComponentEventHandler | undefined`）
     * @param skipInit - Injected or initial skip init (`true`) / 注入或传入的skip初始化（`true`）
     */
    constructor( translator:TranslateService,configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler: HTMLElement | VirtualLayout.BindComponentEventHandler | undefined,
        unbindComponentEventHandler: VirtualLayout.UnbindComponentEventHandler | undefined,
        skipInit: true,
    );
    /**
     * Creates an instance of `VirtualLayout` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `VirtualLayout` 实例，并初始化其依赖项与内部状态。
     */
    constructor( translator:TranslateService,configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler?: HTMLElement | VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
        skipInit?: true,
    ) {
        super(translator,VirtualLayout.createLayoutManagerConstructorParameters(configOrOptionalContainer, containerOrBindComponentEventHandler));

        if (containerOrBindComponentEventHandler !== undefined) {
            if (typeof containerOrBindComponentEventHandler === 'function') {
                this.bindComponentEvent = containerOrBindComponentEventHandler;
                this._bindComponentEventHanlderPassedInConstructor = true;

                if (unbindComponentEventHandler !== undefined) {
                    this.unbindComponentEvent = unbindComponentEventHandler;
                }
            }
        }

        if (!this._bindComponentEventHanlderPassedInConstructor) {
            // backward compatibility

            if (this.isSubWindow) {
                if (this._constructorOrSubWindowLayoutConfig === undefined) {
                    throw new UnexpectedUndefinedError('VLC98823');
                } else {
                    const resolvedLayoutConfig = LayoutConfig.resolve(
                        translator,this._constructorOrSubWindowLayoutConfig
                    );
                    // remove root from layoutConfig
                    this.layoutConfig = {
                        ...resolvedLayoutConfig,
                        root: undefined,
                    }
                }
            }
        }

        if (skipInit !== true) {
            if (!this.deprecatedConstructor) {
                this.init();
            }
        }
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    override destroy(): void {
        this.bindComponentEvent = undefined;
        this.unbindComponentEvent = undefined;

        super.destroy();
    }


    /**
     * Executes `init` to handle init.
     * @zh 执行 `init`，用于初始化。
     */
    override init(): void {

        /**
         * If the document isn't ready yet, wait for it.
         */
        if (!this._bindComponentEventHanlderPassedInConstructor && (document.readyState === 'loading' || document.body === null)) {
            document.addEventListener('DOMContentLoaded', () => this.init(), { passive: true });
            return;
        }

        if (!this._bindComponentEventHanlderPassedInConstructor && this.isSubWindow === true && !this._creationTimeoutPassed) {
            setTimeout(() => this.init(), 7);
            this._creationTimeoutPassed = true;
            return;
        }

        if (this.isSubWindow === true) {
            if (!this._bindComponentEventHanlderPassedInConstructor) {
                this.clearHtmlAndAdjustStylesForSubWindow();
            }

            // Expose this instance on the window object to allow the opening window to interact with it
            //@ts-ignore
            window.__glInstance = this;
        }

        super.init();
    }

    /**
     * Executes `clearHtmlAndAdjustStylesForSubWindow` to handle clear html and adjust styles for sub window.
     * @zh 执行 `clearHtmlAndAdjustStylesForSubWindow`，用于清空HTML内容AndAdjust样式集合用于子窗口。
     */
    clearHtmlAndAdjustStylesForSubWindow(): void {
        const headElement = document.head;

        const appendNodeLists = new Array<NodeListOf<Element>>(4);
        appendNodeLists[0] = document.querySelectorAll('body link');
        appendNodeLists[1] = document.querySelectorAll('body style');
        appendNodeLists[2] = document.querySelectorAll('template');
        appendNodeLists[3] = document.querySelectorAll('.gl_keep');

        for (let listIdx = 0; listIdx < appendNodeLists.length; listIdx++) {
            const appendNodeList = appendNodeLists[listIdx];
            for (let nodeIdx = 0; nodeIdx < appendNodeList.length; nodeIdx++) {
                const node = appendNodeList[nodeIdx];
                headElement.appendChild(node);
            }
        }

        const bodyElement = document.body;
        bodyElement.innerHTML = '';
        bodyElement.style.visibility = 'visible';
        this.checkAddDefaultPopinButton();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const x = document.body.offsetHeight;
    }
    /**
     * Executes `checkAddDefaultPopinButton` to handle check add default popin button.
     * @zh 执行 `checkAddDefaultPopinButton`，用于检查添加默认Popin按钮。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    checkAddDefaultPopinButton(): boolean {
        if (this.layoutConfig.settings.popInOnClose) {
            return false;
        } else {
            const popInButtonElement = document.createElement('div');
            popInButtonElement.classList.add(DomConstants.ClassName.Popin);
            popInButtonElement.setAttribute('title', this.layoutConfig.header.dock);
            const iconElement = document.createElement('div');
            iconElement.classList.add(DomConstants.ClassName.Icon);
            const bgElement = document.createElement('div');
            bgElement.classList.add(DomConstants.ClassName.Bg);
            popInButtonElement.appendChild(iconElement);
            popInButtonElement.appendChild(bgElement);
            popInButtonElement.addEventListener('click', () => this.emit('popIn'));
            document.body.appendChild(popInButtonElement);
            return true;
        }
    }

    /**
     * Executes `bindComponent` to handle bind component.
     * @internal
     * @zh 执行 `bindComponent`，用于绑定组件。
     */
    override bindComponent( translator:TranslateService,container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent {
        if (this.bindComponentEvent !== undefined) {
            const bindableComponent = this.bindComponentEvent(container, itemConfig);
            return bindableComponent;
        } else {
            if (this.getComponentEvent !== undefined) {
                return {
                    virtual: false,
                    component: this.getComponentEvent(container, itemConfig),
                }
            } else {
                const text = translator.instant('docklayout.ComponentTypeNotRegisteredAndBindComponentEventHandlerNotAssigned');
                const message = `${text}: ${JSON.stringify(itemConfig)}`
                throw new BindError(message);
            }
        }
    }

    /**
     * Executes `unbindComponent` to handle unbind component.
     * @internal
     * @zh 执行 `unbindComponent`，用于解绑组件。
     */
    override unbindComponent(container: ComponentContainer, virtual: boolean, component: ComponentContainer.Component | undefined): void {
        if (this.unbindComponentEvent !== undefined) {
            this.unbindComponentEvent(container);
        } else {
            if (!virtual && this.releaseComponentEvent !== undefined) {
                if (component !== undefined) {
                    this.releaseComponentEvent(container, component);          
                } 
                // else {
                //     throw new UnexpectedUndefinedError('VCUCRCU333998');
                // }
            }
        }
    }
}

/** @public */
export namespace VirtualLayout {
 
    /**
     * Type alias `GetComponentEventHandler` representing get component event handler (`(this: void, container: ComponentContainer, itemConfig: ResolvedCompon...`).
     * @zh 类型别名 `GetComponentEventHandler`，表示获取组件事件处理器（`(this: void, container: ComponentContainer, itemConfig: ResolvedCompon...`）。
     */
    export type GetComponentEventHandler =
        (this: void, container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => ComponentContainer.Component;

    /**
     * Type alias `ReleaseComponentEventHandler` representing release component event handler (`(this: void, container: ComponentContainer, component: ComponentContai...`).
     * @zh 类型别名 `ReleaseComponentEventHandler`，表示Release组件事件处理器（`(this: void, container: ComponentContainer, component: ComponentContai...`）。
     */
    export type ReleaseComponentEventHandler =
        (this: void, container: ComponentContainer, component: ComponentContainer.Component) => void;

    /**
     * Type alias `BindComponentEventHandler` representing bind component event handler (`(this: void, container: ComponentContainer, itemConfig: ResolvedCompon...`).
     * @zh 类型别名 `BindComponentEventHandler`，表示绑定组件事件处理器（`(this: void, container: ComponentContainer, itemConfig: ResolvedCompon...`）。
     */
    export type BindComponentEventHandler =
        (this: void, container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => ComponentContainer.BindableComponent;
    /**
     * Type alias `UnbindComponentEventHandler` representing unbind component event handler (`(this: void, container: ComponentContainer) => void`).
     * @zh 类型别名 `UnbindComponentEventHandler`，表示解绑组件事件处理器（`(this: void, container: ComponentContainer) => void`）。
     */
    export type UnbindComponentEventHandler =
        (this: void, container: ComponentContainer) => void;

    /**
     * Type alias `BeforeVirtualRectingEvent` representing before virtual recting event (`(this: void) => void`).
     * @zh 类型别名 `BeforeVirtualRectingEvent`，表示之前虚拟滚动矩形事件（`(this: void) => void`）。
     */
    export type BeforeVirtualRectingEvent = (this: void) => void;

    /** @internal
     * Veriable to hold the state whether we already checked if we are running in a sub window.
     * Fixes popout and creation of nested dock-layouts.

     * @zh 常量/变量 `subWindowChecked`，定义 `src/container/dock-layout` 中的子窗口已勾选。
     */
    let subWindowChecked = false;

    /**
     * Executes `createLayoutManagerConstructorParameters` to handle create layout manager constructor parameters.
     * @internal
     * @zh 执行 `createLayoutManagerConstructorParameters`，用于创建布局管理器Constructor参数列表。
     */
    export function createLayoutManagerConstructorParameters(configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler?: HTMLElement |  VirtualLayout.BindComponentEventHandler):
        LayoutManager.ConstructorParameters
    {
        const windowConfigKey = subWindowChecked ? null : new URL(document.location.href).searchParams.get('gl-window');
        subWindowChecked = true;
        const isSubWindow = windowConfigKey !== null;

        let containerElement: HTMLElement | undefined;
        let config: LayoutConfig | undefined;
        if (windowConfigKey !== null) {
            const windowConfigStr = localStorage.getItem(windowConfigKey);
            if (windowConfigStr === null) {
                throw new Error('Null gl-window Config');
            }
            localStorage.removeItem(windowConfigKey);
            const minifiedWindowConfig = JSON.parse(windowConfigStr) as ResolvedPopoutLayoutConfig;
            const resolvedConfig = ResolvedLayoutConfig.unminifyConfig(minifiedWindowConfig);
            config = LayoutConfig.fromResolved(resolvedConfig)

            if (configOrOptionalContainer instanceof HTMLElement) {
                containerElement = configOrOptionalContainer;
            }
        } else {
            if (configOrOptionalContainer === undefined) {
                config = undefined;
            } else {
                if (configOrOptionalContainer instanceof HTMLElement) {
                    config = undefined;
                    containerElement = configOrOptionalContainer;
                } else {
                    // backwards compatibility
                    config = configOrOptionalContainer;
                }
            }

            if (containerElement === undefined) {
                if (containerOrBindComponentEventHandler instanceof HTMLElement) {
                    containerElement = containerOrBindComponentEventHandler;
                }
            }
        }

        return {
            constructorOrSubWindowLayoutConfig: config,
            isSubWindow,
            containerElement,
        };
    }
}
