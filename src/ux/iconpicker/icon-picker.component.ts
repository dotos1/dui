import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { ESCAPE } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from 'rxjs';

import { FontLoaderService, Icon, IconPickerService, IconType, SVGIcon } from '@dotos/dui/common/icon';
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { ThemeService } from '@dotos/dui/theme';
import { TranslateService } from '@dotos/dui/translator';
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

  host: any;
  params: any;

  private _unsubscribeAll: Subject<void>;

  public iconType = IconType;

  public iconPack = ['material', 'font', 'svg'];

  public currentIconPack = 'material';

  @ViewChild('dialogPopup') dialogElement: any;

  dirs: any = [];

  categories: any = [];

  fontdirs: any = [];

  public fontdirId='';

  icons: Icon[] = [];
  svgIcons: SVGIcon[] = [];
  customIcons:any[]=[];

  fontIcons:any[]=[];

  search = '';
  label = '';

  svgdirId='';
  assetsdir = "/assets/";
  selectCategory='';

  public style={};

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

  ngOnInit() {
    if (this.params.allow) {
      this.currentIconPack =this.params.allow[0];
    }
    this.getIcons(this.currentIconPack);
  }

  setSearch(val: string) {
    this.search = val;
  }

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
      }).subscribe(
        val => {
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
  loadJson(url ) : Promise<any>{
    return  fetch(this.assetsdir+url, {
      mode: 'cors',
      credentials: "same-origin"
    }).then(response=> response.json())
  }
  changeFontDir(event){
      this.loadFontFace(event.value);
  }
  getBackGround(meta){
    return {
      "background-color":meta['back_color']
    }
  }
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
  changeCategory(event){
    this.selectCategory=event.value;
    this.showCustomIcons();
  }
  showCustomIcons(){
    this.service.getCustomIcons(this.selectCategory,this.params.custompath).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let meta=data[i];
          if(meta.svg!=''){
            meta.svg=meta.svg.replace('width="64px"',' width="36px"');
            meta.svg=meta.svg.replace('height="64px"',' height="36px"');
            meta.svg=meta.svg.replace('width="48px"',' width="36px"');
            meta.svg=meta.svg.replace('height="48px"',' height="36px"');
            if(meta.svg&&meta.svg.length>0){
              meta.svgElm=this.domSanitizer.bypassSecurityTrustHtml(meta.svg);
            }
            meta.url=this._apiBase+"/lib/icon/svg?id="+meta.id+"&type="+this.selectCategory;
            this.addCustomIcons(meta);
          }
      }
      this.customIcons = data;
      this._changeDetectorRef.detectChanges();
    })
  }
  addCustomIcons(icon: any) {
    this.matIconRegistry.addSvgIconLiteral(
      icon.meta_name,
      this.domSanitizer.bypassSecurityTrustHtml(icon.svg)
    );
  }
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
  changeDir(event) {
    this.loadIcon(event.value);
  }

  addIcons(icon: SVGIcon) {
    this.matIconRegistry.addSvgIcon(
      icon.name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(icon.url)
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectIcon(icon: Icon) {
    let val = {};
    val['type'] = 'FONT';
    val['value'] = 'FONT:' + icon.id;
    val['text'] = icon.id;
    this.host._selectAndClose(val);
    this.host.close();
  }

  selectCustomIcon(icon: any) {
    let val = {};
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

  selectSVGIcon(icon: SVGIcon) {
    let val = {};
    val['type'] = 'SVG';
    val['value'] = 'SVG:' + icon.name + ':' + icon.url;
    val['text'] = icon.name;


    this.host._selectAndClose(val);
    this.host.close();
  }

  selectFontIcon(icon:any){
    let val = {};
    val['type'] = 'EXTRA';
    let id=this.toHex(icon.id.charCodeAt(0));
    val['value'] = 'EXTRA:' + icon.name + ':'+ id + ':' + icon.url;
    val['text'] = icon.name;
    this.host._selectAndClose(val);
    this.host.close();
  }
   toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
  }
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
