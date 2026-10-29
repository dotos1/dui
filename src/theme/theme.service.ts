/**
 * @fileoverview Module `src/theme/theme.service.ts` providing theme service definitions and implementation.
 * @zh 模块文件 `src/theme/theme.service.ts`，提供主题服务相关的定义与实现。
 */

import { Provider } from '@angular/core';
import { create, StyleSheet, Styles } from 'jss';
import jssPluginGlobal from 'jss-plugin-global';
import jssPluginNested  from 'jss-plugin-nested';
import { MatColors } from '@dotos/dui/core/color';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { ServiceLocator } from '@dotos/dui/core/services';

import { matCore } from './mat-core';
import { materialTheme } from './mat-theme';
import { Theme,Palette,TypographyConfig } from './interfaces';
import { DotosConfig } from './types';
import { matPalette } from './mat-palette';
import { matLightTheme } from './mat-light-theme';
import { matDarkTheme } from './mat-dark-theme';
import { TypographyMap } from './typography-theme';
import { matDarkBlueTheme } from './mat-darkblue-theme';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { BehaviorSubject } from 'rxjs';
/**
 * Constant/variable `jss` defining jss in `src/theme`.
 * @zh 常量/变量 `jss`，定义 `src/theme` 中的jss。
 */
const jss = create({ plugins: [jssPluginGlobal(), jssPluginNested()] });

/**
 * Executes `createMaterialCoreStyles` to handle create material core styles.
 * @zh 执行 `createMaterialCoreStyles`，用于创建Material核心样式集合。
 * @param typographyConfig - typography config parameter (`TypographyConfig`) / 排版配置参数（`TypographyConfig`）
 * @param override - override parameter (`Object`) / override参数（`Object`）
 * @param dynamic - dynamic parameter (`boolean`) / 动态参数（`boolean`）
 * @returns Result of type `StyleSheet<string>` / 类型为 `StyleSheet<string>` 的返回值
 */
export function createMaterialCoreStyles(typographyConfig: TypographyConfig = null, override: Object = {}, dynamic: boolean = false): StyleSheet<string> {
  const styles = {
    '@global': {
      ...(matCore(typographyConfig) as Record<string, unknown>),
      ...override
    }
  };
  return jss.createStyleSheet(styles as Styles, { link: dynamic });
}
/**
 * Executes `createMaterialThemeStyles` to handle create material theme styles.
 * @zh 执行 `createMaterialThemeStyles`，用于创建Material主题样式集合。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @param override - override parameter (`Object`) / override参数（`Object`）
 * @param dynamic - dynamic parameter (`boolean`) / 动态参数（`boolean`）
 * @returns Result of type `StyleSheet<string>` / 类型为 `StyleSheet<string>` 的返回值
 */
export function createMaterialThemeStyles(theme: Theme, override: Object = {}, dynamic: boolean = false): StyleSheet<string> {

  const styles = {
    '@global': {
      ...(materialTheme(theme) as Record<string, unknown>),
      ...override
    }
  };
  return jss.createStyleSheet(styles as Styles, { link: dynamic });
}

/**
 * Injectable Angular service `ThemeService` managing theme service state and operations in `src/theme`.
 * @zh 可注入的 Angular 服务 `ThemeService`，管理 `src/theme` 中的主题服务状态与业务操作。
 */
@Injectable()
export class ThemeService {

  /**
   * Property `_primaryStr` (`string`) storing primary str.
   * @zh 属性 `_primaryStr`（类型：`string`），用于存储或配置主色字符串。
   */
  private _primaryStr: string;
  /**
   * Property `_accentStr` (`string`) storing accent str.
   * @zh 属性 `_accentStr`（类型：`string`），用于存储或配置强调色字符串。
   */
  private _accentStr: string;
  /**
   * Property `_typography` (`string`) storing typography.
   * @zh 属性 `_typography`（类型：`string`），用于存储或配置排版。
   */
  private _typography: string;
  /**
   * Property `_warnStr` (`string`) storing warn str.
   * @zh 属性 `_warnStr`（类型：`string`），用于存储或配置警告色字符串。
   */
  private _warnStr: string;
  /**
   * Property `_type` (`string`) storing type.
   * @zh 属性 `_type`（类型：`string`），用于存储或配置类型。
   */
  private _type: string;
  /**
   * Property `_density` (`number`) storing density (default: `-1`).
   * @zh 属性 `_density`（类型：`number`），用于存储或配置密度（默认值：`-1`）。
   */
  private _density: number=-1;

