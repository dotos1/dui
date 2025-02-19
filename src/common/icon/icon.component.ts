

import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'dui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class IconComponent {
  private _value = '';
  public iconType = 'FONT';

  @Input()
  color: ThemePalette|string;

  @HostBinding('class')
  get hostClasses(): any {
    if( this.iconType != "font"){
      return 'dui-icon'
    }else{
      return 'dui-font-icon';
    }
  }

  @Input()
  set disabled(v: boolean) {
    this._disable = v;
    this._changeDetectorRef.detectChanges();
  }
  get disabled(): boolean {
    return this._disable;
  }
  _disable:boolean=false;

  @Input()
  set iconStyle(v: any) {
    this._style = v;
    this._changeDetectorRef.detectChanges();
  }
  get iconStyle(): any {
    return this._style;
  }
  get fontSet(): any {
    let vals = this._value.split("_");
    return vals[0];
  }
  _style: any;

  get value(): string {
    return this._value;
  }

  @Input()
  set value(value: string) {
    if (value && value.startsWith("SVG")) {
      this.iconType = "SVG";
      let vals = value.split(":");
      this._value = vals[1];
      if(vals[2]){
        this.matIconRegistry.addSvgIcon(
          vals[1],
          this.domSanitizer.bypassSecurityTrustResourceUrl(vals[2])
        );
      }
    } else if (value && value.startsWith("FONT")) {
      this.iconType = "FONT";
      let vals = value.split(":");
      this._value = vals[1];
    }else if (value && value.startsWith("font")) {
      this.iconType = "font";
      let vals = value.split(":");
      this._value = vals[1];
    }  else if (value) {
      this.iconType = "FONT";
      this._value = value;
    }
  }
  constructor(
    public _changeDetectorRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
  }
}
