import { Injectable, Inject, Renderer2, RendererFactory2, ViewContainerRef } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import {
  StatusDialogStates,
  StatusDialogComponent,
  StatusDialogDetailsLabels,
} from '../status-dialog/status-dialog.component';

export interface IDialogConfig extends MatDialogConfig {
  title?: string;
  message?: string;
  viewContainerRef?: ViewContainerRef;
  disableClose?: boolean;
}

export interface IAlertConfig extends IDialogConfig {
  closeButton?: string;
}

export interface IConfirmConfig extends IDialogConfig {
  acceptButton?: string;
  cancelButton?: string;
  isDestructive?: boolean;
}

export interface IPromptConfig extends IConfirmConfig {
  value?: string|number;
  minLength?: number;
  maxLength?: number;
  dataType?:string,
  min?: number;
  max?: number;
  required?: boolean;
  pattern?: string | RegExp;
  blankText?: string;
  maxLengthText?: string;
  minLengthText?: string;
  regexText?: string;
}

export interface IStatusConfig extends IAlertConfig {
  state?: StatusDialogStates;
  details?: string;
  detailsLabels?: StatusDialogDetailsLabels;
}

export interface IDraggableConfig<T> {
  component: ComponentType<T>;
  config?: MatDialogConfig;
  constraint?:boolean;

  dragHandleSelectors?: string[];

  draggableClass?: string;
}

export interface IDraggableRefs<T> {
  matDialogRef: MatDialogRef<T>;
  dragRefSubject: Subject<DragRef>;
}

/**
 * High-level wrapper over Angular Material's `MatDialog` providing ready-made
 * alert/confirm/prompt/status dialogs, plus optional draggable-dialog support.
 * @zh 对 Angular Material `MatDialog` 的高层封装，提供开箱即用的
 * 提示/确认/输入/状态对话框，并可选支持可拖拽对话框。
 */
