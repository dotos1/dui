import { Directive, ViewContainerRef, TemplateRef, OnInit, OnDestroy, Input, Renderer2,
  EmbeddedViewRef } from '@angular/core';
import { autorun } from 'mobx';

@Directive({ selector: '[mobxAutorun]' })
export class MobxAutorunDirective implements OnInit, OnDestroy {
  protected templateBindings = {};
  protected dispose: any;
  protected view: EmbeddedViewRef<any>;
  @Input() mobxAutorun:any;

  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected renderer: Renderer2) {
    }

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.templateRef);

    if (this.dispose) { this.dispose(); }

    if (this.shouldDetach()) {
      this.view.detach();
    }
    this.autoDetect(this.view);
    // mobxAngularDebug(this.view, this.renderer, this.dispose);
  }

  shouldDetach() {
    return this.mobxAutorun && this.mobxAutorun.detach;
  }

  autoDetect(view: EmbeddedViewRef<any>) {
    this.dispose = autorun(() => view.detectChanges());
  }

  ngOnDestroy() {
    if (this.dispose) { this.dispose(); }
  }
}
