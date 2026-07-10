import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';
import { TranslationService } from '@dotos/dui/translator';
import { LocalStorageService } from '@dotos/dui/core/storage';

const DOTOS_CONFIG_STORAGE_KEY = 'dotosConfig';

interface LangOption {
  code: string;
  label: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'testdui';

  readonly langs: LangOption[] = [
    { code: 'zh_CN', label: '简体中文' },
    { code: 'en_US', label: 'English' },
  ];

  constructor(
    public themeService: ThemeService,
    protected dotosConfigService: DotosConfigService,
    protected translation: TranslationService,
    protected localStore: LocalStorageService,
    @Inject(DOCUMENT) protected document: any,
  ) {
  }

  get currentLangLabel(): string {
    const lang = this.langs.find((l) => l.code === this.translation.userLang);
    return lang ? lang.label : this.langs[0].label;
  }

  switchLang(code: string): void {
    this.translation.use(code).subscribe(() => {
      this.translation.userLang = code;
    });
  }

  ngOnInit(): void {
    const savedConfig = this.localStore.get(DOTOS_CONFIG_STORAGE_KEY);
    if (savedConfig) {
      this.dotosConfigService.config = savedConfig;
    }

    this.dotosConfigService.config
      .subscribe((config) => {
        this.setTheme(config);
        this.localStore.set(DOTOS_CONFIG_STORAGE_KEY, config);
    });
  }

  setTheme(config) {

    if (config.layout.width === 'boxed') {
      this.document.body.classList.add('boxed');
    } else {
      this.document.body.classList.remove('boxed');
    }
    const type = config.theme.type;
    const primary = config.theme.primary;
    const accent = config.theme.accent;
    const warn = config.theme.warn;
    const page = config.layout.pagemodel;
    const formType = config.theme.formType;
    this.themeService.changeTheme(primary, accent, warn, type, page,formType);
  }
}
