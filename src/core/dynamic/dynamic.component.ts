import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import {  inject, ViewContainerRef, ɵcompileComponent } from '@angular/core';
import { SafeurlPipe } from "./safeurl.pipe";

@Component({
  selector: "dui-dynamic",
  templateUrl: "./dynamic.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class DynamicComponent implements OnInit {

  @Input()
  tmpl: string;

  @Input()
  data: any;

  template: string;

  viewRef = inject(ViewContainerRef);

  constructor(
    private safeUrl: SafeurlPipe,
    public detectChange: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    const safe: any = this.safeUrl.transform(this.tmpl, "html");
    this.template = safe.changingThisBreaksApplicationSecurity;
    const component = getComponentFromTemplate(this.template);
    const componentRef = this.viewRef.createComponent(component);
    componentRef.setInput('data', this.data);
  }
}

@Component({
  template: '',
}) class CustomComponent {
  @Input() data: any = {};
}

function getComponentFromTemplate(template: string) {
  ɵcompileComponent(CustomComponent, {
    template,
    standalone: true,
    imports: [CommonModule],
  });
  return CustomComponent;
}