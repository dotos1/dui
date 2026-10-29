/**
 * @fileoverview Module `src/ux/iconpicker/icon-picker.component.ts` providing icon picker component definitions and implementation.
 * @zh 模块文件 `src/ux/iconpicker/icon-picker.component.ts`，提供图标选择器组件相关的定义与实现。
 */

import { DuiStyle } from '@dotos/dui/base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { ESCAPE } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject, takeUntil } from 'rxjs';

import { FontLoaderService, Icon, IconPickerService, IconType, SVGIcon } from '@dotos/dui/common/icon';
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { ThemeService } from '@dotos/dui/theme';
import { TranslateService } from '@dotos/dui/translator';
/**
 * Angular component `IconPickerComponent` (selector: 'icon-picker') providing icon picker component presentation and interaction in `src/ux/iconpicker`.
 * @zh Angular 组件 `IconPickerComponent`（selector: 'icon-picker'），提供图标选择器组件的视图渲染与交互逻辑（位于 `src/ux/iconpicker`）。
 */
@Component({
  selector: 'icon-picker',
  templateUrl: 'icon-picker.component.html',
  styleUrls: ['icon-picker.component.scss'],
  host: {
    'class': 'icon-picker',
    '(keydown)': '_handleKeydown($event)',
    
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IconPickerComponent implements TriggerPopup, OnInit, OnDestroy {

  /**
   * Property `host` (`any`) storing host.
   * @zh 属性 `host`（类型：`any`），用于存储或配置宿主。
   */
  host;
  /**
   * Property `params` (`any`) storing params.
   * @zh 属性 `params`（类型：`any`），用于存储或配置参数集合。
   */
  params;

  /**
   * Property `_unsubscribeAll` (`Subject<void>`) storing unsubscribe all.
   * @zh 属性 `_unsubscribeAll`（类型：`Subject<void>`），用于存储或配置取消订阅全部。
   */
  private _unsubscribeAll: Subject<void>;

  /**
   * Property `iconType` (`typeof IconType`) storing icon type (default: `IconType`).
   * @zh 属性 `iconType`（类型：`typeof IconType`），用于存储或配置图标类型（默认值：`IconType`）。
   */
  public iconType = IconType;

  /**
   * Property `iconPack` (`string[]`) storing icon pack (default: `['material', 'font', 'svg']`).
   * @zh 属性 `iconPack`（类型：`string[]`），用于存储或配置图标Pack（默认值：`['material', 'font', 'svg']`）。
   */
  public iconPack = ['material', 'font', 'svg'];

  /**
   * Property `currentIconPack` (`string`) storing current icon pack (default: `'material'`).
   * @zh 属性 `currentIconPack`（类型：`string`），用于存储或配置当前图标Pack（默认值：`'material'`）。
   */
  public currentIconPack = 'material';

  /**
   * Template/content query reference `dialogElement` (`any`) targeting dialog element.
   * @zh 模板/内容视图查询引用 `dialogElement`（`@ViewChild`），指向对话框元素。
   */
  @ViewChild('dialogPopup') dialogElement;

  /**
   * Property `dirs` (`any[]`) storing dirs (default: `[]`).
   * @zh 属性 `dirs`（类型：`any[]`），用于存储或配置目录（默认值：`[]`）。
   */
  dirs = [];

  /**
   * Property `categories` (`any[]`) storing categories (default: `[]`).
   * @zh 属性 `categories`（类型：`any[]`），用于存储或配置分类（默认值：`[]`）。
   */
  categories = [];

  /**
   * Property `fontdirs` (`any[]`) storing fontdirs (default: `[]`).
   * @zh 属性 `fontdirs`（类型：`any[]`），用于存储或配置fontdirs（默认值：`[]`）。
   */
  fontdirs = [];

  /**
   * Property `fontdirId` (`string`) storing fontdir id (default: `''`).
   * @zh 属性 `fontdirId`（类型：`string`），用于存储或配置fontdir唯一标识（默认值：`''`）。
   */
  public fontdirId='';

  /**
   * Property `icons` (`Icon[]`) storing icons (default: `[]`).
   * @zh 属性 `icons`（类型：`Icon[]`），用于存储或配置图标集合（默认值：`[]`）。
   */
  icons: Icon[] = [];
  /**
   * Property `svgIcons` (`SVGIcon[]`) storing svg icons (default: `[]`).
   * @zh 属性 `svgIcons`（类型：`SVGIcon[]`），用于存储或配置SVG矢量图图标集合（默认值：`[]`）。
   */
  svgIcons: SVGIcon[] = [];
  /**
   * Property `customIcons` (`any[]`) storing custom icons (default: `[]`).
   * @zh 属性 `customIcons`（类型：`any[]`），用于存储或配置自定义图标集合（默认值：`[]`）。
   */
  customIcons=[];

  /**
   * Property `fontIcons` (`any[]`) storing font icons (default: `[]`).
   * @zh 属性 `fontIcons`（类型：`any[]`），用于存储或配置字体图标集合（默认值：`[]`）。
   */
  fontIcons=[];

  /**
   * Property `search` (`string`) storing search (default: `''`).
   * @zh 属性 `search`（类型：`string`），用于存储或配置搜索（默认值：`''`）。
   */
  search = '';
  /**
   * Property `label` (`string`) storing label (default: `''`).
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签（默认值：`''`）。
   */
  label = '';

  /**
   * Property `svgdirId` (`string`) storing svgdir id (default: `''`).
   * @zh 属性 `svgdirId`（类型：`string`），用于存储或配置svgdir唯一标识（默认值：`''`）。
   */
  svgdirId='';
  /**
   * Property `assetsdir` (`string`) storing assetsdir (default: `"/assets/"`).
   * @zh 属性 `assetsdir`（类型：`string`），用于存储或配置assetsdir（默认值：`"/assets/"`）。
   */
  assetsdir = "/assets/";
  /**
   * Property `selectCategory` (`string`) storing select category (default: `''`).
   * @zh 属性 `selectCategory`（类型：`string`），用于存储或配置下拉选择分类（默认值：`''`）。
   */
  selectCategory='';

  /**
   * Property `style` (`DuiStyle`) storing style (default: `{}`).
   * @zh 属性 `style`（类型：`DuiStyle`），用于存储或配置样式（默认值：`{}`）。
   */
  public style: DuiStyle = {};

  /**
   * 图标网格可达数千项，trackBy 避免每次筛选/切换目录时整片重建 DOM。
   * @zh 图标网格可达数千项，trackBy 避免每次筛选/切换目录时整片重建 DOM。
   */
  trackByIconId = (_index: number, icon: { id? }) => icon ? icon.id : _index;
  /**
   * Property `trackByIconName` (`(_index: number, icon: { name?: any; }) => any`) storing track by icon name.
   * @zh 属性 `trackByIconName`（类型：`(_index: number, icon: { name?: any; }) => any`），用于存储或配置track按图标名称。
   */
  trackByIconName = (_index: number, icon: { name? }) => icon ? icon.name : _index;
  /**
   * Property `trackByMetaName` (`(_index: number, icon: { meta_name?: any; }) => any`) storing track by meta name.
   * @zh 属性 `trackByMetaName`（类型：`(_index: number, icon: { meta_name?: any; }) => any`），用于存储或配置track按元数据名称。
   */
  trackByMetaName = (_index: number, icon: { meta_name? }) => icon ? icon.meta_name : _index;
  /**
   * Property `trackByDirPath` (`(_index: number, dir: { path?: any; }) => any`) storing track by dir path.
   * @zh 属性 `trackByDirPath`（类型：`(_index: number, dir: { path?: any; }) => any`），用于存储或配置track按目录路径。
   */
  trackByDirPath = (_index: number, dir: { path? }) => dir ? dir.path : _index;
  /**
   * Property `trackByCategoryValue` (`(_index: number, category: { value?: any; }) => any`) storing track by category value.
   * @zh 属性 `trackByCategoryValue`（类型：`(_index: number, category: { value?: any; }) => any`），用于存储或配置track按分类值。
   */
  trackByCategoryValue = (_index: number, category: { value? }) => category ? category.value : _index;
  /**
   * Property `trackByIdentity` (`(_index: number, item: any) => any`) storing track by identity.
   * @zh 属性 `trackByIdentity`（类型：`(_index: number, item: any) => any`），用于存储或配置track按Identity。
   */
  trackByIdentity = (_index: number, item) => item;

  /**
   * Creates an instance of `IconPickerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `IconPickerComponent` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param service - Injected or initial service (`IconPickerService`) / 注入或传入的服务（`IconPickerService`）
   * @param matIconRegistry - Injected or initial mat icon registry (`MatIconRegistry`) / 注入或传入的Material图标Registry（`MatIconRegistry`）
   * @param domSanitizer - Injected or initial dom sanitizer (`DomSanitizer`) / 注入或传入的DOM节点安全清理器（`DomSanitizer`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param fontLoaderService - Injected or initial font loader service (`FontLoaderService`) / 注入或传入的字体加载器服务（`FontLoaderService`）
   * @param _apiBase - Injected or initial api base (`string`) / 注入或传入的API接口基础（`string`）
   */
  constructor(
    protected _element: ElementRef,
    protected renderer: Renderer2,
    protected _changeDetectorRef: ChangeDetectorRef,
    public http: HttpClient,
    private service: IconPickerService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected translate: TranslateService,
    public themeService: ThemeService,
    protected fontLoaderService:FontLoaderService,
    @Inject('apiBase') protected _apiBase: string) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    if (this.params.allow) {
      this.currentIconPack =this.params.allow[0];
    }
    this.getIcons(this.currentIconPack);
  }

  /**
   * Executes `setSearch` to handle set search.
   * @zh 执行 `setSearch`，用于集合搜索。
   * @param val - val parameter (`string`) / 值参数（`string`）
   */
  setSearch(val: string) {
    this.search = val;
  }

  /**
   * Executes `tabChanged` to handle tab changed.
   * @zh 执行 `tabChanged`，用于选项卡已变更。
   * @param tab - tab parameter (`any`) / 选项卡参数（`any`）
   */
  tabChanged(tab) {
    if(tab.tab.textLabel==this.translate.instant('UX.EXTRAFONTICON')){
      this.currentIconPack ='font';
    }else if(tab.tab.textLabel==this.translate.instant('UX.SVGICON')){
      this.currentIconPack ='svg';
    }else if(tab.tab.textLabel==this.translate.instant('UX.CUSTIOMICON')){
      this.currentIconPack ='custom';
    }else{
      this.currentIconPack ='material';
    }
    this.getIcons(this.currentIconPack);
  }

  /**
   * Executes `getIcons` to handle get icons.
   * @zh 执行 `getIcons`，用于获取图标集合。
   * @param iconPack - icon pack parameter (`any`) / 图标Pack参数（`any`）
   */
  getIcons(iconPack) {
    if (iconPack == 'svg') {
      let iconpath =this.params.iconpath;
      this.loadJson(iconpath+'/list.json').then(
        val => {
          this.dirs = val
          this.loadIcon(this.dirs[0]);
        }
      )
    }else if (iconPack == 'custom') {
      this.http.get(this._apiBase + '/lib/customiconpicker', {
        responseType: 'json',
        params:{custompath:this.params.custompath}
      }).pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (val: { value? }[]) => {
          this.categories = val
          this.selectCategory=val[0].value;
          this.showCustomIcons();
        }
      )
    }  else if(iconPack == 'material') {
      this.icons = this.service.getIcons(iconPack);
    }else{
      let fontpath =this.params.fontpath;
      this.loadJson(fontpath+'/list.json').then(
        val => {
          this.fontdirs = val;
          this.loadFontFace(this.fontdirs[0].path);
        }
      )
    }
  }
  /**
   * Executes `loadJson` to handle load json.
   * @zh 执行 `loadJson`，用于加载JSON。
   * @param url - url parameter (`any`) / 链接地址参数（`any`）
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  loadJson(url ) {
    return  fetch(this.assetsdir+url, {
      mode: 'cors',
      credentials: "same-origin"
    }).then(response=> response.json())
  }
  /**
   * Executes `changeFontDir` to handle change font dir.
   * @zh 执行 `changeFontDir`，用于变更字体目录。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  changeFontDir(event){
      this.loadFontFace(event.value);
  }
  /**
   * Executes `getBackGround` to handle get back ground.
   * @zh 执行 `getBackGround`，用于获取返回Ground。
   * @param meta - meta parameter (`any`) / 元数据参数（`any`）
   */
  getBackGround(meta){
    return {
      "background-color":meta['back_color']
    }
  }
  /**
   * Executes `loadFontFace` to handle load font face.
   * @zh 执行 `loadFontFace`，用于加载字体Face。
   * @param dir - dir parameter (`any`) / 目录参数（`any`）
   */
  private loadFontFace(dir){
    let fontpath =this.params.fontpath;
    this.loadJson(fontpath+'/'+dir+'/index.json').then(data => {
      data.name=data.name.replace('&','');
      this.fontLoaderService.loadFonts(data.name,data.url,700).then(()=>{
        let ranges=data.range;
        this.style={"font-family":data.name};
        this.fontIcons=[];
        for(let k=0;k<ranges.length;k++){
            let range=ranges[k];
            let start=parseInt(range.start,16);
            let end=parseInt(range.end,16);
            for(let i=start;i<end;i++){
              let fontIcon={
                id:String.fromCharCode(i),
                name:data.name,
                url:data.url
              }
              this.fontIcons.push(fontIcon);
            }
        }
        this.fontdirId=dir;
        this._changeDetectorRef.detectChanges();
      });
    })
  }
  /**
   * Executes `changeCategory` to handle change category.
   * @zh 执行 `changeCategory`，用于变更分类。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  changeCategory(event){
    this.selectCategory=event.value;
    this.showCustomIcons();
  }
  /**
   * Executes `sanitizeSvg` to handle sanitize svg.
   * @zh 执行 `sanitizeSvg`，用于sanitizeSVG矢量图。
   * @param rawSvg - raw svg parameter (`string`) / 原始SVG矢量图参数（`string`）
   */
  private sanitizeSvg(rawSvg: string) {
    let doc = new DOMParser().parseFromString(rawSvg ?? '', 'image/svg+xml');
    if (doc.querySelector('parsererror')) {
      doc = new DOMParser().parseFromString(rawSvg ?? '', 'text/html');
    }
    doc.querySelectorAll('script, foreignObject, iframe, object, embed').forEach(el => el.remove());
    doc.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (
          /^on/i.test(attr.name) ||
          (/^(href|xlink:href)$/i.test(attr.name) && /^\s*javascript:/i.test(attr.value))
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });
    const svgRoot = doc.querySelector('svg');
    return this.domSanitizer.bypassSecurityTrustHtml(svgRoot ? svgRoot.outerHTML : '');
  }
  /**
   * Executes `showCustomIcons` to handle show custom icons.
   * @zh 执行 `showCustomIcons`，用于显示自定义图标集合。
   */
  showCustomIcons(){
    this.service.getCustomIcons(this.selectCategory,this.params.custompath).pipe(takeUntil(this._unsubscribeAll)).subscribe((data: { svg?: string; id?: string; svgElm?; url?: string }[]) => {
      for (let i = 0; i < data.length; i++) {
        let meta=data[i];
          if(meta.svg!=''){
            meta.svg=meta.svg.replace('width="64px"',' width="36px"');
            meta.svg=meta.svg.replace('height="64px"',' height="36px"');
            meta.svg=meta.svg.replace('width="48px"',' width="36px"');
            meta.svg=meta.svg.replace('height="48px"',' height="36px"');
            if(meta.svg&&meta.svg.length>0){
              meta.svgElm=this.sanitizeSvg(meta.svg);
            }
            meta.url=this._apiBase+"/lib/icon/svg?id="+meta.id+"&type="+this.selectCategory;
            this.addCustomIcons(meta);
          }
      }
      this.customIcons = data;
      this._changeDetectorRef.detectChanges();
    })
  }
  /**
   * Executes `addCustomIcons` to handle add custom icons.
   * @zh 执行 `addCustomIcons`，用于添加自定义图标集合。
   * @param icon - icon parameter (`any`) / 图标参数（`any`）
   */
  addCustomIcons(icon) {
    this.matIconRegistry.addSvgIconLiteral(
      icon.meta_name,
      this.sanitizeSvg(icon.svg)
    );
  }
  /**
   * Executes `loadIcon` to handle load icon.
   * @zh 执行 `loadIcon`，用于加载图标。
   * @param dir - dir parameter (`any`) / 目录参数（`any`）
   */
  private loadIcon(dir){
    let iconpath =this.params.iconpath;
    this.loadJson(iconpath+'/'+dir+'/index.json').then(data => {
      for (let i = 0; i < data.length; i++) {
        this.addIcons(data[i]);
      }
      this.svgIcons = data;
      this.svgdirId=dir;
      this._changeDetectorRef.detectChanges();
    })
  }
  /**
   * Executes `changeDir` to handle change dir.
   * @zh 执行 `changeDir`，用于变更目录。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  changeDir(event) {
    this.loadIcon(event.value);
  }

  /**
   * Executes `addIcons` to handle add icons.
   * @zh 执行 `addIcons`，用于添加图标集合。
   * @param icon - icon parameter (`SVGIcon`) / 图标参数（`SVGIcon`）
   */
  addIcons(icon: SVGIcon) {
    this.matIconRegistry.addSvgIcon(
      icon.name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(icon.url)
    );
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Executes `selectIcon` to handle select icon.
   * @zh 执行 `selectIcon`，用于下拉选择图标。
   * @param icon - icon parameter (`Icon`) / 图标参数（`Icon`）
   */
  selectIcon(icon: Icon) {
    let val: Record<string, unknown> = {};
    val['type'] = 'FONT';
    val['value'] = 'FONT:' + icon.id;
    val['text'] = icon.id;
    this.host._selectAndClose(val);
    this.host.close();
  }

  /**
   * Executes `selectCustomIcon` to handle select custom icon.
   * @zh 执行 `selectCustomIcon`，用于下拉选择自定义图标。
   * @param icon - icon parameter (`any`) / 图标参数（`any`）
   */
  selectCustomIcon(icon) {
    let val: Record<string, unknown> = {};
    if(icon.svg!=''){
      val['type'] = 'SVG';
      val['value'] = 'SVG:' + icon.meta_name+ ':' + icon.url;
      val['text'] = icon.meta_name;
      this.host._selectAndClose(val);
    }else{
      val['type'] = 'COLOR';
      val['value']= icon.back_color;
      val['text'] = icon.meta_name;
      this.host._selectAndClose(val);
    }
    this.host.close();
  }

  /**
   * Executes `selectSVGIcon` to handle select svg icon.
   * @zh 执行 `selectSVGIcon`，用于下拉选择SVG矢量图图标。
   * @param icon - icon parameter (`SVGIcon`) / 图标参数（`SVGIcon`）
   */
  selectSVGIcon(icon: SVGIcon) {
    let val: Record<string, unknown> = {};
    val['type'] = 'SVG';
    val['value'] = 'SVG:' + icon.name + ':' + icon.url;
    val['text'] = icon.name;


    this.host._selectAndClose(val);
    this.host.close();
  }

  /**
   * Executes `selectFontIcon` to handle select font icon.
   * @zh 执行 `selectFontIcon`，用于下拉选择字体图标。
   * @param icon - icon parameter (`any`) / 图标参数（`any`）
   */
  selectFontIcon(icon){
    let val: Record<string, unknown> = {};
    val['type'] = 'EXTRA';
    let id=this.toHex(icon.id.charCodeAt(0));
    val['value'] = 'EXTRA:' + icon.name + ':'+ id + ':' + icon.url;
    val['text'] = icon.name;
    this.host._selectAndClose(val);
    this.host.close();
  }
   /**
    * Executes `toHex` to handle to hex.
    * @zh 执行 `toHex`，用于转换为十六进制颜色。
    * @param d - d parameter (`any`) / d参数（`any`）
    */
   toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
  }
  /**
   * Executes `_handleKeydown` to handle handle keydown.
   * @zh 执行 `_handleKeydown`，用于连接手柄按键按下。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  _handleKeydown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case ESCAPE:
        this.host.close();
        break;
      default:
        /* Return so that we don't preventDefault on keys that are not explicitly handled. */
        return;
    }
    event.preventDefault();
  }
}
