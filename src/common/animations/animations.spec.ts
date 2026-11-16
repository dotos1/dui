/**
 * @fileoverview Unit tests for W4 `@dotos1/dui/common/animations` verifying real `@angular/animations` triggers.
 * @zh W4 `@dotos1/dui/common/animations` 真实 `@angular/animations` 动画触发器与 `ToggleDirective` 单元测试。
 */

import { AnimationMetadataType } from '@angular/animations';
import { AnimationDriver, ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';
import { Component, Input } from '@angular/core';
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
  styles: ['.collapse-target { height: 120px; }'],
  template: `
    <div class="anim-host" [@animate]="{ value: '*', params: { opacity: '0', duration: '120ms' } }">Animated</div>
    <div class="collapse-target" [@duiCollapse]="collapseState">Collapse Panel</div>
    <div class="fade-target" [@fadeInOut]="fadeState">Fade Panel</div>
    <div class="toggle-target" style="height: 80px" [duiToggle]="collapsed" [duration]="80">Collapsible Content</div>
  `,
})
class RealAnimationsHostComponent {
  @Input() collapseState: '0' | '1' = '0';
  @Input() fadeState: '0' | '1' = '1';
  @Input() collapsed = false;
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

  it('collapses height to 0px and hides element when [@duiCollapse] and [duiToggle] transition to collapsed state', async () => {
    const engine = TestBed.inject(AnimationEngine);
    const driver = TestBed.inject(AnimationDriver);
    const animateSpy = spyOn(driver, 'animate').and.callThrough();

    const styleEl = document.createElement('style');
    styleEl.textContent = '.collapse-target { height: 120px; }';
    document.head.appendChild(styleEl);
    const fixture = TestBed.createComponent(RealAnimationsHostComponent);
    document.body.appendChild(fixture.nativeElement);
    const flushAnim = async () => {
      engine.flush();
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
      engine.flush();
    };
    try {
      fixture.detectChanges();
      await flushAnim();
      animateSpy.calls.reset();

      const animEl = fixture.nativeElement.querySelector('.anim-host') as HTMLElement;
      expect(animEl.textContent).toContain('Animated');

      const collapseEl = fixture.nativeElement.querySelector('.collapse-target') as HTMLElement;
      const fadeEl = fixture.nativeElement.querySelector('.fade-target') as HTMLElement;
      const toggleEl = fixture.nativeElement.querySelector('.toggle-target') as HTMLElement;
      expect(getComputedStyle(collapseEl).height).toBe('120px');
      expect(fadeEl.style.display).toBe('block');
      expect(fadeEl.style.opacity).toBe('1');
      expect(toggleEl.getAttribute('aria-expanded')).toBe('true');
      expect(toggleEl.getAttribute('aria-hidden')).toBe('false');
      expect(toggleEl.style.display).not.toBe('none');

      // Trigger [@duiCollapse]="'1'", [@fadeInOut]="'0'", and [duiToggle]="true"
      fixture.componentRef.setInput('collapseState', '1');
      fixture.componentRef.setInput('fadeState', '0');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();
      await flushAnim();
      fixture.detectChanges();

      // Assert real collapsed DOM styles: height -> 0/0px, overflow: hidden, opacity: 0, display: none
      expect(collapseEl.style.height).toMatch(/^0(px)?$/);
      expect(getComputedStyle(collapseEl).height).toMatch(/^0(px)?$/);
      expect(collapseEl.style.overflow).toBe('hidden');
      expect(fadeEl.style.opacity).toBe('0');
      expect(fadeEl.style.display).toBe('none');
      expect(toggleEl.getAttribute('aria-expanded')).toBe('false');
      expect(toggleEl.getAttribute('aria-hidden')).toBe('true');
      expect(toggleEl.style.display).toBe('none');
      expect(animateSpy.calls.count()).toBeGreaterThanOrEqual(2);

      // Expand back [@fadeInOut]="'1'" and [duiToggle]="false" and assert visibility restoration
      fixture.componentRef.setInput('fadeState', '1');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();
      await flushAnim();
      fixture.detectChanges();

      expect(fadeEl.style.opacity).toBe('1');
      expect(fadeEl.style.display).toBe('block');
      expect(toggleEl.getAttribute('aria-expanded')).toBe('true');
      expect(toggleEl.getAttribute('aria-hidden')).toBe('false');
      expect(toggleEl.style.display).toBe('');
    } finally {
      fixture.nativeElement.remove();
      styleEl.remove();
      fixture.destroy();
    }
  });
});
