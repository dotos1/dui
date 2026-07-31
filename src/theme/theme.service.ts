import { Provider } from '@angular/core';
import { create, StyleSheet} from 'jss';
import jssPluginGlobal from 'jss-plugin-global';
import jssPluginNested  from 'jss-plugin-nested';
import { MatColors } from '@dotos/dui/core/color';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { ServiceLocator } from '@dotos/dui/core/services';

import { matCore } from './mat-core';
import { materialTheme } from './mat-theme';
import { Theme,Palette,TypographyConfig } from './interfaces';
import { matPalette } from './mat-palette';
import { matLightTheme } from './mat-light-theme';
import { matDarkTheme } from './mat-dark-theme';
import { TypographyMap } from './typography-theme';
import { matDarkBlueTheme } from './mat-darkblue-theme';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { BehaviorSubject } from 'rxjs';
 const jss :any=create({ plugins: [jssPluginGlobal(), jssPluginNested()] });
jss.use(jssPluginGlobal(),jssPluginNested ())

export function createMaterialCoreStyles(typographyConfig: TypographyConfig = null, override: Object = {}, dynamic: boolean = false): StyleSheet<any> {
  const styles = {
    '@global': {
      ...matCore(typographyConfig) as any,
      ...override
    }
  };
  return jss.createStyleSheet(styles, { link: dynamic });
}
export function createMaterialThemeStyles(theme: Theme, override: Object = {}, dynamic: boolean = false): StyleSheet<any> {

  const styles = {
    '@global': {
      ...materialTheme(theme) as any,
      ...override
    }
  };
  return jss.createStyleSheet(styles, { link: dynamic });
}

@Injectable()
export class ThemeService {

  private _primaryStr: string;
  private _accentStr: string;
  private _typography: string;
  private _warnStr: string;
  private _type: string;
  private _density: number=-1;

  public formType: BehaviorSubject<MatFormFieldAppearance> = new BehaviorSubject<MatFormFieldAppearance>('fill');

  private theme: Theme;
  dotosConfig: any;

  private _coreStyleSheet?: StyleSheet<any>;
  private _materialThemeStyleSheet?: StyleSheet<any>;
  // 每个 themeFn 对应一张样式表：同一个组件重复 loadTheme 时才替换，
  // 不同组件的样式表必须共存，否则后加载的会把先加载的卸载掉。
  private _loadedThemeStyleSheets: Map<any, StyleSheet<any>> = new Map();

  protected static instance: ThemeService = null;
  public static getInstance(): ThemeService {
    if (ThemeService.instance === null) {
      let localStore: LocalStorageService = ServiceLocator.injector.get(LocalStorageService);
      ThemeService.instance = new ThemeService( localStore);
    }
    return ThemeService.instance;
  }

  public constructor(    
    public localStore: LocalStorageService) {
    ThemeService.instance = this;
  }
 
  refreshTheme(){
    const config:any = this.localStore.get("dotosConfig");
    if (config) {
      this.setTheme(config);
    } else {
      this.setTheme(
        {
          isDesktop: false,
          layout: {
            folded: false,
            pagemodel: "compact",
            sidepanel: {
              hidden: false,
              position: "right"
            },
            style: "horizontal-layout",
            variant: "vertical",
            width: "fullwidth",
          },
          routerAnimation: "none",
          theme: {
            formType:'fill',
            accent: "orange-800",
            type:"light",
            primary: "teal-600",
            warn: "red-800"
          }
        })
    }
  }

  getFormType(){
    return this.formType.getValue();
  }

  setTheme(config) {
    this.dotosConfig = config;
    const primary = this.dotosConfig.theme.primary;
    const accent = this.dotosConfig.theme.accent;
    const warn = this.dotosConfig.theme.warn;
    const page = this.dotosConfig.layout.pagemodel;
    const type = this.dotosConfig.theme.type;
    const formType = this.dotosConfig.theme.formType;

    this.changeTheme(primary, accent, warn, type, page,formType);
  }

  loadTheme(themeFn: any): void {

    let p = MatColors.getColor(this._primaryStr.substring(0, this._primaryStr.lastIndexOf('-')));
    let a = MatColors.getColor(this._accentStr.substring(0, this._accentStr.lastIndexOf('-')));
    let w = MatColors.getColor(this._warnStr.substring(0, this._warnStr.lastIndexOf('-')));

    const po = this._primaryStr.substring(this._primaryStr.lastIndexOf('-') + 1, this._primaryStr.length);
    const ao = this._accentStr.substring(this._accentStr.lastIndexOf('-') + 1, this._accentStr.length);
    const wo = this._warnStr.substring(this._warnStr.lastIndexOf('-') + 1, this._warnStr.length);

    const primary: Palette = matPalette(p, po, 100, 900);
    const accent: Palette = matPalette(a, ao, 100, 900);
    const warn: Palette = matPalette(w, wo, 100, 900);
    const typographyConfig: TypographyConfig = TypographyMap[ this._typography];
  
    if (this._type=='dark') {
      this.theme = matDarkTheme(primary, accent, warn,this._density,typographyConfig);
    } else if (this._type=='light')   {
      this.theme = matLightTheme(primary, accent, warn,this._density,typographyConfig);
    }else {
      this.theme = matDarkBlueTheme(primary, accent, warn,this._density,typographyConfig);
    }
    const dynamicThemeStyles: boolean = true;
    this.removeStyleSheet(this._loadedThemeStyleSheets.get(themeFn));
    const styleSheet = this.createThemeStyles(this.theme, themeFn, dynamicThemeStyles);
    this._loadedThemeStyleSheets.set(themeFn, styleSheet);
    styleSheet.attach();
  }

