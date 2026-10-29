/**
 * @fileoverview Module `src/common/dialogs/services/dialog.service.ts` providing dialog service definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/services/dialog.service.ts`，提供对话框服务相关的定义与实现。
 */

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

/**
 * Interface `IDialogConfig` defining the contract and properties for i dialog config.
 * @zh 接口 `IDialogConfig`，定义I对话框配置的数据结构契约与属性规范。
 */
export interface IDialogConfig extends MatDialogConfig {
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title?: string;
  /**
   * Property `message` (`string`) storing message.
   * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
   */
  message?: string;
  /**
   * Property `viewContainerRef` (`ViewContainerRef`) storing view container ref.
   * @zh 属性 `viewContainerRef`（类型：`ViewContainerRef`），用于存储或配置视图容器引用。
   */
  viewContainerRef?: ViewContainerRef;
  /**
   * Property `disableClose` (`boolean`) storing disable close.
   * @zh 属性 `disableClose`（类型：`boolean`），用于存储或配置禁用关闭。
   */
  disableClose?: boolean;
}

/**
 * Interface `IAlertConfig` defining the contract and properties for i alert config.
 * @zh 接口 `IAlertConfig`，定义I警告框配置的数据结构契约与属性规范。
 */
export interface IAlertConfig extends IDialogConfig {
  /**
   * Property `closeButton` (`string`) storing close button.
   * @zh 属性 `closeButton`（类型：`string`），用于存储或配置关闭按钮。
   */
  closeButton?: string;
}

/**
 * Interface `IConfirmConfig` defining the contract and properties for i confirm config.
 * @zh 接口 `IConfirmConfig`，定义IConfirm配置的数据结构契约与属性规范。
 */
export interface IConfirmConfig extends IDialogConfig {
  /**
   * Property `acceptButton` (`string`) storing accept button.
   * @zh 属性 `acceptButton`（类型：`string`），用于存储或配置accept按钮。
   */
  acceptButton?: string;
  /**
   * Property `cancelButton` (`string`) storing cancel button.
   * @zh 属性 `cancelButton`（类型：`string`），用于存储或配置取消按钮。
   */
  cancelButton?: string;
  /**
   * Property `isDestructive` (`boolean`) storing is destructive.
   * @zh 属性 `isDestructive`（类型：`boolean`），用于存储或配置是否为Destructive。
   */
  isDestructive?: boolean;
}

/**
 * Interface `IPromptConfig` defining the contract and properties for i prompt config.
 * @zh 接口 `IPromptConfig`，定义IPrompt配置的数据结构契约与属性规范。
 */
export interface IPromptConfig extends IConfirmConfig {
  /**
   * Property `value` (`string | number`) storing value.
   * @zh 属性 `value`（类型：`string | number`），用于存储或配置值。
   */
  value?: string|number;
  /**
   * Property `minLength` (`number`) storing min length.
   * @zh 属性 `minLength`（类型：`number`），用于存储或配置最小值长度。
   */
  minLength?: number;
  /**
   * Property `maxLength` (`number`) storing max length.
   * @zh 属性 `maxLength`（类型：`number`），用于存储或配置最大值长度。
   */
  maxLength?: number;
  /**
   * Property `dataType` (`string`) storing data type.
   * @zh 属性 `dataType`（类型：`string`），用于存储或配置数据类型。
   */
  dataType?:string,
  /**
   * Property `min` (`number`) storing min.
   * @zh 属性 `min`（类型：`number`），用于存储或配置最小值。
   */
  min?: number;
  /**
   * Property `max` (`number`) storing max.
   * @zh 属性 `max`（类型：`number`），用于存储或配置最大值。
   */
  max?: number;
  /**
   * Property `required` (`boolean`) storing required.
   * @zh 属性 `required`（类型：`boolean`），用于存储或配置必填。
   */
  required?: boolean;
  /**
   * Property `pattern` (`string | RegExp`) storing pattern.
   * @zh 属性 `pattern`（类型：`string | RegExp`），用于存储或配置模式/图案。
   */
  pattern?: string | RegExp;
  /**
   * Property `blankText` (`string`) storing blank text.
   * @zh 属性 `blankText`（类型：`string`），用于存储或配置blank文本。
   */
  blankText?: string;
  /**
   * Property `maxLengthText` (`string`) storing max length text.
   * @zh 属性 `maxLengthText`（类型：`string`），用于存储或配置最大值长度文本。
   */
  maxLengthText?: string;
  /**
   * Property `minLengthText` (`string`) storing min length text.
   * @zh 属性 `minLengthText`（类型：`string`），用于存储或配置最小值长度文本。
   */
  minLengthText?: string;
  /**
   * Property `regexText` (`string`) storing regex text.
   * @zh 属性 `regexText`（类型：`string`），用于存储或配置正则表达式文本。
   */
  regexText?: string;
}

/**
 * Interface `IStatusConfig` defining the contract and properties for i status config.
 * @zh 接口 `IStatusConfig`，定义I状态配置的数据结构契约与属性规范。
 */
