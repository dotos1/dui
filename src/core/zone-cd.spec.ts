/**
 * @fileoverview Unit tests for W1 explicit Zone.js change detection (`provideZoneChangeDetection({ eventCoalescing: true })`).
 * @zh W1 显式声明 Zone 变更检测（`provideZoneChangeDetection({ eventCoalescing: true })`）与 `setTimeout` 自动视图刷新单测。
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { ChangeDetectionStrategy, Component, NgModule, NgZone, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

interface ZoneLike {
  current?: {
    name?: string;
  };
}

@Component({
  selector: 'w1-zone-timer-probe',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `<div class="timer-status">{{ label }}</div>`,
})
class ZoneTimerProbeComponent {
  label = 'initial';

  scheduleAsyncUpdate(): void {
    setTimeout(() => {
      this.label = 'updated-from-setTimeout';
    }, 15);
  }
}

@NgModule({
  declarations: [ZoneTimerProbeComponent],
  exports: [ZoneTimerProbeComponent],
})
class ZoneTimerProbeModule {}

describe('W1 Explicit Zone Change Detection (provideZoneChangeDetection)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneTimerProbeModule],
      providers: [provideZoneChangeDetection({ eventCoalescing: true })],
    }).compileComponents();
  });

  it('runs inside the angular Zone and refreshes Default component DOM automatically after setTimeout', async () => {
    const ngZone = TestBed.inject(NgZone);
    const fixture = TestBed.createComponent(ZoneTimerProbeComponent);
    fixture.autoDetectChanges(true);

    let zoneNameInsideRun = '';
    let inAngularZone = false;
    ngZone.run(() => {
      const zoneGlobal = Reflect.get(globalThis, 'Zone') as ZoneLike | undefined;
      zoneNameInsideRun = zoneGlobal?.current?.name ?? '';
      inAngularZone = NgZone.isInAngularZone();
    });

    expect(zoneNameInsideRun).toBe('angular');
    expect(inAngularZone).toBe(true);

    const statusEl = (fixture.nativeElement as HTMLElement).querySelector('.timer-status') as HTMLElement;
    expect(statusEl.textContent).toBe('initial');

    ngZone.run(() => {
      fixture.componentInstance.scheduleAsyncUpdate();
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 60);
    });

    expect(statusEl.textContent).toBe('updated-from-setTimeout');
    fixture.destroy();
  });

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

    expect(componentCount).toBeGreaterThanOrEqual(290);
    expect(missingChangeDetection).toEqual([]);
  });
});
