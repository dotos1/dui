/**
 * @fileoverview Unit tests for W4 `@dotos/dui/common/animations` verifying real `@angular/animations` triggers.
 * @zh W4 `@dotos/dui/common/animations` 真实 `@angular/animations` 动画触发器与 `ToggleDirective` 单元测试。
 */

import { AnimationMetadataType } from '@angular/animations';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { fadeInContent, slideCalendar } from '../../form/date/picker/datetimepicker-animations';
import { duiCollapseAnimation } from '../message/collapse.animation';
import { transformPopover } from '../popover/popover-animations';
import {
  AnimationsModule,
  BounceAnimation,
  CollapseAnimation,
  FadeInOutAnimation,
  FlashAnimation,
  HeadshakeAnimation,
  JelloAnimation,
  PulseAnimation,
  RotateAnimation,
  ToggleDirective,
  duiAnimations,
} from './public-api';

@Component({
  standalone: false,
  animations: [...duiAnimations, BounceAnimation, CollapseAnimation, FadeInOutAnimation],
  template: `
    <div class="anim-host" [@animate]="{ value: '*', params: { opacity: '0', duration: '120ms' } }">Animated</div>
    <div class="toggle-target" [duiToggle]="collapsed" [duration]="80">Collapsible Content</div>
  `,
})
class RealAnimationsHostComponent {
  collapsed = false;
}

describe('W4 Real @angular/animations Triggers & ToggleDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AnimationsModule],
      declarations: [RealAnimationsHostComponent],
    }).compileComponents();
  });

  it('exports non-empty real @angular/animations Trigger metadata in duiAnimations and all 9 XxxAnimation symbols', () => {
    expect(Array.isArray(duiAnimations)).toBe(true);
    expect(duiAnimations.length).toBeGreaterThanOrEqual(10);

    for (const trig of duiAnimations) {
      expect(trig.type).toBe(AnimationMetadataType.Trigger);
      expect(Array.isArray(trig.definitions)).toBe(true);
      expect(trig.definitions.length).toBeGreaterThan(0);
    }

    const namedTriggers = [
      { trig: BounceAnimation, expectedName: 'duiBounce' },
      { trig: CollapseAnimation, expectedName: 'duiCollapse' },
      { trig: FadeInOutAnimation, expectedName: 'duiFadeInOut' },
      { trig: FlashAnimation, expectedName: 'duiFlash' },
      { trig: HeadshakeAnimation, expectedName: 'duiHeadshake' },
      { trig: JelloAnimation, expectedName: 'duiJello' },
      { trig: PulseAnimation, expectedName: 'duiPulse' },
      { trig: RotateAnimation, expectedName: 'duiRotate' },
      { trig: duiCollapseAnimation, expectedName: 'duiCollapse' },
      { trig: transformPopover, expectedName: 'transformPopover' },
      { trig: fadeInContent, expectedName: 'fadeInContent' },
      { trig: slideCalendar, expectedName: 'slideCalendar' },
    ];

    for (const item of namedTriggers) {
      expect(item.trig.type).toBe(AnimationMetadataType.Trigger);
      expect(item.trig.name).toBe(item.expectedName);
      expect(item.trig.definitions.length).toBeGreaterThan(0);
    }
    expect(ToggleDirective).toBeDefined();
  });

  it('binds [@animate] and [duiToggle] without NG05105 or unregistered trigger errors', () => {
    const fixture = TestBed.createComponent(RealAnimationsHostComponent);
    fixture.detectChanges();

    const animEl = fixture.nativeElement.querySelector('.anim-host') as HTMLElement;
    expect(animEl.textContent).toContain('Animated');

    const toggleEl = fixture.nativeElement.querySelector('.toggle-target') as HTMLElement;
    expect(toggleEl).toBeTruthy();

    fixture.componentInstance.collapsed = true;
    fixture.detectChanges();
    fixture.destroy();
  });
});
