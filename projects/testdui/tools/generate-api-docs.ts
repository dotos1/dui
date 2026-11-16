/**
 * @fileoverview Module `projects/testdui/tools/generate-api-docs.ts` providing generate api docs definitions and implementation.
 * @zh 模块文件 `projects/testdui/tools/generate-api-docs.ts`，提供生成API接口文档相关的定义与实现。
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import { extractExport, buildSuggestedUsageSnippet, ApiExport } from './ts-ast-extract';
import { isFlagshipModule } from './flagship-modules';

// __dirname at runtime is the compiled output dir: projects/testdui/tools/.dist-tools
/**
 * Constant/variable `REPO_ROOT` defining repo root in `projects/testdui/tools`.
 * @zh 常量/变量 `REPO_ROOT`，定义 `projects/testdui/tools` 中的REPO根节点。
 */
const REPO_ROOT = path.resolve(__dirname, '../../../..');
/**
 * Constant/variable `SRC_ROOT` defining src root in `projects/testdui/tools`.
 * @zh 常量/变量 `SRC_ROOT`，定义 `projects/testdui/tools` 中的源路径根节点。
 */
const SRC_ROOT = path.join(REPO_ROOT, 'src');
/**
 * Constant/variable `OUT_ROOT` defining out root in `projects/testdui/tools`.
 * @zh 常量/变量 `OUT_ROOT`，定义 `projects/testdui/tools` 中的输出根节点。
 */
const OUT_ROOT = path.join(REPO_ROOT, 'projects/testdui/src/assets/docs-data');

/**
 * Interface `EntryPoint` defining the contract and properties for entry point.
 * @zh 接口 `EntryPoint`，定义条目坐标点的数据结构契约与属性规范。
 */
interface EntryPoint {
  /**
   * Property `category` (`string`) storing category.
   * @zh 属性 `category`（类型：`string`），用于存储或配置分类。
   */
  category: string;
  /**
   * Property `moduleId` (`string`) storing module id.
   * @zh 属性 `moduleId`（类型：`string`），用于存储或配置模块唯一标识。
   */
  moduleId: string;
  /**
   * Property `importPath` (`string`) storing import path.
   * @zh 属性 `importPath`（类型：`string`），用于存储或配置导入路径。
   */
  importPath: string;
  /**
   * Property `entryFileAbs` (`string`) storing entry file abs.
   * @zh 属性 `entryFileAbs`（类型：`string`），用于存储或配置条目文件绝对值。
   */
  entryFileAbs: string;
  /**
   * Property `dirAbs` (`string`) storing dir abs.
   * @zh 属性 `dirAbs`（类型：`string`），用于存储或配置目录绝对值。
   */
  dirAbs: string;
}

/**
 * Executes `findNgPackageFiles` to handle find ng package files.
 * @zh 执行 `findNgPackageFiles`，用于查找AngularPackage文件列表。
 * @param dir - dir parameter (`string`) / 目录参数（`string`）
 * @param results - results parameter (`string[]`) / 结果参数（`string[]`）
 * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
 */
function findNgPackageFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findNgPackageFiles(full, results);
    } else if (entry.name === 'ng-package.json') {
      results.push(full);
    }
  }
  return results;
}

/**
 * Executes `toPosix` to handle to posix.
 * @zh 执行 `toPosix`，用于转换为Posix。
 * @param p - p parameter (`string`) / p参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}

/**
 * Executes `computeEntryPoints` to handle compute entry points.
 * @zh 执行 `computeEntryPoints`，用于计算条目点集合。
 * @returns Result of type `EntryPoint[]` / 类型为 `EntryPoint[]` 的返回值
 */
