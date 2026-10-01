import { Component } from '@angular/core';

interface FeatureItem {
  icon: string;
  titleKey: string;
  descKey: string;
}

interface EcosystemItem {
  icon: string;
  titleKey: string;
  subtitleKey: string;
  descKey: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  readonly stats = [
    { value: '96', labelKey: 'HOME.STAT_MODULES_LABEL' },
    { value: '15', labelKey: 'HOME.STAT_CATEGORIES_LABEL' },
    { value: '100%', labelKey: 'HOME.STAT_DOCS_LABEL' },
    { value: '20+', labelKey: 'HOME.STAT_EXAMPLES_LABEL' },
  ];

  readonly ecosystem: EcosystemItem[] = [
    { icon: 'hub', titleKey: 'HOME.DOTOS_TITLE', subtitleKey: 'HOME.DOTOS_SUBTITLE', descKey: 'HOME.DOTOS_DESC' },
    { icon: 'widgets', titleKey: 'HOME.DUI_TITLE', subtitleKey: 'HOME.DUI_SUBTITLE', descKey: 'HOME.DUI_DESC', highlight: true },
    { icon: 'dashboard_customize', titleKey: 'HOME.DUIX_TITLE', subtitleKey: 'HOME.DUIX_SUBTITLE', descKey: 'HOME.DUIX_DESC' },
  ];

  readonly features: FeatureItem[] = [
    { icon: 'widgets', titleKey: 'HOME.FEATURE_1_TITLE', descKey: 'HOME.FEATURE_1_DESC' },
    { icon: 'translate', titleKey: 'HOME.FEATURE_2_TITLE', descKey: 'HOME.FEATURE_2_DESC' },
    { icon: 'palette', titleKey: 'HOME.FEATURE_3_TITLE', descKey: 'HOME.FEATURE_3_DESC' },
    { icon: 'language', titleKey: 'HOME.FEATURE_4_TITLE', descKey: 'HOME.FEATURE_4_DESC' },
    { icon: 'code', titleKey: 'HOME.FEATURE_5_TITLE', descKey: 'HOME.FEATURE_5_DESC' },
    { icon: 'construction', titleKey: 'HOME.FEATURE_6_TITLE', descKey: 'HOME.FEATURE_6_DESC' },
  ];

  readonly reasons: FeatureItem[] = [
    { icon: 'verified', titleKey: 'HOME.REASON_1_TITLE', descKey: 'HOME.REASON_1_DESC' },
    { icon: 'menu_book', titleKey: 'HOME.REASON_2_TITLE', descKey: 'HOME.REASON_2_DESC' },
    { icon: 'speed', titleKey: 'HOME.REASON_3_TITLE', descKey: 'HOME.REASON_3_DESC' },
    { icon: 'diversity_3', titleKey: 'HOME.REASON_4_TITLE', descKey: 'HOME.REASON_4_DESC' },
    { icon: 'hub', titleKey: 'HOME.REASON_5_TITLE', descKey: 'HOME.REASON_5_DESC' },
    { icon: 'verified_user', titleKey: 'HOME.REASON_6_TITLE', descKey: 'HOME.REASON_6_DESC' },
  ];

  readonly quickStartSnippet = `npm install @dotos/dui

import { ButtonModule } from '@dotos/dui/ui/button';

@NgModule({
  imports: [ButtonModule],
})
export class AppModule {}`;
}
