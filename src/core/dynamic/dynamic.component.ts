import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
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

  constructor(
    private safeUrl: SafeurlPipe,
    public detectChange: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    const safe: any = this.safeUrl.transform(this.tmpl, "html");
    this.template = safe.changingThisBreaksApplicationSecurity;
  }
}
