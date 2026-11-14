#!/usr/bin/env node
/**
 * M2.5 专项测试套件：
 * (a) TreeModel / TreeNode 原生 Angular Signal 展开/折叠/选中/激活/过滤无 MobX 响应式与护栏 A get/set 兼容；
 * (b) @dotos/dui/schema validateDuiFormSchema 合法配置与多类错误配置 Finding[] + hint 自愈提示；
 * (c) dui/src 内部零 mobx 包导入且业务组件零 loadTheme 调用；
 * (d) 构建产物 dist/dui/ 包含 standalone、schema 二级入口及 llms.txt、llms-full.txt、skills/dotos-ui-builder/SKILL.md、examples/。
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const require = createRequire(path.join(repoRoot, 'package.json'));
const esbuild = require('esbuild');
const { computed } = require('@angular/core');

function loadTsModule(entryRelPath) {
  const entryAbs = path.join(repoRoot, entryRelPath);
  const buildRes = esbuild.buildSync({
    entryPoints: [entryAbs],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    tsconfig: path.join(repoRoot, 'tsconfig.json'),
    external: [
      '@angular/*',
      'rxjs',
      'rxjs/*',
    ],
  });
  const mod = { exports: {} };
  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', buildRes.outputFiles[0].text);
  fn(mod.exports, require, mod, entryAbs, path.dirname(entryAbs));
  return mod.exports;
}

const { TreeModel } = loadTsModule('src/tree/models/tree.model.ts');
const {
  DUI_FORM_JSON_SCHEMA,
  validateDuiFormSchema,
} = loadTsModule('src/schema/index.ts');

test('(a) TreeModel / TreeNode 基于原生 Signal 实时响应展开/折叠/激活/三态勾选/过滤并兼容护栏 A get/set', () => {
  const treeModel = new TreeModel();
  treeModel.setData({
    nodes: [
      {
        id: 'plant-1',
        name: '一号智造基地',
        children: [
          { id: 'line-1', name: '激光焊接产线' },
          { id: 'line-2', name: '视觉检测工站' },
        ],
      },
      {
        id: 'plant-2',
        name: '二号装配中心',
        children: [
          { id: 'line-3', name: '总装测试台' },
        ],
      },
    ],
    options: {
      useCheckbox: true,
    },
  });

  assert.equal(treeModel.roots.length, 2, '应正确构建 2 个根节点');
  const root1 = treeModel.getNodeById('plant-1');
  const line1 = treeModel.getNodeById('line-1');
  const line2 = treeModel.getNodeById('line-2');
  assert.ok(root1 && line1 && line2);

  // 验证 Angular computed() 可直接追踪 node.isExpanded（无 MobX）
  const root1ExpandedSig = computed(() => root1.isExpanded);
  assert.equal(root1ExpandedSig(), false);

  root1.expand();
  assert.equal(root1.isExpanded, true);
  assert.equal(root1ExpandedSig(), true, '调用 expand() 后 computed Signal 必须实时变为 true');
  assert.equal(treeModel.expandedNodes.length, 1);

  root1.collapse();
  assert.equal(root1ExpandedSig(), false, '调用 collapse() 后 computed Signal 必须实时变为 false');

  // 护栏 A：直接对 treeModel.expandedNodeIds 赋值（向下兼容存量业务仓命令式写法）
  treeModel.expandedNodeIds = { 'plant-1': true, 'plant-2': true };
  assert.equal(root1ExpandedSig(), true, '护栏 A setter 赋值 expandedNodeIds 后必须实时更新 Signal');
  assert.equal(treeModel.expandedNodes.length, 2);

  // 激活状态与 toggleActivated
  const line1ActiveSig = computed(() => line1.isActive);
  assert.equal(line1ActiveSig(), false);
  line1.toggleActivated();
  assert.equal(line1ActiveSig(), true);
  assert.equal(treeModel.getActiveNode().id, 'line-1');

  // 三态复选框级联计算（Signal computed）
  assert.equal(root1.isSelected, false);
  assert.equal(root1.isPartiallySelected, false);
  line1.setIsSelected(true);
  assert.equal(root1.isPartiallySelected, true, '仅选中一个子节点时父节点应处于半选态');
  assert.equal(root1.isSelected, true);

  line2.setIsSelected(true);
  assert.equal(root1.isSelected, true);
  assert.equal(root1.isPartiallySelected, false, '全部子节点选中后父节点应转为全选非半选态');

  // 过滤与清空过滤
  treeModel.filterNodes('视觉检测');
  assert.equal(line2.isHidden, false, '命中过滤词的节点应可见');
  assert.equal(line1.isHidden, true, '未命中过滤词的兄弟节点应隐藏');
  assert.equal(root1.isHidden, false, '包含命中子节点的父节点应保持可见');
  assert.equal(root1.isExpanded, true, '过滤命中后父节点应自动展开');

  treeModel.clearFilter();
  assert.equal(line1.isHidden, false, '清空过滤后所有节点恢复可见');
});

test('(b) @dotos/dui/schema Draft 2020-12 JSON Schema 与 validateDuiFormSchema 自愈提示校验', () => {
  assert.equal(
    DUI_FORM_JSON_SCHEMA.$schema,
    'https://json-schema.org/draft/2020-12/schema',
  );

  // 1. 合法配置校验通过
  const validRes = validateDuiFormSchema({
    id: 'gateway-form',
    title: '边缘网关配置',
    columns: 2,
    density: 'compact',
    fields: [
      { key: 'host', label: '主机地址', type: 'text', required: true },
      {
        key: 'mode',
        label: '运行模式',
        type: 'select',
        options: [
          { label: '主站', value: 'master' },
          { label: '从站', value: 'slave' },
        ],
      },
      { key: 'port', label: '端口', type: 'number', min: 1, max: 65535 },
    ],
  });
  assert.equal(validRes.valid, true);
  assert.equal(validRes.findings.length, 0);
  assert.ok(validRes.schema);

  // 2. 多类错误配置与 AI 自愈 hint 校验
  const invalidRes = validateDuiFormSchema({
    id: '',
    unknownRootFlag: true,
    fields: [
      {
        key: 'username',
        label: '用户名',
        type: 'textfield',
        choices: ['a'],
      },
      {
        key: 'username',
        label: '角色',
        type: 'select',
      },
      {
        key: 'threshold',
        label: '告警阈值',
        type: 'number',
        min: 200,
        max: 50,
      },
    ],
  });

  assert.equal(invalidRes.valid, false);
  const codes = new Set(invalidRes.findings.map((f) => f.code));
  assert.ok(codes.has('INVALID_SCHEMA_ID'), '应检出空 id');
  assert.ok(codes.has('UNKNOWN_ROOT_PROPERTY'), '应检出未知顶层属性');
  assert.ok(codes.has('INVALID_FIELD_TYPE'), '应检出非法字段类型 textfield');
  assert.ok(codes.has('UNKNOWN_FIELD_PROPERTY'), '应检出未知字段属性 choices');
  assert.ok(codes.has('DUPLICATE_FIELD_KEY'), '应检出重复字段 key');
  assert.ok(codes.has('MISSING_FIELD_OPTIONS'), '应检出 select 缺失 options');
  assert.ok(codes.has('MIN_GREATER_THAN_MAX'), '应检出 min > max');

  // 确认每条 Finding 都携带非空自愈 hint，且 textfield 精准提示改为 text
  for (const finding of invalidRes.findings) {
    assert.ok(finding.path.length > 0);
    assert.ok(finding.hint && finding.hint.length > 0, `Finding ${finding.code} 必须提供 hint`);
  }
  const typeFinding = invalidRes.findings.find((f) => f.code === 'INVALID_FIELD_TYPE');
  assert.ok(typeFinding?.hint.includes('"text"'), '误写 textfield 时 hint 应精准提示改为 "text"');
});

test('(c) dui/src 源码零 mobx 外部导入且组件零 loadTheme(...) 调用（仅保留 ThemeService.loadTheme 定义）', () => {
  const srcRoot = path.join(repoRoot, 'src');
  const mobxViolations = [];
  const loadThemeCallers = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
        const rel = path.relative(srcRoot, fullPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        if (/\bfrom\s+['"]mobx(?:-angular)?['"]/.test(content)) {
          mobxViolations.push(rel);
        }
        if (/\.loadTheme\s*\(/.test(content)) {
          loadThemeCallers.push(rel);
        }
      }
    }
  }

  walk(srcRoot);
  assert.deepEqual(mobxViolations, [], 'src 下严禁存在任何 mobx / mobx-angular 导入');
  assert.deepEqual(loadThemeCallers, [], 'src 下组件严禁调用 .loadTheme(...)');

  // 同时确认 ThemeService.loadTheme 方法本身保留以向下兼容业务仓
  const themeSvcText = fs.readFileSync(path.join(srcRoot, 'theme/theme.service.ts'), 'utf8');
  assert.match(themeSvcText, /public\s+loadTheme\s*\(/, 'ThemeService.loadTheme 方法声明必须保留');
});

test('(d) dist/dui 构建产物包含 standalone、schema 二级入口及 llms.txt、llms-full.txt、SKILL.md、examples/', () => {
  const distDir = path.join(repoRoot, 'dist/dui');
  assert.ok(fs.existsSync(distDir), 'dist/dui 构建目录必须存在（请先执行 npm run build-dui）');

  const pkgJson = JSON.parse(fs.readFileSync(path.join(distDir, 'package.json'), 'utf8'));
  assert.equal(pkgJson.version, '8.0.0-next.1');
  assert.ok(pkgJson.exports['./standalone'], 'dist/dui/package.json exports 必须包含 ./standalone');
  assert.ok(pkgJson.exports['./schema'], 'dist/dui/package.json exports 必须包含 ./schema');

  const requiredPaths = [
    'llms.txt',
    'llms-full.txt',
    'skills/dotos-ui-builder/SKILL.md',
    'examples/zoneless-Form.example.ts',
    'examples/zoneless-tree-dock.example.ts',
    'examples/zoneless-tabs-card.example.ts',
    'standalone/package.json',
    'types/dotos-dui-standalone.d.ts',
    'fesm2022/dotos-dui-standalone.mjs',
    'schema/package.json',
    'types/dotos-dui-schema.d.ts',
    'fesm2022/dotos-dui-schema.mjs',
  ];

  for (const rel of requiredPaths) {
    assert.ok(
      fs.existsSync(path.join(distDir, rel)),
      `构建产物缺失必需文件: dist/dui/${rel}`,
    );
  }

  // 验证 fesm2022 为 Partial Ivy 编译产物（含 ɵɵngDeclare* 且不含 Full Ivy ɵɵdefineComponent）
  const standaloneMjs = fs.readFileSync(path.join(distDir, 'fesm2022/dotos-dui-standalone.mjs'), 'utf8');
  assert.match(standaloneMjs, /ɵɵngDeclareComponent/, 'standalone 入口必须为 Partial Ivy 编译格式');
  const fesmDir = path.join(distDir, 'fesm2022');
  for (const file of fs.readdirSync(fesmDir)) {
    if (!file.endsWith('.mjs')) continue;
    const text = fs.readFileSync(path.join(fesmDir, file), 'utf8');
    assert.ok(!text.includes('ɵɵdefineComponent'), `fesm2022/${file} 严禁包含 Full Ivy ɵɵdefineComponent`);
  }
});
