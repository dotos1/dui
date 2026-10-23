import { ChangeDetectorRef, Component, ComponentRef, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import {  inject, ViewContainerRef, ɵcompileComponent } from '@angular/core';
import { SafeurlPipe } from "./safeurl.pipe";

@Component({
  selector: "dui-dynamic",
  templateUrl: "./dynamic.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class DynamicComponent implements OnInit, OnDestroy {

  @Input()
  tmpl: string;

  @Input()
  data: any;

  template: string;

  viewRef = inject(ViewContainerRef);

  private componentRef?: ComponentRef<any>;

  constructor(
    private safeUrl: SafeurlPipe,
    public detectChange: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    const safe: any = this.safeUrl.transform(this.tmpl, "html");
    this.template = safe.changingThisBreaksApplicationSecurity;
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    const component = getComponentFromTemplate(this.template);
    this.componentRef = this.viewRef.createComponent(component);
    this.componentRef.setInput('data', this.data);
    // 生产构建（ngDevMode=false）不跑 ɵsetClassMetadata，@Input 元数据没了；setInput 静默落空 —— 再直接赋一次
    this.componentRef.instance.data = this.data;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}

function getComponentFromTemplate(template: string) {
  @Component({
    template: '',
  })
  class CustomComponent {
    @Input() data: any = {};
  }

  // inputs 要显式写：@Input() 装饰器的元数据只在开发模式下由 ɵsetClassMetadata 补上，生产构建里运行时编译的组件
  // 没有 data 输入，模板里 {{data.x}} 全是空（2026-10-22：平台看板卡片在生产构建里一片空白）
  ɵcompileComponent(CustomComponent, {
    template,
    standalone: true,
    imports: [CommonModule],
    inputs: ['data'],
  });
  return CustomComponent;
}