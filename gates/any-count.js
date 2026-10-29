#!/usr/bin/env node
/**
 * G-ANY v2 —— 用 TypeScript 类型检查器统计「真实的 any」，棘轮只许降不许升。
 *
 * v1 只数源码里的 `any` 关键字，删掉注解（strict:false 下变成隐式 any）、
 * 改写成 `ReturnType<typeof JSON.parse>`、`type X = any` 别名都能让它归零，没有区分力。
 * v2 建完整的 ts.Program，用 checker 判断：
 *
 *   any 计数（三类之和）：
 *     1. 源码里写出的类型节点，解析结果是 any：`any`、`any[]` 里的 any、`as any`、
 *        `Array<any>`、`ReturnType<typeof JSON.parse>`、指向 any 的别名……
 *        （命中后不再往里数，一个节点只算一次）
 *     2. 没写类型注解、checker 推断为 any 的声明：参数、属性、变量
 *        （隐式 any，含 `const x = JSON.parse(s)` 这类）；catch 变量除外
 *     3. 没写返回类型、推断返回 any 的函数 / 方法 / 箭头函数 / getter
 *   空对象计数：
 *     没写类型注解、被推断成空对象字面量 `{}` 的属性 / 变量 / 参数（`config = {}`），
 *     下游访问任何字段都会编译报错，等同于把类型问题推给使用方。
 *
 * 规则：每个文件的两项计数都不得超过基线，合计也不得超过基线；基线里没有的新文件必须为 0。
 * --freeze 只在不升的前提下收紧基线（棘轮）；v1 基线升级到 v2 时用 --freeze --init。
 *
 * 用法：node gates/any-count.js [--list | --sites [类别] | --check | --freeze [--init] | --selftest | --file <路径>]
 * 退出码：0 通过 / 1 不通过 / 2 用法或环境错误
 */
'use strict';

const fs = require('fs');
const path = require('path');

// ---- 各仓库只改这里 ---------------------------------------------------------
const CONFIG = {
  name: 'dui',
  srcDir: 'src', // 计数范围（相对仓库根）
  tsconfig: 'src/tsconfig.lib.json', // 建 Program 用的配置（与库构建一致）
  skipDirs: ['node_modules', 'dist', '__tests__', '.angular', 'vendor'],
};
// -----------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, CONFIG.srcDir);
const BASELINE_FILE = path.join(__dirname, 'any-baseline.json');
const BASELINE_VERSION = 2;

let ts;
try {
  ts = require(path.join(ROOT, 'node_modules', 'typescript'));
} catch (e) {
  console.error('G-ANY 需要 node_modules/typescript：' + e.message);
  process.exit(2);
}

// ---------------------------------------------------------------- 计数核心 ----

const isAny = (t) => !!t && (t.flags & ts.TypeFlags.Any) !== 0;

function isEmptyObjectLiteral(checker, t) {
  if (!t || !(t.flags & ts.TypeFlags.Object)) return false;
  // 拓宽后的 `{}` 是 Anonymous，未拓宽时是 ObjectLiteral；接口 / 类不算
  if (!(t.objectFlags & (ts.ObjectFlags.ObjectLiteral | ts.ObjectFlags.Anonymous))) return false;
  return (
    checker.getPropertiesOfType(t).length === 0 &&
    checker.getSignaturesOfType(t, ts.SignatureKind.Call).length === 0 &&
    checker.getSignaturesOfType(t, ts.SignatureKind.Construct).length === 0 &&
    checker.getIndexInfosOfType(t).length === 0
  );
}

/** 函数类节点里需要检查推断返回类型的那些 */
function isReturnCandidate(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isArrowFunction(node) ||
    ts.isFunctionExpression(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isMethodSignature(node)
  );
}

/** 声明类节点：没写注解时看推断类型 */
function isDeclCandidate(node) {
  return (
    ts.isParameter(node) ||
    ts.isPropertyDeclaration(node) ||
    ts.isPropertySignature(node) ||
    ts.isVariableDeclaration(node)
  );
}

