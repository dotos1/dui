import { NgModule,  ComponentFactoryResolver } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutComponent } from './component/layout.component'
import { SplitAreaDirective } from './directive/split-area.directive'
import { DuiPanelComponent } from './component/panel.component'
import { Dui } from '@dotos/dui/core'

@NgModule({
  imports: [CommonModule],
  declarations: [LayoutComponent, DuiPanelComponent,SplitAreaDirective],
  exports: [LayoutComponent,DuiPanelComponent,SplitAreaDirective],
})
export class DuiLayoutModule {
  dynamicComponents = [LayoutComponent,DuiPanelComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.dynamicComponents);
  }
}
