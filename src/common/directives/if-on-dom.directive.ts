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
    isCreated: boolean;


    constructor(
        private _elementRef: ElementRef,
        private _templateRef: TemplateRef<any>,
        private _viewContainerRef: ViewContainerRef
    )
    {
        this.isCreated = false;
    }


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
