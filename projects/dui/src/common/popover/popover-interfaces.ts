
import { ElementRef, EventEmitter, NgZone, TemplateRef } from '@angular/core';
import { DuiPopoverPositionX, DuiPopoverPositionY, DuiPopoverTriggerEvent, DuiPopoverScrollStrategy } from './popover-types';

export interface DuiPopoverPanel {
    positionX: DuiPopoverPositionX;
    positionY: DuiPopoverPositionY;
    containerPositioning: boolean;
    overlapTrigger: boolean;
    triggerEvent: DuiPopoverTriggerEvent;
    popoverPanelStyles:any;
    scrollStrategy: DuiPopoverScrollStrategy;
    enterDelay: number;
    leaveDelay: number;
    targetOffsetX: number;
    targetOffsetY: number;
    arrowOffsetX: number;
    arrowWidth: number;
    arrowColor: string;
    closeOnClick: boolean;
    closeDisabled: boolean;
    setCurrentStyles: () => void;
    templateRef: TemplateRef<any>;
    close: EventEmitter<void>;
    zone: NgZone;
    setPositionClasses: (x: DuiPopoverPositionX, y: DuiPopoverPositionY) => void;
    _emitCloseEvent: () => void;
}

export interface DuiPopoverConfig {
    positionX: DuiPopoverPositionX;
    positionY: DuiPopoverPositionY;
    overlapTrigger: boolean;
    triggerEvent: DuiPopoverTriggerEvent;
    triggerDelay: number;
    targetOffsetX: number;
    targetOffsetY: number;
    arrowOffsetX: number;
    arrowWidth: number;
    arrowColor: string;
    closeOnClick: boolean;
}

export interface DuiTarget {
    _elementRef: ElementRef;
}