function computeEntryPoints(): EntryPoint[] {
  const ngPackageFiles = findNgPackageFiles(SRC_ROOT);
  const entryPoints: EntryPoint[] = [];

  for (const ngPackagePath of ngPackageFiles) {
    const dirAbs = path.dirname(ngPackagePath);
    const relDir = toPosix(path.relative(SRC_ROOT, dirAbs));

    if (relDir === '') {
      // Root `src/ng-package.json` (`@dotos1/dui` bare entry) has no real exports
      // (public-api.ts is a placeholder `export default {}`) — skip it.
      continue;
    }

    const raw = JSON.parse(fs.readFileSync(ngPackagePath, 'utf8'));
    const entryFile: string = raw?.lib?.entryFile ?? 'index.ts';
    const entryFileAbs = path.join(dirAbs, entryFile);
    if (!fs.existsSync(entryFileAbs)) {
      console.warn(`[docs:generate] entryFile not found, skipping: ${entryFileAbs}`);
      continue;
    }

    const segments = relDir.split('/');
    const category = segments[0];
    const rest = segments.slice(1);
    const moduleId = rest.length ? rest.join('--') : 'index';

    entryPoints.push({
      category,
      moduleId,
      importPath: `@dotos1/dui/${relDir}`,
      entryFileAbs,
      dirAbs,
    });
  }

  return entryPoints;
}

/**
 * Executes `loadCompilerOptions` to handle load compiler options.
 * @zh 执行 `loadCompilerOptions`，用于加载Compiler配置选项。
 * @returns Result of type `ts.CompilerOptions` / 类型为 `ts.CompilerOptions` 的返回值
 */
function loadCompilerOptions(): ts.CompilerOptions {
  const configPath = path.join(REPO_ROOT, 'tsconfig.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  }
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, REPO_ROOT);
  return { ...parsed.options, noEmit: true };
}

/**
 * Constant/variable `ALL_CATEGORY_IDS` defining all category ids in `projects/testdui/tools`.
 * @zh 常量/变量 `ALL_CATEGORY_IDS`，定义 `projects/testdui/tools` 中的全部分类标识列表。
 */
const ALL_CATEGORY_IDS = [
  'base',
  'common',
  'container',
  'core',
  'data',
  'form',
  'i18n',
  'net',
  'theme',
  'theming',
  'translator',
  'tree',
  'ui',
  'util',
  'ux',
];

/**
 * Executes `main` to handle main.
 * @zh 执行 `main`，用于主。
 */
