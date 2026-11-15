/**
 * @fileoverview Browser & JSDOM unit tests for W1 explicit Zone.js change detection (`provideZoneChangeDetection({ eventCoalescing: true })`).
 * @zh W1 显式声明 Zone 变更检测（`provideZoneChangeDetection({ eventCoalescing: true })`）与 `setTimeout` 自动视图刷新单测（兼容 Karma 浏览器与 Jest）。
 */

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
});
