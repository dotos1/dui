/**
 * @fileoverview Module `projects/testdui/src/app/home/pages/home-page/home-page.component.ts` providing home page component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/home/pages/home-page/home-page.component.ts`，提供home页面组件相关的定义与实现。
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Interface `FeatureItem` defining the contract and properties for feature item.
 * @zh 接口 `FeatureItem`，定义Feature条目的数据结构契约与属性规范。
 */
interface FeatureItem {
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon: string;
  /**
   * Property `titleKey` (`string`) storing title key.
   * @zh 属性 `titleKey`（类型：`string`），用于存储或配置标题键。
   */
  titleKey: string;
  /**
   * Property `descKey` (`string`) storing desc key.
   * @zh 属性 `descKey`（类型：`string`），用于存储或配置描述键。
   */
  descKey: string;
}

/**
 * Interface `EcosystemItem` defining the contract and properties for ecosystem item.
 * @zh 接口 `EcosystemItem`，定义Ecosystem条目的数据结构契约与属性规范。
 */
interface EcosystemItem {
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon: string;
  /**
   * Property `titleKey` (`string`) storing title key.
   * @zh 属性 `titleKey`（类型：`string`），用于存储或配置标题键。
   */
  titleKey: string;
  /**
   * Property `subtitleKey` (`string`) storing subtitle key.
   * @zh 属性 `subtitleKey`（类型：`string`），用于存储或配置副标题键。
   */
  subtitleKey: string;
  /**
   * Property `descKey` (`string`) storing desc key.
   * @zh 属性 `descKey`（类型：`string`），用于存储或配置描述键。
   */
  descKey: string;
  /**
   * Property `highlight` (`boolean`) storing highlight.
   * @zh 属性 `highlight`（类型：`boolean`），用于存储或配置highlight。
   */
  highlight?: boolean;
}

/**
 * Angular component `HomePageComponent` (selector: 'app-home-page') providing home page component presentation and interaction in `projects/testdui/src/app/home/pages/home-page`.
 * @zh Angular 组件 `HomePageComponent`（selector: 'app-home-page'），提供Home页面组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/home/pages/home-page`）。
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HomePageComponent {
  /**
   * Property `stats` (`any[]`) storing stats.
   * @zh 属性 `stats`（类型：`any[]`），用于存储或配置stats。
   */
  readonly stats = [
    { value: '96', labelKey: 'HOME.STAT_MODULES_LABEL' },
    { value: '15', labelKey: 'HOME.STAT_CATEGORIES_LABEL' },
    { value: '100%', labelKey: 'HOME.STAT_DOCS_LABEL' },
    { value: '25+', labelKey: 'HOME.STAT_EXAMPLES_LABEL' },
  ];

  /**
   * Property `ecosystem` (`EcosystemItem[]`) storing ecosystem.
   * @zh 属性 `ecosystem`（类型：`EcosystemItem[]`），用于存储或配置ecosystem。
   */
  readonly ecosystem: EcosystemItem[] = [
    { icon: 'hub', titleKey: 'HOME.DOTOS_TITLE', subtitleKey: 'HOME.DOTOS_SUBTITLE', descKey: 'HOME.DOTOS_DESC' },
    { icon: 'widgets', titleKey: 'HOME.DUI_TITLE', subtitleKey: 'HOME.DUI_SUBTITLE', descKey: 'HOME.DUI_DESC', highlight: true },
    { icon: 'dashboard_customize', titleKey: 'HOME.DUIX_TITLE', subtitleKey: 'HOME.DUIX_SUBTITLE', descKey: 'HOME.DUIX_DESC' },
  ];

  /**
   * Property `features` (`FeatureItem[]`) storing features.
   * @zh 属性 `features`（类型：`FeatureItem[]`），用于存储或配置features。
   */
  readonly features: FeatureItem[] = [
    { icon: 'widgets', titleKey: 'HOME.FEATURE_1_TITLE', descKey: 'HOME.FEATURE_1_DESC' },
    { icon: 'translate', titleKey: 'HOME.FEATURE_2_TITLE', descKey: 'HOME.FEATURE_2_DESC' },
    { icon: 'palette', titleKey: 'HOME.FEATURE_3_TITLE', descKey: 'HOME.FEATURE_3_DESC' },
    { icon: 'language', titleKey: 'HOME.FEATURE_4_TITLE', descKey: 'HOME.FEATURE_4_DESC' },
    { icon: 'code', titleKey: 'HOME.FEATURE_5_TITLE', descKey: 'HOME.FEATURE_5_DESC' },
    { icon: 'construction', titleKey: 'HOME.FEATURE_6_TITLE', descKey: 'HOME.FEATURE_6_DESC' },
  ];

  /**
   * Property `reasons` (`FeatureItem[]`) storing reasons.
   * @zh 属性 `reasons`（类型：`FeatureItem[]`），用于存储或配置reasons。
   */
  readonly reasons: FeatureItem[] = [
    { icon: 'verified', titleKey: 'HOME.REASON_1_TITLE', descKey: 'HOME.REASON_1_DESC' },
    { icon: 'menu_book', titleKey: 'HOME.REASON_2_TITLE', descKey: 'HOME.REASON_2_DESC' },
    { icon: 'speed', titleKey: 'HOME.REASON_3_TITLE', descKey: 'HOME.REASON_3_DESC' },
    { icon: 'diversity_3', titleKey: 'HOME.REASON_4_TITLE', descKey: 'HOME.REASON_4_DESC' },
    { icon: 'hub', titleKey: 'HOME.REASON_5_TITLE', descKey: 'HOME.REASON_5_DESC' },
    { icon: 'verified_user', titleKey: 'HOME.REASON_6_TITLE', descKey: 'HOME.REASON_6_DESC' },
  ];

  /**
   * Property `quickStartSnippet` (`string`) storing quick start snippet.
   * @zh 属性 `quickStartSnippet`（类型：`string`），用于存储或配置quick开始Snippet。
   */
  readonly quickStartSnippet = `npm install @dotos/dui

import { ButtonModule } from '@dotos/dui/ui/button';

@NgModule({
  imports: [ButtonModule],
})
export class AppModule {}`;
}
