#!/usr/bin/env node
// 把 dist/dui 发到 GitHub Packages（@dotos1/dui）。由 package-ci 的发布步骤经 npm run publish 调用。
// 库里的包名是 @dotos/dui，消费方用别名 "@dotos/dui": "npm:@dotos1/dui@…"；发布前改名，与 ops 的 bin/publish-all.sh 同一做法。
// 令牌只取发布步骤环境变量 NODE_AUTH_TOKEN（GITHUB_TOKEN，packages: write），写进临时 npmrc，用完删。
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist', 'dui');
const pkgFile = path.join(dist, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
pkg.name = '@dotos1/dui';
pkg.repository = { type: 'git', url: 'git+https://github.com/dotos1/dui.git' };
pkg.publishConfig = { registry: 'https://npm.pkg.github.com' };
fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
for (const f of fs.readdirSync(dist)) if (f.endsWith('.tgz')) fs.unlinkSync(path.join(dist, f));

const token = process.env.NODE_AUTH_TOKEN;
if (!token) {
  console.error('缺 NODE_AUTH_TOKEN');
  process.exit(1);
}
const rc = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'npmrc-')), '.npmrc');
fs.writeFileSync(rc, `//npm.pkg.github.com/:_authToken=${token}\n`, { mode: 0o600 });
try {
  execFileSync('npm', ['publish', '--ignore-scripts', '--registry', 'https://npm.pkg.github.com'], {
    cwd: dist,
    stdio: 'inherit',
    env: { ...process.env, NPM_CONFIG_USERCONFIG: rc },
  });
  console.log(`已发布 ${pkg.name}@${pkg.version}`);
} finally {
  fs.rmSync(path.dirname(rc), { recursive: true, force: true });
}
