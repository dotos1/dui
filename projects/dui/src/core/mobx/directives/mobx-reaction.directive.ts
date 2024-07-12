import { Directive, ViewContainerRef, TemplateRef, Input, Renderer2 } from '@angular/core';
import { reaction } from 'mobx';
import {MobxAutorunDirective} from './mobx-autorun.directive';

@Directive({ selector: '[mobxReaction]' })
export class MobxReactionDirective extends MobxAutorunDirective {
  @Input() mobxReaction;

  constructor(
    protected override templateRef: TemplateRef<any>,
    protected override viewContainer: ViewContainerRef,
    protected override renderer: Renderer2) {super(templateRef, viewContainer, renderer); }

  override autoDetect(view) {
    this.dispose = reaction(this.mobxReaction, () => view.detectChanges(), { fireImmediately: true });
  }
}