  /**
   * Property `formType` (`BehaviorSubject<MatFormFieldAppearance>`) storing form type.
   * @zh 属性 `formType`（类型：`BehaviorSubject<MatFormFieldAppearance>`），用于存储或配置表单类型。
   */
  public formType: BehaviorSubject<MatFormFieldAppearance> = new BehaviorSubject<MatFormFieldAppearance>('fill');

  /**
   * Property `theme` (`Theme`) storing theme.
   * @zh 属性 `theme`（类型：`Theme`），用于存储或配置主题。
   */
  private theme: Theme;
  /**
   * Property `dotosConfig` (`DotosConfig`) storing dotos config.
   * @zh 属性 `dotosConfig`（类型：`DotosConfig`），用于存储或配置DotOS配置。
   */
  dotosConfig: DotosConfig;

  /**
   * Property `_coreStyleSheet` (`StyleSheet<string>`) storing core style sheet.
   * @zh 属性 `_coreStyleSheet`（类型：`StyleSheet<string>`），用于存储或配置核心样式Sheet。
   */
  private _coreStyleSheet?: StyleSheet<string>;
  /**
   * Property `_materialThemeStyleSheet` (`StyleSheet<string>`) storing material theme style sheet.
   * @zh 属性 `_materialThemeStyleSheet`（类型：`StyleSheet<string>`），用于存储或配置material主题样式Sheet。
   */
  private _materialThemeStyleSheet?: StyleSheet<string>;
  // 每个 themeFn 对应一张样式表：同一个组件重复 loadTheme 时才替换，
  // 不同组件的样式表必须共存，否则后加载的会把先加载的卸载掉。
  /**
   * Property `_loadedThemeStyleSheets` (`Map<(theme: Theme) => unknown, StyleSheet<string>>`) storing loaded theme style sheets (default: `new Map()`).
   * @zh 属性 `_loadedThemeStyleSheets`（类型：`Map<(theme: Theme) => unknown, StyleSheet<string>>`），用于存储或配置已加载主题样式Sheets（默认值：`new Map()`）。
   */
  private _loadedThemeStyleSheets: Map<(theme: Theme) => unknown, StyleSheet<string>> = new Map();

