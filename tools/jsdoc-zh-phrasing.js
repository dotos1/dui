#!/usr/bin/env node
/**
 * 复核 F6：机器生成的 @zh 说明里夹着没翻译的英文动词（「用于do移除」「用于construct按钮」）。
 * 只改「用于 + 英文动词」这一种固定格式，按词表换成中文；专有名词（Material、DUI、RGB……）不动。
 * 用法：node tools/jsdoc-zh-phrasing.js [--check]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const VERBS = {
  do: '执行', track: '跟踪', intercept: '拦截', off: '取消监听', observe: '观察', highlight: '高亮', eval: '求值',
  define: '定义', throw: '抛出', go: '跳转到', try: '尝试', scan: '扫描', recalculate: '重新计算', exit: '退出',
  compile: '编译', adjust: '调整', unminify: '展开压缩的', propagate: '传播', mixin: '混入', minify: '压缩',
  interpolate: '插值', have: '具有', ensure: '确保', decorate: '装饰', coerce: '强制转换', clean: '清理',
  watch: '监听', transfer: '转移', send: '发送', construct: '构造', deep: '深度', login: '登录', private: '内部',
  swaping: '交换', swapping: '交换', invoke: '调用', bind: '绑定', unbind: '解绑', emit: '发出', parse: '解析',
  dispatch: '派发', render: '渲染', resolve: '解析', register: '注册', schedule: '调度', serialize: '序列化',
  normalize: '规范化', sanitize: '清洗', merge: '合并', patch: '修补', flush: '刷新', notify: '通知', toggle: '切换',
  wrap: '包装', unwrap: '解包', lookup: '查找', collect: '收集', convert: '转换', format: '格式化', validate: '校验',
};
const re = /(@zh [^\n]*?用于)([a-z]+)(?=[^a-zA-Z])/g;
const check = process.argv.includes('--check');
let n = 0;
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.ts$/.test(e.name)) {
      const t = fs.readFileSync(p, 'utf8');
      let local = 0;
      const out = t.replace(re, (m, pre, w) => {
        const zh = VERBS[w.toLowerCase()];
        if (!zh) return m;
        local++;
        return pre + zh;
      });
      if (local) {
        n += local;
        files.push(path.relative(SRC, p));
        if (!check) fs.writeFileSync(p, out);
      }
    }
  }
}
walk(SRC);
if (check && n) {
  console.error(`✗ @zh 说明里还有 ${n} 处「用于 + 英文动词」`);
  process.exit(1);
}
console.log(check ? '✓ @zh 说明里没有词表内的「用于 + 英文动词」' : `已改写 ${n} 处，${files.length} 个文件`);
