/**
 * @fileoverview Node AST unit test verifying every non-test Component decorator explicitly declares changeDetection.
 * Kept under tools/ng-upgrade/ so Karma browser Webpack builds under src/ never pull in Node fs/path.
 * @zh Node AST 静态守卫单测：校验所有非测试 Component 装饰器显式声明 changeDetection，避免 Karma 浏览器打包引入 Node fs/path。
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

describe('W1 @Component explicit changeDetection AST guard', () => {
  it('explicitly declares changeDetection on every non-test @Component to avoid Angular 22 silent OnPush default', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const collectTsFiles = (dir: string, out: string[] = []): string[] => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          collectTsFiles(full, out);
        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts') && !entry.name.endsWith('.d.ts')) {
          out.push(full);
        }
      }
      return out;
    };

    const files = [
      ...collectTsFiles(path.join(repoRoot, 'src')),
      ...collectTsFiles(path.join(repoRoot, 'projects/testdui/src')),
    ];
    const missingChangeDetection: string[] = [];
    let componentCount = 0;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('@Component')) {
        continue;
      }
      const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
      const visit = (node: ts.Node): void => {
        if (ts.isClassDeclaration(node)) {
          const decorators = ts.getDecorators(node) ?? [];
          for (const dec of decorators) {
            if (ts.isCallExpression(dec.expression) && dec.expression.expression.getText(sf) === 'Component') {
              componentCount++;
              const meta = dec.expression.arguments[0];
              if (meta && ts.isObjectLiteralExpression(meta)) {
                const hasCd = meta.properties.some((p) => p.name?.getText(sf) === 'changeDetection');
                if (!hasCd) {
                  missingChangeDetection.push(`${path.relative(repoRoot, file)}:${node.name?.text ?? '<anon>'}`);
                }
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }

    expect(componentCount).toBeGreaterThan(50);
    expect(missingChangeDetection).toEqual([]);
  });
});
