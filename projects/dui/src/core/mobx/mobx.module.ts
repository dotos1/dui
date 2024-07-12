import { NgModule } from '@angular/core';
import {MobxAutorunDirective} from './directives/mobx-autorun.directive';
import {MobxReactionDirective} from './directives/mobx-reaction.directive';

@NgModule({
  declarations: [
    MobxAutorunDirective, MobxReactionDirective
  ],
  exports: [
    MobxAutorunDirective,  MobxReactionDirective
  ]
})
export class MobxAngularModule {}
