## 概述

`translator` 是国际化/翻译运行时（`ngx-translate` 的内部分支），提供 `TranslateModule`/`TranslateService`/`TranslateDirective`/`TranslatePipe`，以及更高层的 `TranslationService`（管理多个"翻译资源文件夹"的加载）。

## 何时使用

在 `AppModule` 里通过 `TranslateModule.forRoot()` 全局引入一次。库内很多模块（表单、树、对话框等）会在自己的 `NgModule` 构造函数里调用 `translationService.addTranslationFolder(folderName, 'i18n')`，这会向 `i18n/<folderName>/<lang>.json` 发起请求——如果你在自己的应用里复用了这些库模块，记得把库自带的 `src/i18n/dui` 翻译资源也拷贝进你的应用构建产物（详见 `angular.json` 的 `assets` 配置）。
