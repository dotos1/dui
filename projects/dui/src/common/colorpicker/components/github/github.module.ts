import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule, } from '@angular/core';
import { SwatchModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { GithubSwatchComponent } from './github-swatch.component';
import { GithubComponent } from './github.component';

@NgModule({
  declarations: [GithubComponent, GithubSwatchComponent],
  exports: [GithubComponent, GithubSwatchComponent],
  imports: [CommonModule, SwatchModule],
})
export class ColorGithubModule {
  entryComponents = [  GithubComponent, GithubSwatchComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
