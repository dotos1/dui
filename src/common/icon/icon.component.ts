

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
import { FontLoaderService } from './font-loader.service';


/**
 * Renders an icon from any of several sources based on a single prefixed `value` string:
 * Material font icons (`FONT:name`), SVG icons (`SVG:name:url`), raw font classes (`font:class`),
 * or a custom web-font glyph loaded on demand (`EXTRA:family:codepoint:url`).
 * @zh 根据带前缀的 `value` 字符串，从多种来源渲染图标：Material 字体图标（`FONT:name`）、
 * SVG 图标（`SVG:name:url`）、原始字体类名（`font:class`），或按需加载的自定义 Web 字体字形（`EXTRA:family:codepoint:url`）。
 */
@Component({
  selector: 'dui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    hostID: 'dui-icon' + Math.random().toString(36).substring(2, 15)
  }
})
export class IconComponent {
  private _value = '';
  /**
   * The resolved icon source kind: `'FONT'`, `'SVG'`, `'font'`, or `'EXTRA'`, derived from `value`'s prefix.
   * @zh 解析出的图标来源类型：`'FONT'`、`'SVG'`、`'font'` 或 `'EXTRA'`，由 `value` 的前缀决定。
   */
  public iconType = 'FONT';

  /**
   * Material theme color applied to the icon.
   * @zh 应用到图标上的 Material 主题色。
   */
  @Input()
  color: ThemePalette|string;

  /** @zh 内部使用，根据图标类型绑定宿主 CSS 类名（`dui-icon` 或 `dui-font-icon`）。 */
  @HostBinding('class')
  get hostClasses(): any {
    if( this.iconType != "font"){
      return 'dui-icon'
    }else{
      return 'dui-font-icon';
    }
  }

  /**
   * Whether the icon is rendered in a disabled (dimmed) state.
   * @zh 图标是否以禁用（变暗）状态渲染。
   */
  @Input()
  set disabled(v: boolean) {
    this._disable = v;
    this._changeDetectorRef.detectChanges();
  }
  /**
   * Whether the icon is rendered in a disabled (dimmed) state.
   * @zh 图标是否以禁用（变暗）状态渲染。
   */
  get disabled(): boolean {
    return this._disable;
  }
  _disable:boolean=false;

  // 不要再加名叫 `style` 的 @Input(b8c5e5c 复核)。Angular 会把宿主上的静态
  // style="..." 和 [style] 绑定合并后送进同名输入,于是 _style 变成字符串,
  // 模板里的 [ngStyle]="_style" 抛 NG0901;dui/duix/aioffice 里带 style 的
  // <dui-icon> 有 20 处。对象样式只走 iconStyle。
  /**
   * Inline style object applied to the rendered `mat-icon` element.
   * @zh 应用到渲染出的 `mat-icon` 元素上的内联样式对象。
   */
  @Input()
  set iconStyle(v: any) {
    this._style = v;
    this._changeDetectorRef.detectChanges();
  }
  /**
   * Inline style object applied to the rendered `mat-icon` element.
   * @zh 应用到渲染出的 `mat-icon` 元素上的内联样式对象。
   */
  get iconStyle(): any {
    return this._style;
  }
  /**
   * The font-set prefix parsed from `value` (for `iconType === 'font'`).
   * @zh 从 `value` 中解析出的字体集前缀（当 `iconType === 'font'` 时使用）。
   */
  get fontSet(): any {
    let vals = this._value.split("_");
    return vals[0];
  }
  _style: any;

  /**
   * The resolved icon name/id/glyph used for rendering (with source prefix stripped).
   * @zh 用于渲染的、已去除来源前缀的图标名称/ID/字形。
   */
  get value(): string {
    return this._value;
  }

  /** @zh 内部使用，`EXTRA` 类型图标的自定义字体样式（`font-family`）。 */
  public fontStyle;

  /**
   * The icon source, encoded as a prefixed string: `FONT:name`, `SVG:name:url`,
   * `font:class`, or `EXTRA:family:codepoint:url`.
   * @zh 图标来源，编码为带前缀的字符串：`FONT:name`、`SVG:name:url`、`font:class` 或 `EXTRA:family:codepoint:url`。
   */
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
    } else if (value && value.startsWith("EXTRA")) {
      this.iconType = "EXTRA";
      let vals = value.split(":");
       this.fontLoaderService.loadFonts(vals[1],vals[3],700).then(()=>{
          this._value =String.fromCharCode(parseInt(vals[2],16));
          this.fontStyle={'font-family':vals[1]};
          this._changeDetectorRef.detectChanges();
      });
    } else if (value) {
      this.iconType = "FONT";
      this._value = value;
    }
  }
  constructor(
    public _changeDetectorRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    protected fontLoaderService:FontLoaderService,
    private domSanitizer: DomSanitizer) {
  }
}
