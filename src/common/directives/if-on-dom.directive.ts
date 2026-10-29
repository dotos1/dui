/**
 * @fileoverview Module `src/common/directives/if-on-dom.directive.ts` providing if on dom directive definitions and implementation.
 * @zh 模块文件 `src/common/directives/if-on-dom.directive.ts`，提供if当DOM节点指令相关的定义与实现。
 */

import { AfterContentChecked, Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Structural-like directive that creates its embedded view only once the host element is
 * actually attached to `document.body` (checked on every content-check cycle), and clears
 * it again once detached.
 * @zh 类结构型指令：仅当宿主元素真正挂载到 `document.body` 后（在每次内容检查周期中判断）
 * 才创建其内嵌视图，一旦从文档中移除则清空视图。
 */
@Directive({
    selector: '[duiIfOnDom]'
})
export class DuiIfOnDomDirective implements AfterContentChecked
{
    /**
     * Whether the embedded view has currently been created (i.e. the host element is attached to the DOM).
     * @zh 内嵌视图当前是否已创建（即宿主元素是否已挂载到 DOM）。
     */
    isCreated: boolean;


    /**
     * Creates an instance of `DuiIfOnDomDirective` and initializes its dependencies and internal state.
     * @zh 创建 `DuiIfOnDomDirective` 实例，并初始化其依赖项与内部状态。
     * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
     * @param _templateRef - Injected or initial template ref (`TemplateRef<unknown>`) / 注入或传入的模板引用（`TemplateRef<unknown>`）
     * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
     */
    constructor(
        private _elementRef: ElementRef,
        private _templateRef: TemplateRef<unknown>,
        private _viewContainerRef: ViewContainerRef
    )
    {
        this.isCreated = false;
    }


    /**
     * Angular lifecycle hook invoked after every check of projected content.
     * @zh Angular 生命周期钩子：在每次检查完投影内容后调用。
     */
    ngAfterContentChecked(): void
    {
        if ( document.body.contains(this._elementRef.nativeElement) && !this.isCreated )
        {
            setTimeout(() => {
                this._viewContainerRef.createEmbeddedView(this._templateRef);
            }, 300);
            this.isCreated = true;
        }
        else if ( this.isCreated && !document.body.contains(this._elementRef.nativeElement) )
        {
            this._viewContainerRef.clear();
            this.isCreated = false;
        }
    }
}