function main(): void {
  let entryPoints = computeEntryPoints();
  console.log(`[docs:generate] found ${entryPoints.length} entry points`);

  // For local debugging: DOCS_GEN_FILTER="ui/button,theme,ux/markdown" npm run docs:generate
  const filter = process.env['DOCS_GEN_FILTER'];
  if (filter) {
    const wanted = new Set(filter.split(','));
    entryPoints = entryPoints.filter((e) => wanted.has(toPosix(path.relative(SRC_ROOT, e.dirAbs))));
    console.log(`[docs:generate] DOCS_GEN_FILTER active, narrowed to ${entryPoints.length} entry points`);
  }

  const compilerOptions = loadCompilerOptions();
  const program = ts.createProgram({
    rootNames: entryPoints.map((e) => e.entryFileAbs),
    options: compilerOptions,
  });
  const checker = program.getTypeChecker();

  fs.mkdirSync(OUT_ROOT, { recursive: true });

  const manifestCategories = new Map<
    string,
    { id: string; importPath: string; moduleCount: number; modules: any[] }
  >();
  for (const id of ALL_CATEGORY_IDS) {
    manifestCategories.set(id, { id, importPath: `@dotos1/dui/${id}`, moduleCount: 0, modules: [] });
  }

  let failures = 0;

  for (const entry of entryPoints) {
    try {
      const sourceFile = program.getSourceFile(entry.entryFileAbs);
      if (!sourceFile) {
        console.warn(`[docs:generate] could not load source file for ${entry.importPath}`);
        failures++;
        continue;
      }
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
      if (!moduleSymbol) {
        console.warn(`[docs:generate] no module symbol for ${entry.importPath} (likely no exports)`);
        continue;
      }
      const exportSymbols = checker.getExportsOfModule(moduleSymbol);

      const exports: ApiExport[] = [];
      const seen = new Set<string>();
      for (const symbol of exportSymbols) {
        try {
          const record = extractExport(symbol, checker, REPO_ROOT);
          if (record && !seen.has(record.name)) {
            seen.add(record.name);
            exports.push(record);
          }
        } catch (err) {
          console.warn(`[docs:generate] failed to extract ${symbol.getName()} in ${entry.importPath}: ${err}`);
        }
      }

      exports.sort((a, b) => a.name.localeCompare(b.name));

      const moduleApiFile = {
        importPath: entry.importPath,
        exports,
        suggestedUsageSnippet: buildSuggestedUsageSnippet(entry.importPath, exports),
      };

      const outDir = path.join(OUT_ROOT, entry.category);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(
        path.join(outDir, `${entry.moduleId}.json`),
        JSON.stringify(moduleApiFile, null, 2)
      );

      const category = manifestCategories.get(entry.category);
      if (!category) {
        console.warn(`[docs:generate] unexpected category "${entry.category}", skipping manifest entry`);
        continue;
      }
      category.moduleCount++;
      category.modules.push({
        id: entry.moduleId,
        importPath: entry.importPath,
        dataFile: `docs-data/${entry.category}/${entry.moduleId}.json`,
        exportedClassCount: exports.length,
        isFlagship: isFlagshipModule(entry.category, entry.moduleId),
      });
    } catch (err) {
      failures++;
      console.error(`[docs:generate] FAILED on ${entry.importPath}:`, err);
    }
  }

  if (!filter) {
    const resourceCategories: Array<{ category: string; importPath: string; exports: ApiExport[]; snippet: string }> = [
      {
        category: 'i18n',
        importPath: '@dotos1/dui/i18n',
        exports: [
          {
            name: 'DUI_LOCALE_BUNDLES',
            kind: 'constant',
            summary: '12 built-in locale dictionary bundles (zh_CN, zh_TW, en_US, ja_JP, ko_KR, fr_FR, de_DE, es_419, pt_BR, ru_RU, id_ID, ar_SA) for @dotos1/dui.',
            summaryZh: '@dotos1/dui 内置 12 语种国际化字典资源包（zh_CN、zh_TW、en_US、ja_JP、ko_KR、fr_FR、de_DE、es_419、pt_BR、ru_RU、id_ID、ar_SA）。',
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
            sourceFile: 'src/i18n/dui/zh_CN.json',
          },
        ],
        snippet: `import { TranslationService } from '@dotos1/dui/translator';\n\n// Switch active locale across all DUI components:\ntranslationService.use('zh_CN');`,
      },
      {
        category: 'theming',
        importPath: '@dotos1/dui/theming',
        exports: [
          {
            name: 'dui-platform-theme',
            kind: 'function',
            summary: 'SCSS theme architecture providing Material MDC palette tokens, dark/light mode CSS variables, and typography rules.',
            summaryZh: '@dotos1/dui 平台级 SCSS 主题系统，提供 Material MDC 调色板令牌、深浅色 CSS 变量与排版规范。',
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
            sourceFile: 'src/theming/platform.scss',
          },
        ],
        snippet: `@use '@dotos1/dui/theming/platform.scss';\n@import '@dotos1/dui/theming/dui/colors';`,
      },
    ];
    for (const rc of resourceCategories) {
      const cat = manifestCategories.get(rc.category);
      if (cat && cat.moduleCount === 0) {
        const outDir = path.join(OUT_ROOT, rc.category);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(
          path.join(outDir, 'index.json'),
          JSON.stringify({ importPath: rc.importPath, exports: rc.exports, suggestedUsageSnippet: rc.snippet }, null, 2)
        );
        cat.moduleCount = 1;
        cat.modules.push({
          id: 'index',
          importPath: rc.importPath,
          dataFile: `docs-data/${rc.category}/index.json`,
          exportedClassCount: rc.exports.length,
          isFlagship: isFlagshipModule(rc.category, 'index'),
        });
      }
    }
  }

  for (const category of manifestCategories.values()) {
    category.modules.sort((a, b) => a.id.localeCompare(b.id));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    categories: ALL_CATEGORY_IDS.map((id) => manifestCategories.get(id)),
  };
  fs.writeFileSync(path.join(OUT_ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(
    `[docs:generate] done. ${entryPoints.length - failures}/${entryPoints.length} entry points succeeded.`
  );
  if (failures > 0) {
    process.exitCode = 1;
  }
}

main();
