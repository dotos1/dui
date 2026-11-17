/**
 * @fileoverview Module `projects/testdui/src/app/docs/components/live-template-stage/live-stackblitz.ts` building a minimal Angular 22 + `@dotos/dui` project and opening it on StackBlitz.
 * @zh 模块文件 `projects/testdui/src/app/docs/components/live-template-stage/live-stackblitz.ts`，在前端构造最小 Angular 22 + `@dotos/dui@^8.0.0` 工程，并通过隐藏表单 POST 到 StackBlitz 打开。
 */

import { LIVE_SANDBOX_IMPORTS, renderImportLines } from './live-sandbox.imports';

/**
 * Interface `StackblitzProjectInput` describing sandbox content to export.
 * @zh 接口 `StackblitzProjectInput`，导出到 StackBlitz 的沙箱内容。
 */
export interface StackblitzProjectInput {
  /**
   * Project title.
   * @zh 工程标题。
   */
  title: string;
  /**
   * Project description.
   * @zh 工程描述。
   */
  description: string;
  /**
   * Angular template source.
   * @zh Angular 模板源码。
   */
  template: string;
  /**
   * State JSON text.
   * @zh 状态 JSON 文本。
   */
  stateJson: string;
}

/**
 * Public npm scope of the library.
 * @zh 公网 npm 作用域。
 */
const PUBLIC_SCOPE = '@dotos/dui';

/**
 * Angular version range used by the exported project.
 * @zh 导出工程使用的 Angular 版本范围。
 */
const NG = '^22.2.0';

/**
 * Escapes a string for embedding into a TypeScript template literal.
 * @zh 转义字符串，以便嵌入 TypeScript 模板字符串。
 * @param text - Raw text / 原始文本
 * @returns Escaped text / 转义后的文本
 */
