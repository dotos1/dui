/**
 * @fileoverview Module `src/common/popover/popover-interfaces.ts` providing popover interfaces definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover-interfaces.ts`，提供气泡卡片interfaces相关的定义与实现。
 */


import { ElementRef, EventEmitter, NgZone, TemplateRef } from '@angular/core';
import { PopoverPositionX, PopoverPositionY, PopoverTriggerEvent, PopoverScrollStrategy } from './popover-types';

/**
 * Interface `PopoverPanel` defining the contract and properties for popover panel.
 * @zh 接口 `PopoverPanel`，定义气泡卡片面板的数据结构契约与属性规范。
 */
export interface PopoverPanel {
    /**
     * Property `positionX` (`PopoverPositionX`) storing position x.
     * @zh 属性 `positionX`（类型：`PopoverPositionX`），用于存储或配置位置X坐标。
     */
    positionX: PopoverPositionX;
    /**
     * Property `positionY` (`PopoverPositionY`) storing position y.
     * @zh 属性 `positionY`（类型：`PopoverPositionY`），用于存储或配置位置Y坐标。
     */
    positionY: PopoverPositionY;
    /**
     * Property `containerPositioning` (`boolean`) storing container positioning.
     * @zh 属性 `containerPositioning`（类型：`boolean`），用于存储或配置容器位置。
     */
    containerPositioning: boolean;
    /**
     * Property `overlapTrigger` (`boolean`) storing overlap trigger.
     * @zh 属性 `overlapTrigger`（类型：`boolean`），用于存储或配置overlap触发。
     */
    overlapTrigger: boolean;
    /**
     * Property `triggerEvent` (`PopoverTriggerEvent`) storing trigger event.
     * @zh 属性 `triggerEvent`（类型：`PopoverTriggerEvent`），用于存储或配置触发事件。
     */
    triggerEvent: PopoverTriggerEvent;
    /**
     * Property `popoverPanelStyles` (`any`) storing popover panel styles.
     * @zh 属性 `popoverPanelStyles`（类型：`any`），用于存储或配置气泡卡片面板样式集合。
     */
    popoverPanelStyles;
    /**
     * Property `scrollStrategy` (`PopoverScrollStrategy`) storing scroll strategy.
     * @zh 属性 `scrollStrategy`（类型：`PopoverScrollStrategy`），用于存储或配置滚动策略。
     */
    scrollStrategy: PopoverScrollStrategy;
    /**
     * Property `enterDelay` (`number`) storing enter delay.
     * @zh 属性 `enterDelay`（类型：`number`），用于存储或配置进入延迟。
     */
    enterDelay: number;
    /**
     * Property `leaveDelay` (`number`) storing leave delay.
     * @zh 属性 `leaveDelay`（类型：`number`），用于存储或配置离开延迟。
     */
    leaveDelay: number;
    /**
     * Property `targetOffsetX` (`number`) storing target offset x.
     * @zh 属性 `targetOffsetX`（类型：`number`），用于存储或配置目标偏移量X坐标。
     */
    targetOffsetX: number;
    /**
     * Property `targetOffsetY` (`number`) storing target offset y.
     * @zh 属性 `targetOffsetY`（类型：`number`），用于存储或配置目标偏移量Y坐标。
     */
    targetOffsetY: number;
    /**
     * Property `arrowOffsetX` (`number`) storing arrow offset x.
     * @zh 属性 `arrowOffsetX`（类型：`number`），用于存储或配置箭头偏移量X坐标。
     */
    arrowOffsetX: number;
    /**
     * Property `arrowWidth` (`number`) storing arrow width.
     * @zh 属性 `arrowWidth`（类型：`number`），用于存储或配置箭头宽度。
     */
    arrowWidth: number;
    /**
     * Property `arrowColor` (`string`) storing arrow color.
     * @zh 属性 `arrowColor`（类型：`string`），用于存储或配置箭头颜色。
     */
    arrowColor: string;
    /**
     * Property `closeOnClick` (`boolean`) storing close on click.
     * @zh 属性 `closeOnClick`（类型：`boolean`），用于存储或配置关闭当点击。
     */
    closeOnClick: boolean;
    /**
     * Property `closeDisabled` (`boolean`) storing close disabled.
     * @zh 属性 `closeDisabled`（类型：`boolean`），用于存储或配置关闭已禁用。
     */
    closeDisabled: boolean;
    /**
     * Property `setCurrentStyles` (`() => void`) storing set current styles.
     * @zh 属性 `setCurrentStyles`（类型：`() => void`），用于存储或配置集合当前样式集合。
     */
    setCurrentStyles: () => void;
    /**
     * Property `templateRef` (`TemplateRef<any>`) storing template ref.
     * @zh 属性 `templateRef`（类型：`TemplateRef<any>`），用于存储或配置模板引用。
     */
    templateRef: TemplateRef<unknown>;
    /**
     * Property `close` (`EventEmitter<void>`) storing close.
     * @zh 属性 `close`（类型：`EventEmitter<void>`），用于存储或配置关闭。
     */
    close: EventEmitter<void>;
    /**
     * Property `zone` (`NgZone`) storing zone.
     * @zh 属性 `zone`（类型：`NgZone`），用于存储或配置区域(NgZone)。
     */
    zone: NgZone;
    /**
     * Property `setPositionClasses` (`(x: PopoverPositionX, y: PopoverPositionY) => void`) storing set position classes.
     * @zh 属性 `setPositionClasses`（类型：`(x: PopoverPositionX, y: PopoverPositionY) => void`），用于存储或配置集合位置类名集合。
     */
    setPositionClasses: (x: PopoverPositionX, y: PopoverPositionY) => void;
    /**
     * Property `_emitCloseEvent` (`() => void`) storing emit close event.
     * @zh 属性 `_emitCloseEvent`（类型：`() => void`），用于存储或配置发出关闭事件。
     */
    _emitCloseEvent: () => void;
}

