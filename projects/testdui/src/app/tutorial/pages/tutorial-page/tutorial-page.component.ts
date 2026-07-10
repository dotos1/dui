import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial-page',
  templateUrl: './tutorial-page.component.html',
  styleUrls: ['./tutorial-page.component.scss'],
})
export class TutorialPageComponent {
  readonly installSnippet = `# npm
npm install @dotos/dui

# yarn
yarn add @dotos/dui`;

  readonly peerDepsSnippet = `npm install @angular/animations @angular/cdk @angular/material`;

  readonly appModuleSnippet = `import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@dotos/dui/translator';
import { DotosConfigModule, dotosConfig } from '@dotos/dui/theme';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    DotosConfigModule.forRoot(dotosConfig),
  ],
})
export class AppModule {}`;

  readonly featureModuleSnippet = `import { ButtonModule } from '@dotos/dui/ui/button';
import { DatatableModule } from '@dotos/dui/data/datatable';

@NgModule({
  imports: [ButtonModule, DatatableModule],
})
export class FeatureModule {}`;

  readonly usageSnippet = `<dui-button [config]="{ text: '提交', type: 'raised', color: 'primary' }"
            (onClick)="submit()"></dui-button>`;

  readonly i18nSnippet = `constructor(private translation: TranslationService) {
  // register this module's own translation folder (zh_CN / en_US built in)
  this.translation.addTranslationFolder('dui', 'i18n');
}

// switch language
this.translation.use('en_US');`;

  readonly themeSnippet = `constructor(private themeService: ThemeService) {}

// primary, accent, warn accept any hex color; type is 'light' | 'dark'
this.themeService.changeTheme('#3f51b5', '#ff4081', '#f44336', 'light');`;
}