/*
 * **root 级**，不再只由 `DialogsModule.providers` 提供。
 *
 * 起因是一类反复出现的运行时崩溃：任何 `providedIn: 'root'` 的服务只要依赖
 * 本服务，就会在 **root 注入器**里被实例化，而那时 `DialogsModule` 的
 * providers 只存在于子注入器里 —— 于是抛
 * `NullInjectorError: No provider for DialogService`。编译期完全看不出来，
 * 只有走到那条代码路径才炸。
 *
 * 自身依赖(`MatDialog`、`DragDrop`、`MAT_DIALOG_SCROLL_STRATEGY`、`DOCUMENT`、
 * `RendererFactory2`)全部是 root 可解析的，所以提到 root 不会把问题推到下一层。
 * 语义上也更一致：`MatDialog` 本来就是 root 单例，对话框栈本就是全局的。
 *
 * <b>注意这不代表可以不 import `DialogsModule`</b> —— 内置对话框组件是在那个
 * NgModule 的构造函数里注册进 Dui 组件工厂的，少了它对话框仍然打不开。
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private _renderer2: Renderer2;
  private _componentMap:Map<string,any>=new Map();

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _dialogService: MatDialog,
    private _dragDrop: DragDrop,
    private rendererFactory: RendererFactory2
  ) {
    this._renderer2 = rendererFactory.createRenderer(undefined, null);
  }


  /**
   * Opens an arbitrary component in a Material dialog, tracking it in `getOpenedComponents`.
   * @zh 在 Material 对话框中打开任意组件，并在 `getOpenedComponents` 中进行跟踪。
   */
  public open<T>(
    component: ComponentType<T>,
    config?: MatDialogConfig
  ): MatDialogRef<T> {
    let matDialogRef= this._dialogService.open(component, config);
    this._componentMap.set(matDialogRef.id,matDialogRef.componentInstance);
    matDialogRef.afterClosed().subscribe(()=>{
      this._componentMap.delete(matDialogRef.id);
    })
    return matDialogRef;
  }
  
  /**
   * Returns a map of currently-open dialog ids to their component instances.
   * @zh 返回当前已打开对话框 id 到其组件实例的映射。
   */
  public getOpenedComponents(){
    return this._componentMap;
  }
  /**
   * Wrapper function over the closeAll() method in MatDialog.
   * Closes all of the currently-open dialogs.
   */
  public closeAll(): void {
    this._dialogService.closeAll();
  }

  /**
   * Opens an {@link AlertDialogComponent} with the given config.
   * @zh 使用给定配置打开一个 {@link AlertDialogComponent} 提示对话框。
   */
  public openAlert(config: IAlertConfig): MatDialogRef<AlertDialogComponent> {
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<AlertDialogComponent> =
      this._dialogService.open(AlertDialogComponent, dialogConfig);
    const alertDialogComponent: AlertDialogComponent =
      dialogRef.componentInstance;
    alertDialogComponent.title = config.title;
    alertDialogComponent.message = config.message;
    if (config.closeButton) {
      alertDialogComponent.closeButton = config.closeButton;
    }
    return dialogRef;
  }

  /**
   * params:
   * - config: IConfirmConfig {
   *     message: string;
   *     title?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     acceptButton?: string;
   *     cancelButton?: string;
   *     isDestructive?: boolean;
   * }
   *
   * Opens a confirm dialog with the provided config.
   * Returns an MatDialogRef<TdConfirmDialogComponent> object.
   */
  public openConfirm(
    config: IConfirmConfig
  ): MatDialogRef<ConfirmDialogComponent> {
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<ConfirmDialogComponent> =
      this._dialogService.open(ConfirmDialogComponent, dialogConfig);
    const confirmDialogComponent: ConfirmDialogComponent =
      dialogRef.componentInstance;
    confirmDialogComponent.title = config.title;
    confirmDialogComponent.message = config.message;
    if (config.acceptButton) {
      confirmDialogComponent.acceptButton = config.acceptButton;
    }
    if (config.isDestructive) {
      confirmDialogComponent.isDestructive = config.isDestructive;
    }
    if (config.cancelButton) {
      confirmDialogComponent.cancelButton = config.cancelButton;
    }
    return dialogRef;
  }

  /**
   * params:
   * - config: IPromptConfig {
   *     message: string;
   *     title?: string;
   *     value?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     acceptButton?: string;
   *     cancelButton?: string;
   * }
   *
   * Opens a prompt dialog with the provided config.
   * Returns an MatDialogRef<TdPromptDialogComponent> object.
   */
  public openPrompt(
    config: IPromptConfig
  ): MatDialogRef<PromptDialogComponent> {
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<PromptDialogComponent> =
      this._dialogService.open(PromptDialogComponent, dialogConfig);
    const promptDialogComponent: PromptDialogComponent =
      dialogRef.componentInstance;
    promptDialogComponent.title = config.title;
    promptDialogComponent.message = config.message;
    promptDialogComponent.formControl.setValue(config.value);
    if (config.minLength !== undefined) {
      promptDialogComponent.minlength = config.minLength;
    }
    if (config.maxLength !== undefined) {
      promptDialogComponent.maxlength = config.maxLength;
    }
    if (config.min !== undefined) {
      promptDialogComponent.min = config.min;
    }
    if (config.max !== undefined) {
      promptDialogComponent.max = config.max;
    }
    if (config.required !== undefined) {
      promptDialogComponent.required = config.required;
    }
    if (config.dataType) {
      promptDialogComponent.dataType = config.dataType;
    }
    if (config.pattern) {
      promptDialogComponent.pattern = config.pattern;
    }
    if (config.blankText) {
      promptDialogComponent.blankText = config.blankText;
    }
    if (config.maxLengthText) {
      promptDialogComponent.maxLengthText = config.maxLengthText;
    }
    if (config.minLengthText) {
      promptDialogComponent.minLengthText = config.minLengthText;
    }
    if (config.regexText) {
      promptDialogComponent.regexText = config.regexText;
    }
    if (config.acceptButton) {
      promptDialogComponent.acceptButton = config.acceptButton;
    }
    if (config.cancelButton) {
      promptDialogComponent.cancelButton = config.cancelButton;
    }
    return dialogRef;
  }

  /**
   * Opens a draggable dialog containing the given component.
   */
  public openDraggable<T>({
    component,
    config,
    constraint,
    dragHandleSelectors,
    draggableClass,
  }: IDraggableConfig<T>): IDraggableRefs<T> {
    const matDialogRef: MatDialogRef<T, any> = this._dialogService.open(
      component,
      config
    );
    this._componentMap.set(matDialogRef.id,matDialogRef.componentInstance);
    const dragRefSubject: Subject<DragRef> = new Subject<DragRef>();
    let draggableElement: DragRef;

    matDialogRef.afterClosed().subscribe(()=>{
      this._componentMap.delete(matDialogRef.id);
      if (draggableElement) {
        draggableElement.dispose();
      }
      dragRefSubject.complete();
    })

    const CDK_OVERLAY_PANE_SELECTOR = '.cdk-overlay-pane';
    const CDK_OVERLAY_CONTAINER_SELECTOR = '.cdk-overlay-container';

    matDialogRef.afterOpened().subscribe(() => {
      const dialogElement: HTMLElement = <HTMLElement>(
        this._document.getElementById(matDialogRef.id)
      );

      if (!dialogElement) {
        return;
      }

      draggableElement =
        this._dragDrop.createDrag(dialogElement);

      if (draggableClass) {
        const childComponent = dialogElement.firstElementChild;
        this._renderer2.addClass(childComponent, draggableClass);
      }
      if (dragHandleSelectors && dragHandleSelectors.length) {
        const dragHandles: Element[] = dragHandleSelectors.reduce(
          (acc: Element[], curr: string) => [
            ...acc,
            ...Array.from(dialogElement.querySelectorAll(curr)),
          ],
          []
        );
        if (dragHandles.length > 0) {
          draggableElement.withHandles(<HTMLElement[]>dragHandles);
        }
      }
      const rootElement = dialogElement.closest(CDK_OVERLAY_PANE_SELECTOR);
      if (rootElement) {
        draggableElement.withRootElement(<HTMLElement>rootElement);
      }
      if( constraint==true){
      const boundaryElement = dialogElement.closest(
        CDK_OVERLAY_CONTAINER_SELECTOR
      );
      if (boundaryElement) {
        draggableElement.withBoundaryElement(<HTMLElement>boundaryElement);
      }
    }
      dragRefSubject.next(draggableElement);

    });

    return { matDialogRef, dragRefSubject };
  }

  private _createConfig(config: IDialogConfig): MatDialogConfig {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    Object.assign(dialogConfig, config);
    return dialogConfig;
  }


  /**
   * Opens a {@link StatusDialogComponent} with the given config.
   * @zh 使用给定配置打开一个 {@link StatusDialogComponent} 状态对话框。
   */
  public openStatus(
    config: IStatusConfig
  ): MatDialogRef<StatusDialogComponent> {
    config.panelClass = 'dui-status-dialog';
    config.autoFocus = false;
    config.width = '575px';
    config.maxWidth = '96vw';
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<StatusDialogComponent> =
      this._dialogService.open(StatusDialogComponent, dialogConfig);
    const statusDialogComponent: StatusDialogComponent =
      dialogRef.componentInstance;
    statusDialogComponent.title = config.title;
    statusDialogComponent.message = config.message;
    statusDialogComponent.state = config.state;
    statusDialogComponent.details = config.details;
    if (config.detailsLabels) {
      statusDialogComponent.detailsLabels = config.detailsLabels;
    }
    if (config.closeButton) {
      statusDialogComponent.closeButton = config.closeButton;
    }
    return dialogRef;
  }
}