/** 这些类型节点本身不判断，只往里走 */
function isPassThroughTypeNode(node) {
  return (
    ts.isExpressionWithTypeArguments(node) || // extends Base<any> 里的 any 仍会被数到
    ts.isTypePredicateNode(node) ||
    ts.isThisTypeNode(node) ||
    node.kind === ts.SyntaxKind.JSDocTypeExpression
  );
}

/**
 * 统计一个源文件。返回 { any, emptyObj, sites }，sites 为 [行号, 类别, 片段]。
 */
function countFile(checker, sf, collectSites) {
  let any = 0;
  let emptyObj = 0;
  const sites = [];
  const hit = (node, kind) => {
    if (!collectSites) return;
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    sites.push([line + 1, kind, node.getText(sf).split('\n')[0].slice(0, 80)]);
  };

  const visit = (node) => {
    // JSDoc 不算
    if (node.kind >= ts.SyntaxKind.FirstJSDocNode && node.kind <= ts.SyntaxKind.LastJSDocNode) return;

    // 1. 写出来的类型节点
    if (ts.isTypeNode(node) && !isPassThroughTypeNode(node)) {
      let t;
      try {
        t = checker.getTypeFromTypeNode(node);
      } catch (e) {
        t = undefined;
      }
      if (isAny(t)) {
        any++;
        hit(node, node.kind === ts.SyntaxKind.AnyKeyword ? 'any' : 'any-alias');
        return; // 一个节点只算一次
      }
    }

    // 2. 未注解的声明
    if (isDeclCandidate(node) && !node.type) {
      const inCatch = ts.isVariableDeclaration(node) && node.parent && ts.isCatchClause(node.parent);
      const isThisParam = ts.isParameter(node) && ts.isIdentifier(node.name) && node.name.text === 'this';
      if (!inCatch && !isThisParam) {
        let t;
        try {
          t = checker.getTypeAtLocation(node.name);
        } catch (e) {
          t = undefined;
        }
        if (isAny(t)) {
          any++;
          hit(node, 'implicit');
        } else if (
          !ts.isParameter(node) || node.initializer // 参数只在有 `= {}` 初值时算
        ) {
          if (node.initializer && isEmptyObjectLiteral(checker, t)) {
            emptyObj++;
            hit(node, 'empty-object');
          }
        }
      }
    }

    // 3. 推断返回 any 的函数
    if (isReturnCandidate(node) && !node.type) {
      let rt;
      try {
        const sig = checker.getSignatureFromDeclaration(node);
        rt = sig && checker.getReturnTypeOfSignature(sig);
      } catch (e) {
        rt = undefined;
      }
      if (isAny(rt)) {
        any++;
        hit(node.name || node, 'implicit-return');
      }
    }

    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sf, visit);
  return { any, emptyObj, sites };
}

// ---------------------------------------------------------------- 建 Program ----

function inScope(fileName) {
  const rel = path.relative(SRC, fileName);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
  if (!/\.tsx?$/.test(fileName) || /\.(spec|test|d)\.tsx?$/.test(fileName)) return false;
  return !rel.split(path.sep).some((seg) => CONFIG.skipDirs.includes(seg));
}

function buildProgram() {
  const cfgPath = path.join(ROOT, CONFIG.tsconfig);
  const raw = ts.readConfigFile(cfgPath, ts.sys.readFile);
  if (raw.error) {
    console.error('读取 ' + CONFIG.tsconfig + ' 失败：' + ts.flattenDiagnosticMessageText(raw.error.messageText, '\n'));
    process.exit(2);
  }
  const parsed = ts.parseJsonConfigFileContent(raw.config, ts.sys, path.dirname(cfgPath));
  return ts.createProgram({ rootNames: parsed.fileNames, options: { ...parsed.options, noEmit: true } });
}

function scanAll(collectSites) {
  const program = buildProgram();
  const checker = program.getTypeChecker();
  const files = {};
  const sites = {};
  for (const sf of program.getSourceFiles()) {
    if (sf.isDeclarationFile || !inScope(sf.fileName)) continue;
    const r = countFile(checker, sf, collectSites);
    const rel = path.relative(ROOT, sf.fileName).split(path.sep).join('/');
    if (r.any || r.emptyObj) files[rel] = { any: r.any, emptyObj: r.emptyObj };
    if (collectSites && r.sites.length) sites[rel] = r.sites;
  }
  const sum = (k) => Object.values(files).reduce((a, f) => a + f[k], 0);
  return { files, sites, any: sum('any'), emptyObj: sum('emptyObj') };
}