  private removeStyleSheet(styleSheet?: StyleSheet<any>) {
    if (styleSheet) {
      jss.removeStyleSheet(styleSheet);
    }
  }
  createThemeStyles(theme, themeFn: any, dynamicThemeStyles) {
    const styles = {
      '@global': {
        ...this.getThemeStyle(themeFn, theme) as any
      }
    };

    return jss.createStyleSheet(styles, { link: dynamicThemeStyles });
  }

  getThemeStyle(themeFn: any, theme: Theme): Object {
    return {
      ...themeFn(theme)
    };
  }
  changeThemeWithConfig(config:any){
    let type = config.theme.type;
    let primary = config.theme.primary;
    let accent = config.theme.accent;
    let warn = config.theme.warn;
    let page = config.layout.pagemodel;
    let formType = config.theme.formType;
    this.changeTheme(primary, accent, warn, type, page,formType);
  }
  changeTheme(primaryStr, accentStr, warnStr, type: string, typography: string,formType:MatFormFieldAppearance): void {
    this._primaryStr = primaryStr;
    this._accentStr = accentStr;
    this._warnStr = warnStr;
    this._type = type;
    this._typography = typography;
    this._density=typography=='loose'?0 : typography === 'normal' ?-1:-2;
    this.formType.next( formType);

    const typographyConfig: TypographyConfig = TypographyMap[typography];
    const coreOverrides: Object = {};
    const dynamicCoreStyles = true;
    this.removeStyleSheet(this._coreStyleSheet);
    this._coreStyleSheet = createMaterialCoreStyles(typographyConfig, coreOverrides, dynamicCoreStyles);
    this._coreStyleSheet.attach();

    let p = MatColors.getColor(primaryStr.substring(0, primaryStr.lastIndexOf('-')));
    let a = MatColors.getColor(accentStr.substring(0, accentStr.lastIndexOf('-')));
    let w = MatColors.getColor(warnStr.substring(0, warnStr.lastIndexOf('-')));

    const po = primaryStr.substring(primaryStr.lastIndexOf('-') + 1, primaryStr.length);
    const ao = accentStr.substring(accentStr.lastIndexOf('-') + 1, accentStr.length);
    const wo = warnStr.substring(warnStr.lastIndexOf('-') + 1, warnStr.length);

    const primary: Palette = matPalette(p, po, 100, 900);
    const accent: Palette = matPalette(a, ao, 100, 900);
    const warn: Palette = matPalette(w, wo, 100, 900);
    if (type=='dark') {
      this.theme = matDarkTheme(primary, accent, warn,this._density,typographyConfig);
    } else if (type=='light')   {
      this.theme = matLightTheme(primary, accent, warn,this._density,typographyConfig);
    }else {
      this.theme = matDarkBlueTheme(primary, accent, warn,this._density,typographyConfig);
    }
    const themeOverrides: Object = {};
    const dynamicThemeStyles: boolean = true;

    this.removeStyleSheet(this._materialThemeStyleSheet);
    this._materialThemeStyleSheet = createMaterialThemeStyles(this.theme, themeOverrides, dynamicThemeStyles);
    this._materialThemeStyleSheet.attach();
  }
  getThemeByType(type:string){
    if(type=='default'){
      return this.getTheme()
    }else{
      let p = MatColors.getColor( this._primaryStr.substring(0,  this._primaryStr.lastIndexOf('-')));
      let a = MatColors.getColor( this._accentStr.substring(0,  this._accentStr.lastIndexOf('-')));
      let w = MatColors.getColor( this._warnStr .substring(0,  this._warnStr .lastIndexOf('-')));
  
      const po =  this._primaryStr.substring( this._primaryStr.lastIndexOf('-') + 1,  this._primaryStr.length);
      const ao =  this._accentStr.substring( this._accentStr.lastIndexOf('-') + 1,  this._accentStr.length);
      const wo =  this._warnStr .substring( this._warnStr .lastIndexOf('-') + 1,  this._warnStr .length);
  
      const primary: Palette = matPalette(p, po, 100, 900);
      const accent: Palette = matPalette(a, ao, 100, 900);
      const warn: Palette = matPalette(w, wo, 100, 900);

      const typographyConfig: TypographyConfig = TypographyMap[ this._typography];
  
      if (type=='dark') {
        return  matDarkTheme(primary, accent, warn,this._density,typographyConfig);
      } else if (type=='light')   {
        return  matLightTheme(primary, accent, warn,this._density,typographyConfig);
      }else {
        return matDarkBlueTheme(primary, accent, warn,this._density,typographyConfig);
      }
    }
  }
  public getTheme(){
    return this.theme;
  }
}
export const THEME_SERVICE_PROVIDER: Provider = {
  provide: ThemeService,
  useFactory: (): ThemeService => {
    return ThemeService.getInstance();
  },
};
