#!/usr/bin/env node
/**
 * G-I18N —— 语种包完整性门。
 *
 * 检查范围：DIRS 列出的语种目录（dui 主包、file 模块、testdui 公共包——复核 F12 涉及的三处）。
 * fileview（PDF 查看器）语种包有大量既有缺口（zh_CN / zh_TW 各缺约 770 键），不在本门范围，另行处理。
 *
 * 对每个目录：
 *   1. 各语种的键集合必须与 en_US 一致（不缺、不多）；
 *   2. 非英语语种（en_* 以外）的值不得与 en_US 原文逐字相同——那是没翻译。
 *      例外：只含占位符 / 数字 / 标点的值，ALLOW 列出的专有名词 / 单位，
 *      以及 i18n-cognates.json 里逐条确认过的同形词（如德语 Name、法语 Description）。
 *
 * 用法：node gates/i18n-check.js [--selftest] [--list]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIRS = ['src/i18n/dui', 'src/i18n/dui/file', 'projects/testdui/src/i18n/public'];
/** 各语种都照写原文的专有名词 / 技术词 */
const ALLOW = new Set([
  'OK', 'PDF', 'URL', 'ID', 'API', 'JSON', 'XML', 'CSV', 'HTML', 'SVG', 'PNG', 'JPG', 'GIF', 'Excel', 'Word', 'Markdown',
  'dotos', 'DOTOS', 'GitHub', 'Email', 'E-mail', 'RGB', 'HEX', 'HSL', 'RGBA', 'Monaco', 'Tab', 'Ctrl', 'Shift', 'Alt',
  'DUI', 'Dotos', 'Duix', 'Google', 'Alfresco', 'ECM', 'BPM', 'ADF', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
]);
/** 各语种与英文同形的正确译法（逐条确认，见 i18n-cognates.json 的说明） */
const COGNATES = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n-cognates.json'), 'utf8'));

function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

/** 值里去掉占位符、数字、标点后若不剩字母，视为无需翻译 */
function needsTranslation(value) {
  if (typeof value !== 'string') return false;
  if (ALLOW.has(value.trim())) return false;
  const stripped = value.replace(/\{\{[^}]*\}\}|\{[^}]*\}|%[sd]|<[^>]+>/g, '').replace(/[\d\s\p{P}\p{S}]/gu, '');
  return /\p{L}/u.test(stripped);
}

function checkDir(dir) {
  const problems = [];
  const files = fs.readdirSync(dir).filter((f) => /^[a-z]{2}_[A-Za-z0-9]+\.json$/.test(f));
  if (!files.includes('en_US.json')) return problems;
  const en = flatten(JSON.parse(fs.readFileSync(path.join(dir, 'en_US.json'), 'utf8')), '', {});
  for (const f of files) {
    if (f === 'en_US.json') continue;
    const lang = f.replace(/\.json$/, '');
    const cur = flatten(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), '', {});
    const rel = path.relative(ROOT, path.join(dir, f));
    for (const k of Object.keys(en)) if (!(k in cur)) problems.push(`${rel}：缺键 ${k}`);
    for (const k of Object.keys(cur)) if (!(k in en)) problems.push(`${rel}：多出键 ${k}（en_US 没有）`);
    if (lang.startsWith('en_')) continue;
    for (const [k, v] of Object.entries(cur)) {
      if (k in en && v === en[k] && needsTranslation(v) && !(COGNATES[lang] || []).includes(v)) problems.push(`${rel}：${k} 未翻译（与 en_US 相同："${String(v).slice(0, 40)}"）`);
    }
  }
  return problems;
}

if (process.argv.includes('--selftest')) {
  const cases = [
    ['普通英文句子要翻译', 'You do not have permission', true],
    ['占位符与数字不用翻译', '{{count}} / 100', false],
    ['专有名词照写', 'PDF', false],
    ['中文本身就是翻译', '没有权限', true],
  ];
  let bad = 0;
  for (const [desc, v, want] of cases) {
    const got = needsTranslation(v);
    console.log(`${got === want ? '✓' : '✗'} ${desc}`);
    if (got !== want) bad++;
  }
  process.exit(bad ? 1 : 0);
}

const all = [];
for (const d of DIRS) all.push(...checkDir(path.join(ROOT, d)));
if (all.length) {
  console.error(`✗ G-I18N：${all.length} 处问题`);
  all.slice(0, process.argv.includes('--list') ? all.length : 60).forEach((p) => console.error('    ' + p));
  process.exit(1);
}
console.log('✓ G-I18N：' + DIRS.join('、') + ' 各语种键集合一致，非英语语种没有照抄英文原文');