// ---------------------------------------------------------------- 自检 ----

function countSnippet(src) {
  const fileName = path.join(ROOT, '__g_any_selftest__.ts');
  const options = {
    strict: false,
    noImplicitAny: false,
    target: ts.ScriptTarget.ES2022,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
    noEmit: true,
    skipLibCheck: true,
    types: [],
  };
  const host = ts.createCompilerHost(options);
  const orig = host.getSourceFile.bind(host);
  host.getSourceFile = (f, lv) => (path.resolve(f) === fileName ? ts.createSourceFile(f, src, lv, true) : orig(f, lv));
  const fileExists = host.fileExists.bind(host);
  host.fileExists = (f) => path.resolve(f) === fileName || fileExists(f);
  const program = ts.createProgram({ rootNames: [fileName], options, host });
  const sf = program.getSourceFile(fileName);
  return countFile(program.getTypeChecker(), sf, false);
}

function selftest() {
  // [说明, 源码, 期望 any, 期望 emptyObj]
  const cases = [
    ['显式 any 注解', 'let a: any = 1;', 1, 0],
    ['as any', 'declare const y: number; (y as any).toFixed();', 1, 0],
    ['any[] 与 Array<any>', 'const c: Array<any> = []; const d: any[] = [];', 2, 0],
    ['删注解后的隐式 any 参数', 'export function f(x) { return 1; }', 1, 0],
    ['隐式 any 类属性（无类型无初值）', 'export class K { v; }', 1, 0],
    ['ReturnType<typeof JSON.parse> 凑数', 'let b: ReturnType<typeof JSON.parse> = 1;', 1, 0],
    ['泛型参数里的 ReturnType<typeof JSON.parse>', 'let e: Array<ReturnType<typeof JSON.parse>> = [];', 1, 0],
    ['any 别名：定义一次 + 使用一次', 'type Loose = any; let l: Loose = 1;', 2, 0],
    ['JSON.parse 推断出的变量与返回值', 'export function h(s: string) { const v = JSON.parse(s); return v; }', 2, 0],
    ['`config = {}` 推断为空对象', 'export class C { config = {}; }', 0, 1],
    ['注释与字符串里的 any 不计', "// let a: any\n/** @param {any} x */ const s: string = 'any as any';", 0, 0],
    ['unknown 与具体类型不计', 'let u: unknown; let n = 1; export function g(s: string): string { return s; }', 0, 0],
    ['带字段的配置不计', 'export class D { config: { title?: string } = {}; cfg = { a: 1 }; }', 0, 0],
    ['catch 变量不计', 'try { /* */ } catch (e) { /* */ }', 0, 0],
  ];
  let fails = 0;
  for (const [desc, src, wantAny, wantEmpty] of cases) {
    const r = countSnippet(src);
    const ok = r.any === wantAny && r.emptyObj === wantEmpty;
    console.log(`${ok ? '✓' : '✗'} ${desc}（any ${r.any}/${wantAny}，空对象 ${r.emptyObj}/${wantEmpty}）`);
    if (!ok) fails++;
  }
  return fails === 0;
}

// ---------------------------------------------------------------- 主流程 ----

function readBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) return null;
  return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
}

function compare(cur, base) {
  const problems = [];
  for (const [f, c] of Object.entries(cur.files)) {
    const b = base.files[f] || { any: 0, emptyObj: 0 };
    if (c.any > b.any) problems.push(`${f}：any ${c.any} > 基线 ${b.any}`);
    if (c.emptyObj > b.emptyObj) problems.push(`${f}：空对象 ${c.emptyObj} > 基线 ${b.emptyObj}`);
  }
  if (cur.any > base.any) problems.push(`合计 any ${cur.any} > 基线 ${base.any}`);
  if (cur.emptyObj > base.emptyObj) problems.push(`合计空对象 ${cur.emptyObj} > 基线 ${base.emptyObj}`);
  return problems;
}

