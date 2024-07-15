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
  value?: string;
  minLength?: number;
  maxLength?: number;
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
  // CSS selectors of element(s) inside the component meant to be drag handle(s)
  dragHandleSelectors?: string[];
  // Class that will be added to the component signifying drag-ability
  draggableClass?: string;
}

export interface IDraggableRefs<T> {
  matDialogRef: MatDialogRef<T>;
  dragRefSubject: Subject<DragRef>;
}

@Injectable()
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
    if (config.minLength) {
      promptDialogComponent.minlength = config.minLength;
    }
    if (config.maxLength) {
      promptDialogComponent.maxlength = config.maxLength;
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
    matDialogRef.afterClosed().subscribe(()=>{
      this._componentMap.delete(matDialogRef.id);
    })
    const dragRefSubject: Subject<DragRef> = new Subject<DragRef>();

    const CDK_OVERLAY_PANE_SELECTOR = '.cdk-overlay-pane';
    const CDK_OVERLAY_CONTAINER_SELECTOR = '.cdk-overlay-container';

    matDialogRef.afterOpened().subscribe(() => {
      const dialogElement: HTMLElement = <HTMLElement>(
        this._document.getElementById(matDialogRef.id)
      );

      if (!dialogElement) {
        return;
      }

      const draggableElement: DragRef =
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