/**
 * Interface `PopoverConfig` defining the contract and properties for popover config.
 * @zh 接口 `PopoverConfig`，定义气泡卡片配置的数据结构契约与属性规范。
 */
export interface PopoverConfig {
    /**
     * Property `positionX` (`PopoverPositionX`) storing position x.
     * @zh 属性 `positionX`（类型：`PopoverPositionX`），用于存储或配置位置X坐标。
     */
    positionX: PopoverPositionX;
    /**
     * Property `positionY` (`PopoverPositionY`) storing position y.
     * @zh 属性 `positionY`（类型：`PopoverPositionY`），用于存储或配置位置Y坐标。
     */
    positionY: PopoverPositionY;
    /**
     * Property `overlapTrigger` (`boolean`) storing overlap trigger.
     * @zh 属性 `overlapTrigger`（类型：`boolean`），用于存储或配置overlap触发。
     */
    overlapTrigger: boolean;
    /**
     * Property `triggerEvent` (`PopoverTriggerEvent`) storing trigger event.
     * @zh 属性 `triggerEvent`（类型：`PopoverTriggerEvent`），用于存储或配置触发事件。
     */
    triggerEvent: PopoverTriggerEvent;
    /**
     * Property `triggerDelay` (`number`) storing trigger delay.
     * @zh 属性 `triggerDelay`（类型：`number`），用于存储或配置触发延迟。
     */
    triggerDelay: number;
    /**
     * Property `targetOffsetX` (`number`) storing target offset x.
     * @zh 属性 `targetOffsetX`（类型：`number`），用于存储或配置目标偏移量X坐标。
     */
    targetOffsetX: number;
    /**
     * Property `targetOffsetY` (`number`) storing target offset y.
     * @zh 属性 `targetOffsetY`（类型：`number`），用于存储或配置目标偏移量Y坐标。
     */
    targetOffsetY: number;
    /**
     * Property `arrowOffsetX` (`number`) storing arrow offset x.
     * @zh 属性 `arrowOffsetX`（类型：`number`），用于存储或配置箭头偏移量X坐标。
     */
    arrowOffsetX: number;
    /**
     * Property `arrowWidth` (`number`) storing arrow width.
     * @zh 属性 `arrowWidth`（类型：`number`），用于存储或配置箭头宽度。
     */
    arrowWidth: number;
    /**
     * Property `arrowColor` (`string`) storing arrow color.
     * @zh 属性 `arrowColor`（类型：`string`），用于存储或配置箭头颜色。
     */
    arrowColor: string;
    /**
     * Property `closeOnClick` (`boolean`) storing close on click.
     * @zh 属性 `closeOnClick`（类型：`boolean`），用于存储或配置关闭当点击。
     */
    closeOnClick: boolean;
}

/**
 * Interface `PopoverTargetInterface` defining the contract and properties for popover target interface.
 * @zh 接口 `PopoverTargetInterface`，定义气泡卡片目标Interface的数据结构契约与属性规范。
 */
export interface PopoverTargetInterface {
    /**
     * Property `_elementRef` (`ElementRef`) storing element ref.
     * @zh 属性 `_elementRef`（类型：`ElementRef`），用于存储或配置元素引用。
     */
    _elementRef: ElementRef;
}