export interface IStatusConfig extends IAlertConfig {
  /**
   * Property `state` (`StatusDialogStates`) storing state.
   * @zh 属性 `state`（类型：`StatusDialogStates`），用于存储或配置状态。
   */
  state?: StatusDialogStates;
  /**
   * Property `details` (`string`) storing details.
   * @zh 属性 `details`（类型：`string`），用于存储或配置详情列表。
   */
  details?: string;
  /**
   * Property `detailsLabels` (`StatusDialogDetailsLabels`) storing details labels.
   * @zh 属性 `detailsLabels`（类型：`StatusDialogDetailsLabels`），用于存储或配置详情列表标签。
   */
  detailsLabels?: StatusDialogDetailsLabels;
}

/**
 * Interface `IDraggableConfig` defining the contract and properties for i draggable config.
 * @zh 接口 `IDraggableConfig`，定义I是否可拖拽配置的数据结构契约与属性规范。
 */
export interface IDraggableConfig<T> {
  /**
   * Property `component` (`ComponentType<T>`) storing component.
   * @zh 属性 `component`（类型：`ComponentType<T>`），用于存储或配置组件。
   */
  component: ComponentType<T>;
  /**
   * Property `config` (`MatDialogConfig<any>`) storing config.
   * @zh 属性 `config`（类型：`MatDialogConfig<any>`），用于存储或配置配置。
   */
  config?: MatDialogConfig;
  /**
   * Property `constraint` (`boolean`) storing constraint.
   * @zh 属性 `constraint`（类型：`boolean`），用于存储或配置constraint。
   */
  constraint?:boolean;

  /**
   * Property `dragHandleSelectors` (`string[]`) storing drag handle selectors.
   * @zh 属性 `dragHandleSelectors`（类型：`string[]`），用于存储或配置拖拽连接手柄选择器。
   */
  dragHandleSelectors?: string[];

  /**
   * Property `draggableClass` (`string`) storing draggable class.
   * @zh 属性 `draggableClass`（类型：`string`），用于存储或配置是否可拖拽类名。
   */
  draggableClass?: string;
}

/**
 * Interface `IDraggableRefs` defining the contract and properties for i draggable refs.
 * @zh 接口 `IDraggableRefs`，定义I是否可拖拽引用的数据结构契约与属性规范。
 */
export interface IDraggableRefs<T> {
  /**
   * Property `matDialogRef` (`MatDialogRef<T, any>`) storing mat dialog ref.
   * @zh 属性 `matDialogRef`（类型：`MatDialogRef<T, any>`），用于存储或配置Material对话框引用。
   */
  matDialogRef: MatDialogRef<T>;
  /**
   * Property `dragRefSubject` (`Subject<DragRef<any>>`) storing drag ref subject.
   * @zh 属性 `dragRefSubject`（类型：`Subject<DragRef<any>>`），用于存储或配置拖拽引用主题流。
   */
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
  /**
   * Property `_renderer2` (`Renderer2`) storing renderer2.
   * @zh 属性 `_renderer2`（类型：`Renderer2`），用于存储或配置renderer2。
   */
  private _renderer2: Renderer2;
  /**
   * Property `_componentMap` (`Map<any, any>`) storing component map (default: `new Map()`).
   * @zh 属性 `_componentMap`（类型：`Map<any, any>`），用于存储或配置组件映射表（默认值：`new Map()`）。
   */
  private _componentMap=new Map();

  /**
   * Creates an instance of `DialogService` and initializes its dependencies and internal state.
   * @zh 创建 `DialogService` 实例，并初始化其依赖项与内部状态。
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   * @param _dialogService - Injected or initial dialog service (`MatDialog`) / 注入或传入的对话框服务（`MatDialog`）
   * @param _dragDrop - Injected or initial drag drop (`DragDrop`) / 注入或传入的拖拽放置（`DragDrop`）
   * @param rendererFactory - Injected or initial renderer factory (`RendererFactory2`) / 注入或传入的渲染器工厂（`RendererFactory2`）
   */
  constructor(
    @Inject(DOCUMENT) private _document,
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

   * @zh 执行 `closeAll`，用于关闭全部。
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

   * @zh 执行 `openConfirm`，用于打开Confirm。
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

   * @zh 执行 `openPrompt`，用于打开Prompt。
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

   * @zh 执行 `openDraggable`，用于打开是否可拖拽。
   */
  public openDraggable<T>({
    component,
    config,
    constraint,
    dragHandleSelectors,
    draggableClass,
  }: IDraggableConfig<T>): IDraggableRefs<T> {
    const matDialogRef: MatDialogRef<T, unknown> = this._dialogService.open(
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

  /**
   * Executes `_createConfig` to handle create config.
   * @zh 执行 `_createConfig`，用于创建配置。
   * @param config - config parameter (`IDialogConfig`) / 配置参数（`IDialogConfig`）
   * @returns Result of type `MatDialogConfig<any>` / 类型为 `MatDialogConfig<any>` 的返回值
   */
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
