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

  ɵcompileComponent(CustomComponent, {
    template,
    standalone: true,
    imports: [CommonModule],
  });
  return CustomComponent;
}