function writeBaseline(cur) {
  const sorted = {};
  for (const f of Object.keys(cur.files).sort()) sorted[f] = cur.files[f];
  const out = {
    version: BASELINE_VERSION,
    metric: 'checker：写出的 any 类型节点 + 隐式 any 声明 + 推断 any 返回值；空对象 = 推断为 {} 的声明',
    any: cur.any,
    emptyObj: cur.emptyObj,
    files: sorted,
  };
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(out, null, 2) + '\n');
}

const args = process.argv.slice(2);
const mode = args[0] || '';

if (mode === '--selftest') process.exit(selftest() ? 0 : 1);

if (mode === '--check' || mode === '--freeze') {
  const log = console.log;
  console.log = () => undefined;
  const ok = selftest();
  console.log = log;
  if (!ok) {
    console.error('✗ G-ANY 自检未通过：计数器的区分力已失效。运行 --selftest 查看。');
    process.exit(1);
  }
}

if (mode === '--file') {
  const target = path.resolve(args[1] || '');
  const program = buildProgram();
  const sf = program.getSourceFile(target);
  if (!sf) {
    console.error('不在 Program 里：' + target);
    process.exit(2);
  }
  const r = countFile(program.getTypeChecker(), sf, true);
  r.sites.forEach(([l, k, s]) => console.log(`${String(l).padStart(5)}  ${k.padEnd(16)} ${s}`));
  console.log(`any ${r.any}，空对象 ${r.emptyObj}`);
  process.exit(0);
}

const cur = scanAll(mode === '--list' || mode === '--sites');

if (mode === '--sites') {
  // 逐处列出全部命中，可用第二个参数按类别过滤（any / any-alias / implicit / implicit-return / empty-object）
  const kind = args[1];
  for (const [f, list] of Object.entries(cur.sites)) {
    for (const [l, k, s] of list) if (!kind || k === kind) console.log(`${f}:${l}\t${k}\t${s}`);
  }
} else if (mode === '--list') {
  Object.entries(cur.files)
    .sort((a, b) => b[1].any + b[1].emptyObj - (a[1].any + a[1].emptyObj))
    .forEach(([f, c]) => console.log(`${String(c.any).padStart(5)} ${String(c.emptyObj).padStart(4)}  ${f}`));
  console.log(`合计 any ${cur.any}，空对象 ${cur.emptyObj}，${Object.keys(cur.files).length} 个文件（列：any 空对象 文件）`);
} else if (mode === '--freeze') {
  const base = readBaseline();
  const init = args.includes('--init');
  if (base && base.version === BASELINE_VERSION) {
    const problems = compare(cur, base);
    if (problems.length) {
      console.error('✗ 棘轮：基线只许下降，以下各项比基线高，拒绝冻结：');
      problems.forEach((p) => console.error('    ' + p));
      process.exit(1);
    }
  } else if (!init) {
    console.error('基线不是 v2 格式。首次切换到 checker 计数请用 --freeze --init。');
    process.exit(2);
  }
  writeBaseline(cur);
  console.log(`已冻结基线 gates/any-baseline.json：any ${cur.any}，空对象 ${cur.emptyObj}，${Object.keys(cur.files).length} 个文件`);
} else if (mode === '--check') {
  const base = readBaseline();
  if (!base || base.version !== BASELINE_VERSION) {
    console.error('基线 gates/any-baseline.json 不存在或不是 v2 格式，先运行 --freeze --init');
    process.exit(2);
  }
  const problems = compare(cur, base);
  if (problems.length) {
    console.log(`✗ G-ANY 不通过（${problems.length} 项超过基线）：`);
    problems.slice(0, 50).forEach((p) => console.log('    ' + p));
    console.log('  新代码请写出具体类型；`--file <路径>` 可列出某文件的每一处。');
    process.exit(1);
  }
  const down = cur.any < base.any || cur.emptyObj < base.emptyObj;
  console.log(
    `✓ G-ANY 通过：any ${cur.any} / 基线 ${base.any}，空对象 ${cur.emptyObj} / 基线 ${base.emptyObj}` +
      (down ? '（已下降，请 npm run gate:any:freeze 收紧基线）' : '')
  );
} else {
  console.log(`${CONFIG.name}：any ${cur.any}，空对象 ${cur.emptyObj}，${Object.keys(cur.files).length} 个文件（--list 查看）`);
}
