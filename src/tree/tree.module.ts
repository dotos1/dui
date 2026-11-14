/**
 * @fileoverview Module `src/tree/tree.module.ts` providing tree module definitions and implementation.
 * @zh 模块文件 `src/tree/tree.module.ts`，提供树形控件模块相关的定义与实现。
 */

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IconModule } from '@dotos/dui/common/icon';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { TranslateModule } from '@dotos/dui/translator';

import { LoadingComponent } from './components/loading.component';
import { TreeNodeCheckboxComponent } from './components/tree-node-checkbox.component';
import { TreeNodeChildrenComponent } from './components/tree-node-children.component';
import { TreeNodeCollectionComponent } from './components/tree-node-collection.component';
import { TreeNodeContent } from './components/tree-node-content.component';
import { TreeNodeDropSlot } from './components/tree-node-drop-slot.component';
import { TreeNodeExpanderComponent } from './components/tree-node-expander.component';
import { TreeNodeWrapperComponent } from './components/tree-node-wrapper.component';
import { TreeNodeComponent } from './components/tree-node.component';
import { TreeViewportComponent } from './components/tree-viewport.component';
import { ITreeConfig, TreeComponent } from './components/tree.component';
import { KEYS } from './constants/keys';
import { IAllowDragFn, IAllowDropFn, ITreeOptions, ITreeState } from './defs/api';
import { TreeAnimateOpenDirective } from './directives/tree-animate-open.directive';
import { TreeDragDirective } from './directives/tree-drag.directive';
import { TreeDropDirective } from './directives/tree-drop.directive';
import { TreeMobxAutorunDirective } from './mobx-angular/tree-mobx-autorun.directive';
import { TreeDraggedElement } from './models';
import { TreeNode } from './models/tree-node.model';
import { IActionHandler, IActionMapping, TREE_ACTIONS } from './models/tree-options.model';
import { TreeVirtualScroll } from './models/tree-virtual-scroll.model';
import { TreeModel } from './models/tree.model';

/**
 * Angular module `TreeModule` declaring and exporting tree module components, directives, pipes, and providers.
 * @zh Angular 模块 `TreeModule`，声明并导出树形控件模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    TreeComponent,
    TreeNodeComponent,
    TreeNodeContent,
    LoadingComponent,
    TreeDropDirective,
    TreeDragDirective,
    TreeNodeExpanderComponent,
    TreeNodeChildrenComponent,
    TreeNodeDropSlot,
    TreeNodeCollectionComponent,
    TreeViewportComponent,
    TreeNodeWrapperComponent,
    TreeNodeCheckboxComponent,
    TreeAnimateOpenDirective,
    TreeMobxAutorunDirective
  ],
  exports: [
    TreeComponent,
    TreeNodeComponent,
    TreeNodeContent,
    LoadingComponent,
    TreeDropDirective,
    TreeDragDirective,
    TreeNodeExpanderComponent,
    TreeNodeChildrenComponent,
    TreeNodeDropSlot,
    TreeNodeCollectionComponent,
    TreeViewportComponent,
    TreeNodeWrapperComponent,
    TreeNodeCheckboxComponent,
    TreeAnimateOpenDirective,
    TreeMobxAutorunDirective
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    IconModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
  providers: [
    LocalStorageService,
    {
      provide: 'LOCAL_STORAGE_SERVICE_CONFIG',
      useValue: {
        prefix: 'dotos',
        storageType: 'localStorage'
      }
    }
  ]
})
export class TreeModule { }

export {
  IActionHandler, IActionMapping, IAllowDragFn, IAllowDropFn, ITreeConfig, ITreeOptions, ITreeState, KEYS, LoadingComponent, TREE_ACTIONS, TreeAnimateOpenDirective, TreeComponent, TreeDragDirective, TreeDraggedElement, TreeDropDirective, TreeMobxAutorunDirective, TreeModel,
  TreeNode, TreeNodeCheckboxComponent, TreeNodeChildrenComponent, TreeNodeCollectionComponent, TreeNodeComponent, TreeNodeContent, TreeNodeDropSlot, TreeNodeExpanderComponent, TreeNodeWrapperComponent, TreeViewportComponent, TreeVirtualScroll
};