function escapeTemplateLiteral(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/**
 * Builds the standalone `AppComponent` source that mirrors the live sandbox.
 * @zh 生成与在线沙箱一致的独立组件 `AppComponent` 源码（可用于“完整 TypeScript 集成示例”）。
 * @param template - Angular template / Angular 模板
 * @param stateJson - State JSON text / 状态 JSON 文本
 * @param scope - Library scope / 库作用域
 * @returns TypeScript source / TypeScript 源码
 */
export function buildAppComponentSource(template: string, stateJson: string, scope: string): string {
  let stateLiteral: string;
  try {
    stateLiteral = JSON.stringify(JSON.parse(stateJson), null, 2).replace(/\n/g, '\n  ');
  } catch {
    stateLiteral = '{}';
  }
  const imports = renderImportLines(LIVE_SANDBOX_IMPORTS, scope);
  const symbols = LIVE_SANDBOX_IMPORTS.map((item) => item.symbol).join(',\n    ');
  const indentedTemplate = escapeTemplateLiteral(template)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');
  return `import { Component } from '@angular/core';
${imports}

/** 与 testdui 在线沙箱一致：模板中可直接使用 state 与 log(label, payload?) */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ${symbols},
  ],
  template: \`
${indentedTemplate}
  \`,
})
export class AppComponent {
  // 结构与沙箱「状态数据 JSON」一致，类型由字面量推断
  state = ${stateLiteral};

  log(label: string, payload?: unknown): void {
    console.log('[dui-live]', label, payload ?? '');
  }
}
`;
}

/**
 * Builds the file map of a minimal Angular 22 project.
 * @zh 生成最小 Angular 22 工程的文件映射。
 * @param input - Sandbox content / 沙箱内容
 * @returns File path → content / 文件路径到内容的映射
 */
export function buildStackblitzFiles(input: StackblitzProjectInput): Record<string, string> {
  const pkg = {
    name: 'dotos-dui-live-sandbox',
    private: true,
    scripts: { ng: 'ng', start: 'ng serve', build: 'ng build' },
    dependencies: {
      '@angular/animations': NG,
      '@angular/cdk': NG,
      '@angular/common': NG,
      '@angular/compiler': NG,
      '@angular/core': NG,
      '@angular/forms': NG,
      '@angular/material': NG,
      '@angular/platform-browser': NG,
      '@angular/router': NG,
      [PUBLIC_SCOPE]: '^8.0.0',
      'highlight.js': '^11.11.1',
      'lodash-es': '^4.17.21',
      mobx: '^6.0.0',
      moment: '^2.29.1',
      rxjs: '~7.8.1',
      tslib: '^2.3.1',
      'zone.js': '~0.15.1',
    },
    devDependencies: {
      '@angular/build': NG,
      '@angular/cli': NG,
      '@angular/compiler-cli': NG,
      typescript: '~6.0.3',
    },
  };
  const angularJson = {
    $schema: './node_modules/@angular/cli/lib/config/schema.json',
    version: 1,
    newProjectRoot: 'projects',
    projects: {
      demo: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        architect: {
          build: {
            builder: '@angular/build:application',
            options: {
              outputPath: 'dist/demo',
              index: 'src/index.html',
              browser: 'src/main.ts',
              polyfills: ['zone.js'],
              tsConfig: 'tsconfig.json',
              styles: ['@angular/material/prebuilt-themes/azure-blue.css', 'src/styles.css'],
            },
          },
          serve: { builder: '@angular/build:dev-server', options: { buildTarget: 'demo:build' } },
        },
      },
    },
  };
  const tsconfig = {
    compileOnSave: false,
    compilerOptions: {
      outDir: './dist/out-tsc',
      strict: false,
      skipLibCheck: true,
      experimentalDecorators: true,
      moduleResolution: 'bundler',
      module: 'ES2022',
      target: 'ES2022',
      lib: ['ES2022', 'dom'],
      useDefineForClassFields: false,
    },
    files: ['src/main.ts'],
  };
  const mainTs = `import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '${PUBLIC_SCOPE}/translator';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter([]),
    importProvidersFrom(TranslateModule.forRoot()),
  ],
}).catch((err: unknown) => console.error(err));
`;
  const indexHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>${input.title.replace(/</g, '&lt;')}</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  </head>
  <body class="mat-typography">
    <app-root></app-root>
  </body>
</html>
`;
  return {
    'package.json': JSON.stringify(pkg, null, 2),
    'angular.json': JSON.stringify(angularJson, null, 2),
    'tsconfig.json': JSON.stringify(tsconfig, null, 2),
    'src/main.ts': mainTs,
    'src/index.html': indexHtml,
    'src/styles.css': 'html, body { height: 100%; margin: 0; }\nbody { padding: 24px; background: #f1f5f9; font-family: Roboto, "Helvetica Neue", sans-serif; }\n',
    'src/app/app.component.ts': buildAppComponentSource(input.template, input.stateJson, PUBLIC_SCOPE),
  };
}

/**
 * Opens the project on StackBlitz via a hidden POST form (`https://stackblitz.com/run`).
 * @zh 构造隐藏的 `<form method="post" action="https://stackblitz.com/run" target="_blank">` 并提交，在新标签页打开工程。
 * @param input - Sandbox content / 沙箱内容
 * @param doc - Document to use / 使用的文档对象
 * @returns The submitted form element (already detached) / 已提交并移除的表单元素
 */
export function openInStackblitz(input: StackblitzProjectInput, doc: Document): HTMLFormElement {
  const form = doc.createElement('form');
  form.method = 'post';
  form.action = 'https://stackblitz.com/run';
  form.target = '_blank';
  form.style.display = 'none';
  form.setAttribute('data-testid', 'stackblitz-form');

  const fields: Record<string, string> = {
    'project[title]': input.title,
    'project[description]': input.description,
    'project[template]': 'node',
  };
  const files = buildStackblitzFiles(input);
  for (const [path, content] of Object.entries(files)) {
    fields[`project[files][${path}]`] = content;
  }
  for (const [name, value] of Object.entries(fields)) {
    const field = doc.createElement('input');
    field.type = 'hidden';
    field.name = name;
    field.value = value;
    form.appendChild(field);
  }
  doc.body.appendChild(form);
  try {
    form.submit();
  } finally {
    form.remove();
  }
  return form;
}
