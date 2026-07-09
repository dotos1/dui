import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'testdui';
  constructor(
    public themeService: ThemeService,
    protected dotosConfigService: DotosConfigService,
    @Inject(DOCUMENT) protected document: any,
  ) {
  }

  ngOnInit(): void {
    this.dotosConfigService.config
      .subscribe((config) => {
        this.setTheme(config);
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
