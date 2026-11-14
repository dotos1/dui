/**
 * @fileoverview Unit tests for M3-4 `@dotos/dui/common/animations` (zero `@angular/animations` + JSDOM-safe `ToggleDirective`).
 * @zh `@dotos/dui/common/animations`（零 `@angular/animations` 依赖兼容导出与 JSDOM 安全降级 `ToggleDirective`）单元测试。
 */

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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
  customAnimation,
  duiAnimations,
} from './public-api';

@Component({
  standalone: false,
  template: `<div class="toggle-target" [duiToggle]="collapsed()" [duration]="80">Collapsible Content</div>`,
})
class ToggleHostComponent {
  collapsed = signal(false);
}

describe('AnimationsModule & ToggleDirective (M3-4)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationsModule],
      declarations: [ToggleHostComponent],
    }).compileComponents();
  });

  it('preserves all legacy symbol exports without @angular/animations runtime dependency', () => {
    expect(Array.isArray(duiAnimations)).toBe(true);
    expect(duiAnimations.length).toBe(0);
    expect(customAnimation.name).toBe('animate');
    expect(BounceAnimation.name).toBe('duiBounce');
    expect(CollapseAnimation.name).toBe('duiCollapse');
    expect(FadeInOutAnimation.name).toBe('duiFadeInOut');
    expect(FlashAnimation.name).toBe('duiFlash');
    expect(HeadshakeAnimation.name).toBe('duiHeadshake');
    expect(JelloAnimation.name).toBe('duiJello');
    expect(PulseAnimation.name).toBe('duiPulse');
    expect(RotateAnimation.name).toBe('duiRotate');
    expect(ToggleDirective).toBeDefined();
  });

  it('deterministically toggles display and ARIA attributes in JSDOM when el.animate is absent', () => {
    const fixture = TestBed.createComponent(ToggleHostComponent);
    fixture.detectChanges();

    const targetEl = fixture.nativeElement.querySelector('.toggle-target') as HTMLElement;
    expect(targetEl.getAttribute('aria-expanded')).toBe('true');
    expect(targetEl.getAttribute('aria-hidden')).toBe('false');
    expect(targetEl.style.display).not.toBe('none');

    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();

    expect(targetEl.getAttribute('aria-expanded')).toBe('false');
    expect(targetEl.getAttribute('aria-hidden')).toBe('true');
    expect(targetEl.style.display).toBe('none');

    fixture.componentInstance.collapsed.set(false);
    fixture.detectChanges();

    expect(targetEl.getAttribute('aria-expanded')).toBe('true');
    expect(targetEl.style.display).not.toBe('none');
    fixture.destroy();
  });
});