  /**
   * 未提供 dotosConfig（或其内容不可用）时使用的兜底主题配置。
   * @zh 未提供 dotosConfig（或其内容不可用）时使用的兜底主题配置。
   */
  private static readonly DEFAULT_CONFIG = {
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
      formType: 'fill',
      accent: "orange-800",
      type: "light",
      primary: "teal-600",
      warn: "red-800"
    }
  };

  /**
   * Property `instance` (`ThemeService`) storing instance (default: `null`).
   * @zh 属性 `instance`（类型：`ThemeService`），用于存储或配置实例（默认值：`null`）。
   */
  protected static instance: ThemeService = null;
  /**
   * Executes `getInstance` to handle get instance.
   * @zh 执行 `getInstance`，用于获取实例。
   * @returns Result of type `ThemeService` / 类型为 `ThemeService` 的返回值
   */
  public static getInstance(): ThemeService {
    if (ThemeService.instance === null) {
      let localStore: LocalStorageService = ServiceLocator.injector.get(LocalStorageService);
      ThemeService.instance = new ThemeService( localStore);
    }
    return ThemeService.instance;
  }

  /**
   * Creates an instance of `ThemeService` and initializes its dependencies and internal state.
   * @zh 创建 `ThemeService` 实例，并初始化其依赖项与内部状态。
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   */
  public constructor(    
    public localStore: LocalStorageService) {
    ThemeService.instance = this;
  }
 
  /**
   * Executes `refreshTheme` to handle refresh theme.
   * @zh 执行 `refreshTheme`，用于刷新主题。
   */
  refreshTheme(){
    // dotosConfig 来自 localStorage，是用户可篡改的输入：形状不完整时回落到默认配置，
    // 否则后续 config.theme.primary 之类的访问会抛 TypeError。
    const config = this.localStore.get("dotosConfig") as DotosConfig;
    this.setTheme(this.isUsableConfig(config) ? config : (ThemeService.DEFAULT_CONFIG as DotosConfig));
  }

  /**
   * Executes `isUsableConfig` to handle is usable config.
   * @zh 执行 `isUsableConfig`，用于是否为Usable配置。
   * @param config - config parameter (`DotosConfig`) / 配置参数（`DotosConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isUsableConfig(config: DotosConfig): boolean {
    return !!(config && config.theme && config.layout
      && config.theme.primary && config.theme.accent && config.theme.warn);
  }

  /**
   * Executes `getFormType` to handle get form type.
   * @zh 执行 `getFormType`，用于获取表单类型。
   */
  getFormType(){
    return this.formType.getValue();
  }

  /**
   * Executes `setTheme` to handle set theme.
   * @zh 执行 `setTheme`，用于集合主题。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
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

  /**
   * 把 `teal-600` 这类色名拆成基础色 + 色阶，构造成 Palette。

   * @zh 把 `teal-600` 这类色名拆成基础色 + 色阶，构造成 Palette。
   */
  private toPalette(colorStr: string): Palette {
    const separator = colorStr.lastIndexOf('-');
    const base = MatColors.getColor(colorStr.substring(0, separator));
    const hue = colorStr.substring(separator + 1, colorStr.length);
    return matPalette(base, hue, 100, 900);
  }

  /**
   * 依据当前 primary/accent/warn/typography 配置构造指定类型的主题。

   * @zh 依据当前 primary/accent/warn/typography 配置构造指定类型的主题。
   */
  private buildTheme(type: string): Theme {
    const primary = this.toPalette(this._primaryStr);
    const accent = this.toPalette(this._accentStr);
    const warn = this.toPalette(this._warnStr);
    const typographyConfig: TypographyConfig = TypographyMap[this._typography];

    if (type == 'dark') {
      return matDarkTheme(primary, accent, warn, this._density, typographyConfig);
    } else if (type == 'light') {
      return matLightTheme(primary, accent, warn, this._density, typographyConfig);
    }
    return matDarkBlueTheme(primary, accent, warn, this._density, typographyConfig);
  }

  /**
   * Executes `loadTheme` to handle load theme.
   * @zh 执行 `loadTheme`，用于加载主题。
   * @param themeFn - theme fn parameter (`(theme: Theme) => unknown`) / 主题函数参数（`(theme: Theme) => unknown`）
   */
  loadTheme(themeFn: (theme: Theme) => unknown): void {
    // loadTheme 可能先于任何 setTheme/changeTheme 被调用（例如应用启动阶段就打开了对话框
    // 或窗口组件），此时色板字段尚未初始化，需要先回落到默认配置而不是抛 TypeError。
    if (!this._primaryStr) {
      this.refreshTheme();
    }

    this.theme = this.buildTheme(this._type);
    const dynamicThemeStyles: boolean = true;
    this.removeStyleSheet(this._loadedThemeStyleSheets.get(themeFn));
    const styleSheet = this.createThemeStyles(this.theme, themeFn, dynamicThemeStyles);
    this._loadedThemeStyleSheets.set(themeFn, styleSheet);
    styleSheet.attach();
  }

  /**
   * Executes `removeStyleSheet` to handle remove style sheet.
   * @zh 执行 `removeStyleSheet`，用于移除样式Sheet。
   * @param styleSheet - style sheet parameter (`StyleSheet<string>`) / 样式Sheet参数（`StyleSheet<string>`）
   */
  private removeStyleSheet(styleSheet?: StyleSheet<string>) {
    if (styleSheet) {
      jss.removeStyleSheet(styleSheet);
    }
  }
  /**
   * Executes `createThemeStyles` to handle create theme styles.
   * @zh 执行 `createThemeStyles`，用于创建主题样式集合。
   * @param theme - theme parameter (`any`) / 主题参数（`any`）
   * @param themeFn - theme fn parameter (`(theme: Theme) => unknown`) / 主题函数参数（`(theme: Theme) => unknown`）
   * @param dynamicThemeStyles - dynamic theme styles parameter (`any`) / 动态主题样式集合参数（`any`）
   */
  createThemeStyles(theme, themeFn: (theme: Theme) => unknown, dynamicThemeStyles) {
    const styles = {
      '@global': {
        ...(this.getThemeStyle(themeFn, theme) as Record<string, unknown>)
      }
    };

    return jss.createStyleSheet(styles as Styles, { link: dynamicThemeStyles });
  }

  /**
   * Executes `getThemeStyle` to handle get theme style.
   * @zh 执行 `getThemeStyle`，用于获取主题样式。
   * @param themeFn - theme fn parameter (`(theme: Theme) => unknown`) / 主题函数参数（`(theme: Theme) => unknown`）
   * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  getThemeStyle(themeFn: (theme: Theme) => unknown, theme: Theme): Object {
    return {
      ...(themeFn(theme) as Record<string, unknown>)
    };
  }
  /**
   * Executes `changeThemeWithConfig` to handle change theme with config.
   * @zh 执行 `changeThemeWithConfig`，用于变更主题带有配置。
   * @param config - config parameter (`DotosConfig`) / 配置参数（`DotosConfig`）
   */
  changeThemeWithConfig(config: DotosConfig){
    let type = config.theme.type;
    let primary = config.theme.primary;
    let accent = config.theme.accent;
    let warn = config.theme.warn;
    let page = config.layout.pagemodel;
    let formType = config.theme.formType;
    this.changeTheme(primary, accent, warn, type, page,formType);
  }
  /**
   * Executes `changeTheme` to handle change theme.
   * @zh 执行 `changeTheme`，用于变更主题。
   * @param primaryStr - primary str parameter (`any`) / 主色字符串参数（`any`）
   * @param accentStr - accent str parameter (`any`) / 强调色字符串参数（`any`）
   * @param warnStr - warn str parameter (`any`) / 警告色字符串参数（`any`）
   * @param type - type parameter (`string`) / 类型参数（`string`）
   * @param typography - typography parameter (`string`) / 排版参数（`string`）
   * @param formType - form type parameter (`MatFormFieldAppearance`) / 表单类型参数（`MatFormFieldAppearance`）
   */
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

    this.theme = this.buildTheme(type);
    const themeOverrides: Object = {};
    const dynamicThemeStyles: boolean = true;

    this.removeStyleSheet(this._materialThemeStyleSheet);
    this._materialThemeStyleSheet = createMaterialThemeStyles(this.theme, themeOverrides, dynamicThemeStyles);
    this._materialThemeStyleSheet.attach();

    Array.from(this._loadedThemeStyleSheets.entries()).forEach(([themeFn, oldSheet]) => {
      this.removeStyleSheet(oldSheet);
      const newSheet = this.createThemeStyles(this.theme, themeFn, dynamicThemeStyles);
      this._loadedThemeStyleSheets.set(themeFn, newSheet);
      newSheet.attach();
    });
  }
  /**
   * Executes `getThemeByType` to handle get theme by type.
   * @zh 执行 `getThemeByType`，用于获取主题按类型。
   * @param type - type parameter (`string`) / 类型参数（`string`）
   */
  getThemeByType(type:string){
    if(type=='default'){
      return this.getTheme()
    }
    return this.buildTheme(type);
  }
  /**
   * Executes `getTheme` to handle get theme.
   * @zh 执行 `getTheme`，用于获取主题。
   */
  public getTheme(){
    return this.theme;
  }
}
/**
 * Constant/variable `THEME_SERVICE_PROVIDER` defining theme service provider in `src/theme`.
 * @zh 常量/变量 `THEME_SERVICE_PROVIDER`，定义 `src/theme` 中的主题服务提供者。
 */
export const THEME_SERVICE_PROVIDER: Provider = {
  provide: ThemeService,
  useFactory: (): ThemeService => {
    return ThemeService.getInstance();
  },
};
