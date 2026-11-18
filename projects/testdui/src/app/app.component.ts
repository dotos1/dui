/**
 * @fileoverview Module `projects/testdui/src/app/app.component.ts` providing app component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/app.component.ts`，提供app组件相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DotosConfigService, ThemeService } from '@dotos1/dui/theme';
import { TranslationService } from '@dotos1/dui/translator';
import { LocalStorageService } from '@dotos1/dui/core/storage';

/**
 * Constant/variable `DOTOS_CONFIG_STORAGE_KEY` defining dotos config storage key in `projects/testdui/src/app`.
 * @zh 常量/变量 `DOTOS_CONFIG_STORAGE_KEY`，定义 `projects/testdui/src/app` 中的DotOS配置存储键。
 */
const DOTOS_CONFIG_STORAGE_KEY = 'dotosConfig';

/**
 * Interface `LangOption` defining the contract and properties for lang option.
 * @zh 接口 `LangOption`，定义语言选项的数据结构契约与属性规范。
 */
interface LangOption {
  /**
   * Property `code` (`string`) storing code.
   * @zh 属性 `code`（类型：`string`），用于存储或配置编码。
   */
  code: string;
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;
}

/**
 * Angular component `AppComponent` (selector: 'app-root') providing app component presentation and interaction in `projects/testdui/src/app`.
 * @zh Angular 组件 `AppComponent`（selector: 'app-root'），提供App组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app`）。
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent {
  /**
   * Property `title` (`string`) storing title (default: `'testdui'`).
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题（默认值：`'testdui'`）。
   */
  title = 'testdui';

  /**
   * Property `langs` (`LangOption[]`) storing langs.
   * @zh 属性 `langs`（类型：`LangOption[]`），用于存储或配置语言。
   */
  readonly langs: LangOption[] = [
    { code: 'zh_CN', label: '简体中文' },
    { code: 'en_US', label: 'English' },
  ];

  /**
   * Creates an instance of `AppComponent` and initializes its dependencies and internal state.
   * @zh 创建 `AppComponent` 实例，并初始化其依赖项与内部状态。
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   * @param translation - Injected or initial translation (`TranslationService`) / 注入或传入的翻译文本（`TranslationService`）
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   * @param document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(
    public themeService: ThemeService,
    protected dotosConfigService: DotosConfigService,
    protected translation: TranslationService,
    protected localStore: LocalStorageService,
    @Inject(DOCUMENT) protected document: any,
  ) {
  }

  /**
   * Gets the current current lang label (`currentLangLabel: string`).
   * @zh 获取当前当前语言标签（`currentLangLabel: string`）。
   */
  get currentLangLabel(): string {
    const lang = this.langs.find((l) => l.code === this.translation.userLang);
    return lang ? lang.label : this.langs[0].label;
  }

  /**
   * Executes `switchLang` to handle switch lang.
   * @zh 执行 `switchLang`，用于切换开关语言。
   * @param code - code parameter (`string`) / 编码参数（`string`）
   */
  switchLang(code: string): void {
    this.translation.use(code).subscribe(() => {
      this.translation.userLang = code;
    });
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
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

  /**
   * Executes `setTheme` to handle set theme.
   * @zh 执行 `setTheme`，用于集合主题。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
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
