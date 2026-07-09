import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import { extractExport, buildSuggestedUsageSnippet, ApiExport } from './ts-ast-extract';
import { isFlagshipModule } from './flagship-modules';

// __dirname at runtime is the compiled output dir: projects/testdui/tools/.dist-tools
const REPO_ROOT = path.resolve(__dirname, '../../../..');
const SRC_ROOT = path.join(REPO_ROOT, 'src');
const OUT_ROOT = path.join(REPO_ROOT, 'projects/testdui/src/assets/docs-data');

interface EntryPoint {
  category: string;
  moduleId: string;
  importPath: string;
  entryFileAbs: string;
  dirAbs: string;
}

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

function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}

function computeEntryPoints(): EntryPoint[] {
  const ngPackageFiles = findNgPackageFiles(SRC_ROOT);
  const entryPoints: EntryPoint[] = [];

  for (const ngPackagePath of ngPackageFiles) {
    const dirAbs = path.dirname(ngPackagePath);
    const relDir = toPosix(path.relative(SRC_ROOT, dirAbs));

    if (relDir === '') {
      // Root `src/ng-package.json` (`@dotos/dui` bare entry) has no real exports
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
      importPath: `@dotos/dui/${relDir}`,
      entryFileAbs,
      dirAbs,
    });
  }

  return entryPoints;
}

function loadCompilerOptions(): ts.CompilerOptions {
  const configPath = path.join(REPO_ROOT, 'tsconfig.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  }
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, REPO_ROOT);
  return { ...parsed.options, noEmit: true };
}

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
    manifestCategories.set(id, { id, importPath: `@dotos/dui/${id}`, moduleCount: 0, modules: [] });
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
