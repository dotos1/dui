/**
 * @fileoverview Module `src/ux/command-palette/services/command-palette-creator-service.ts` providing command palette creator service definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/services/command-palette-creator-service.ts`，提供命令调色板creator服务相关的定义与实现。
 */

import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommandPaletteComponent } from '../command-palette.component';

/**
 * Injectable Angular service `CommandPaletteCreatorService` managing command palette creator service state and operations in `src/ux/command-palette/services`.
 * @zh 可注入的 Angular 服务 `CommandPaletteCreatorService`，管理 `src/ux/command-palette/services` 中的命令调色板Creator服务状态与业务操作。
 */
@Injectable()
export class CommandPaletteCreatorService {

  /**
   * Property `componentRef` (`ComponentRef<CommandPaletteComponent> | undefined`) storing component ref.
   * @zh 属性 `componentRef`（类型：`ComponentRef<CommandPaletteComponent> | undefined`），用于存储或配置组件引用。
   */
  private componentRef: ComponentRef<CommandPaletteComponent> | undefined;

  /**
   * Creates an instance of `CommandPaletteCreatorService` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteCreatorService` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param applicationRef - Injected or initial application ref (`ApplicationRef`) / 注入或传入的application引用（`ApplicationRef`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
   */
  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly applicationRef: ApplicationRef,
    private readonly injector: Injector,
    @Inject(DOCUMENT) public readonly document: Document
  ) {
  }

  /**
   * Executes `create` to handle create.
   * @zh 执行 `create`，用于创建。
   */
  create(): void {
    if (this.componentRef) {
      return;
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(CommandPaletteComponent);
    this.componentRef = factory.create(this.injector);
    this.applicationRef.attachView(this.componentRef.hostView);
    this.componentRef.changeDetectorRef.detectChanges();
    this.document.body.prepend(this.componentRef.location.nativeElement);
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    this.componentRef?.destroy();
    this.componentRef = undefined;
  }

}
