import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, Component, NgModule, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dui } from '@dotos/dui/core';
import { DockLayoutModule, DockLayoutHostComponent } from '@dotos/dui/container/dock-layout';

@Component({
  selector: 'app-dock-widget',
  template: `<div style="padding:12px;">停靠面板内容：{{ label }}</div>`,
})
export class DockWidgetComponent {
  label = 'Widget';
}

@Component({
  selector: 'app-dock-layout-example',
  template: `
    <h2>停靠布局示例</h2>
    <dock-layout-host #host style="display:block; width:100%; height:360px;"></dock-layout-host>
  `,
})
export class DockLayoutExampleComponent implements AfterViewInit {
  @ViewChild('host') host!: DockLayoutHostComponent;

  ngAfterViewInit(): void {
    this.host.dockLayout.loadLayout({
      root: {
        type: 'row',
        content: [
          { type: 'component', title: '左侧面板', componentType: { xtype: 'app-dock-widget' } },
          { type: 'component', title: '右侧面板', componentType: { xtype: 'app-dock-widget' } },
        ],
      },
    } as any);
  }
}

const routes: Routes = [{ path: '', component: DockLayoutExampleComponent }];

@NgModule({
  declarations: [DockLayoutExampleComponent, DockWidgetComponent],
  imports: [CommonModule, DockLayoutModule.forRoot(), RouterModule.forChild(routes)],
})
export class DockLayoutExampleModule {
  entryComponents = [DockWidgetComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver, this.entryComponents);
  }
}
