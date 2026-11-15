# Dui

该工程基于 Angular CLI 18.1.0创建

# package

工程相关脚本配置

```json
`{`
  `"scripts": {`
    `"build-dui": "ng build dui --configuration production",`
    `"prebuild": "npm --no-git-tag-version version patch && cd dui  && npm --no-git-tag-version version patch",`
    `"npm_pack": "cd dist/dui && npm pack",`
    `"package": "npm run build-dui && npm run npm_pack",`
    `"publish": "cd dist/dui && npm publish  --ignore-scripts",`
    `"unpublish": "cd dist/dui && npm unpublish @dotos1/dui@latest  --force"`
  `}`
`}`
```

## 包命名与依赖导入规范（`@dotos1/*` 统一真名）

自 Angular 22 升级起，DotOS 全部前端库统一采用 `@dotos1/*` 真实包名发布与导入，**不再依赖 `npm:@dotos1/*` 包别名**：

1. **包名与二级入口**：本包发布名为 `@dotos1/dui`，所有跨入口及下游业务代码统一从 `@dotos1/dui/<category>/<module>` 导入（例如 `import { ThemeService } from '@dotos1/dui/theme'`、`@use '@dotos1/dui/theming/platform.scss'`），严禁继续书写旧作用域 `@dotos/dui`。
2. **`peerDependencies` 与宿主安装**：各下游库 `peerDependencies` 与宿主 `dependencies` 直接声明 `"@dotos1/dui": "^8.0.0-next.3"`（或对应版本范围），无需配置 `tsconfig` / Webpack / npm 别名映射。
3. **M2 动态主题根变量**：运行时 `ThemeService`（含 `matCoreTheme`）与静态 `platform.scss` 在 `html` 根节点同步输出动态主色/反白/软底容器/强调色/告警色变量（`--dui-theme-primary`、`--dui-theme-on-primary`、`--dui-theme-primary-container`、`--dui-theme-accent`、`--dui-theme-warn` 以及 Material 22 M2 实读令牌 `--mat-option-selected-state-label-text-color`、`--mat-stepper-header-selected-state-icon-foreground-color`、`--mat-form-field-error-text-color`、`--mat-slider-focus-state-layer-color`），严禁在 M2 主题下引用未定义的 `--mat-sys-*` M3 系统令牌。

# 操作

一般有变动后要进行以下操作：

1. 增加版本号
2. 编译工作
3. 发布类库
4. 提交代码

## Increase version number

增加小版本号

```shell
npm run  prebuild
```



## Build-dui

编译当前工程

```shell
npm run  build-dui
```



## publish

打包并发布类库

```
npm run  publish
```

